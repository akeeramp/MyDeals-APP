using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingTablesLib : IPricingTablesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public PricingTablesLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        public MyDealsData GetPricingTable(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.PRC_ST,
                    //OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW,
                    OpDataElementType.WIP_DEAL
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PRC_ST,
                    //OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW
                };

            return OpDataElementType.PRC_TBL.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id)
        {
            var myDealsData = GetPricingTable(id, true).FillInHolesFromAtrbTemplate();
            myDealsData.ApplyRules(MyRulesTrigger.OnValidate);
            myDealsData.ApplyRules(MyRulesTrigger.OnPostValidate);

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType,
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested, true);
            }

            var prntActions = data[OpDataElementType.PRC_ST][0]["_actions"];
            foreach (OpDataCollectorFlattenedItem item in data[OpDataElementType.WIP_DEAL])
            {
                item["_actionsPS"] = prntActions;
            }

            return data;
            //return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList GetWipDealsByPtr(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            MyDealsData myDealsData = OpDataElementType.PRC_TBL_ROW.GetByIDs(new List<int> { id }, opDataElementTypes).FillInHolesFromAtrbTemplate();

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, ObjSetPivotMode.Nested);
            }

            return data;
        }

        public WipDealQuickViewPacket GetWipDeal(int id)
        {
            WipDealQuickViewPacket ret = new WipDealQuickViewPacket();
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(new List<int> { id }, opDataElementTypes).FillInHolesFromAtrbTemplate();

            List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
                .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                List<OpDataElement> des = new List<OpDataElement>();
                foreach (OpDataElement de in dc.DataElements.Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER))
                {
                    if (de.AtrbValue.ToString() == "") continue;
                    int prodId = int.Parse(de.AtrbValue.ToString());
                    ProductEngName prod = prods.FirstOrDefault(p => p.PRD_MBR_SID == prodId);
                    if (prod == null) continue;

                    des.Add(new OpDataElement
                    {
                        DcID = de.DcID,
                        AtrbID = 0,
                        AtrbCd = "PRODUCT_NAME",
                        AtrbValue = prod.PRODUCT_NAME,
                        DimKey = de.DimKey,
                    });
                }
                if (des.Any()) dc.DataElements.AddRange(des);
            }

            ret.Data = myDealsData.ToOpDataCollectorFlattenedDictList(OpDataElementType.WIP_DEAL, ObjSetPivotMode.Nested).FirstOrDefault();
            if (ret.Data == null)
            {
                return ret;
            }

            int custId = int.Parse(ret.Data[AttributeCodes.CUST_MBR_SID].ToString());
            if (DataCollections.GetMyCustomers().CustomerInfo.All(c => c.CUST_SID != custId))
            {
                ret.Data = null;
                return ret;
            }

            List<int> atrbs = new List<int> { Attributes.TITLE.ATRB_SID };
            List<OpDataElementType> opDataElementTypesPath = new List<OpDataElementType>
            {
                OpDataElementType.CNTRCT,
                OpDataElementType.PRC_ST,
                OpDataElementType.PRC_TBL
            };
            MyDealsData myDealsPathData = OpDataElementType.WIP_DEAL.GetByIDs(new List<int> { id }, opDataElementTypesPath, atrbs);

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            foreach (KeyValuePair<string, object> kvp in ret.Data)
            {
                MyDealsAttribute atrb = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == kvp.Key);
                if (atrb != null) ret.AtrbMap[kvp.Key] = atrb.ATRB_LBL;
            }

            OpDataElement deCntrct = myDealsPathData[OpDataElementType.CNTRCT].AllDataElements.FirstOrDefault();
            if (deCntrct != null)
            {
                ret.Path.ContractId = deCntrct.DcID;
                ret.Path.ContractTitle = deCntrct.AtrbValue.ToString();
            }

            OpDataElement dePs = myDealsPathData[OpDataElementType.PRC_ST].AllDataElements.FirstOrDefault();
            if (dePs != null)
            {
                ret.Path.PricingStrategyId = dePs.DcID;
                ret.Path.PricingStrategyTitle = dePs.AtrbValue.ToString();
            }

            OpDataElement dePt = myDealsPathData[OpDataElementType.PRC_TBL].AllDataElements.FirstOrDefault();
            if (dePt != null)
            {
                ret.Path.PricingTableId = dePt.DcID;
                ret.Path.PricingTableTitle = dePt.AtrbValue.ToString();
            }

            ret.Path.WipDealId = id;

            return ret;
        }

        public CostTestDetail GetPctDetails(int id)
        {
            return new CostTestLib().GetCostTestDetails(id);
        }

        public string GetPath(int id, string opType)
        {
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(opType);
            MyDealsData myDealsData = opDataElementType.GetByIDs(
                new List<int> { id },
                new List<OpDataElementType>
                {
                    OpDataElementType.CNTRCT,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL
                }, new List<int>
                {
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID
                });

            string basePath = $"{myDealsData[OpDataElementType.CNTRCT].AllDataElements.First().DcID}/{myDealsData[OpDataElementType.PRC_ST].AllDataElements.First().DcID}";
            return opDataElementType == OpDataElementType.PRC_TBL
                ? basePath :
                $"{basePath}/{myDealsData[OpDataElementType.PRC_TBL].AllDataElements.First().DcID}/wip";
        }

        public PctOverrideReason SetPctOverrideReason(PctOverrideReason data)
        {
            return new CostTestLib().SetPctOverrideReason(data);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public MyDealsData GetPricingTableRow(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_TBL_ROW
            };

            return OpDataElementType.PRC_TBL_ROW.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public MyDealsData GetPricingTableRowAndWip(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_TBL_ROW,
                OpDataElementType.WIP_DEAL
            };

            return OpDataElementType.PRC_TBL_ROW.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            OpDataCollectorFlattenedDictList dataDictList = new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_TBL] = data
            };

            // if a new PT... check is parent is past Submitted
            int id = int.Parse(data[0]["DC_ID"].ToString());
            if (id < 0)
            {
                MyDealsData psDealsData = OpDataElementType.PRC_ST.GetByIDs(
                    new List<int> { int.Parse(data[0]["DC_PARENT_ID"].ToString()) },
                    new List<OpDataElementType> { OpDataElementType.PRC_ST },
                    new List<int> { Attributes.WF_STG_CD.ATRB_SID, Attributes.OBJ_SET_TYPE_CD.ATRB_SID });

                OpDataElement deStage = psDealsData[OpDataElementType.PRC_ST].AllDataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.WF_STG_CD);
                if (deStage != null)
                {
                    OpDataCollector dc = psDealsData[OpDataElementType.PRC_ST].AllDataCollectors.First();
                    string stg = deStage.AtrbValue.ToString();
                    if (stg == WorkFlowStages.Pending || stg == WorkFlowStages.Approved)
                    {
                        deStage.AtrbValue = OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA
                            ? WorkFlowStages.Requested
                            : WorkFlowStages.Draft;

                        OpDataCollectorFlattenedList flatList = new OpDataCollectorFlattenedList
                        {
                            new OpDataCollectorFlattenedItem
                            {
                                [AttributeCodes.WF_STG_CD] = dc.GetAtrbValue(AttributeCodes.WF_STG_CD),
                                [AttributeCodes.OBJ_SET_TYPE_CD] = dc.GetAtrbValue(AttributeCodes.OBJ_SET_TYPE_CD),
                                [AttributeCodes.DC_ID] = dc.DcID,
                                [AttributeCodes.DC_PARENT_ID] = dc.DcParentID,
                                [AttributeCodes.dc_type] = dc.DcType,
                                [AttributeCodes.dc_parent_type] = dc.DcParentType
                            }
                        };

                        dataDictList[OpDataElementType.PRC_ST] = flatList;
                    }
                }
            }
            //if (data["DC_ID"])
            return _dataCollectorLib.SavePackets(dataDictList, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        /// <summary>
        /// Update WIP DEALS, DEAL_GRP_NM and DEAL_GRP_EXCLDS
        /// </summary>
        /// <param name="data"></param>
        /// <param name="savePacket"></param>
        /// <returns></returns>
        public OpDataCollectorFlattenedDictList UpdateWipDeals(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            List<int> dcIds = data.Select(opDataCollectorFlattenedItem => int.Parse(opDataCollectorFlattenedItem[AttributeCodes.DC_ID].ToString())).ToList();
            OpDataCollectorFlattenedDictList dataDictList = new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.WIP_DEAL] = data
            };
            savePacket.ForcePublish = true;
            savePacket.SourceEvent = OpDataElementType.WIP_DEAL.ToString();
            savePacket.ValidateIds = dcIds;
            return _dataCollectorLib.SavePackets(dataDictList, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, new SavePacket(contractToken)).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, ContractToken contractToken)
        {
            return SavePricingTable(
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL) ? fullpricingTables[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullpricingTables[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.WIP_DEAL) ? fullpricingTables[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                contractToken);
        }

        public OpMsg DeletePricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables)
        {
            return pricingTables.DeleteByIds(OpDataElementType.PRC_TBL, contractToken, _dataCollectorLib);
        }

        public OpMsg RollBackObject(OpDataElementType opDataElementType, ContractToken contractToken, int dcId)
        {
            // Issue the needed rollbacks and deletes - this is generalized code that will figure out the level and act as needed.
            return opDataElementType.RollbackOperations(dcId, contractToken, _dataCollectorLib);
        }

        public OpMsgQueue CancelPricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables)
        {
            // Issue stage changes to Canceled stage for PT and all children deals - Note that PT doesn't actually have a stage and PS stays where it is.
            // Get all IDs then make a call.
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>
            {
                [WorkFlowActions.Cancel] = pricingTables.Select(item => new WfActnItem
                {
                    DC_ID = int.Parse(item[AttributeCodes.DC_ID].ToString()),
                    WF_STG_CD = item[AttributeCodes.PS_WF_STG_CD].ToString()
                }).ToList()
            };

            // make a DB call - Get WIP data
            MyDealsData myDealsData = OpDataElementType.PRC_TBL.GetByIDs(actnPs[WorkFlowActions.Cancel].Select(d => d.DC_ID).ToList(),
                new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                },
                new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID
                }
            );

            OpMsgQueue allActnItems = new OpMsgQueue();
            allActnItems.Merge(myDealsData.GatherWipStages(_dataCollectorLib, contractToken, WorkFlowActions.Cancel));

            return allActnItems;
        }

        public OpMsg DeletePricingTableRowById(ContractToken contractToken, int ptrId)
        {
            OpDataCollectorFlattenedDictList opDcDict = GetPricingTableRow(ptrId).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.UniqueKey);
            OpDataCollectorFlattenedList pricingTableRows = opDcDict[OpDataElementType.PRC_TBL_ROW];
            return pricingTableRows.DeleteByIds(OpDataElementType.PRC_TBL_ROW, contractToken, _dataCollectorLib);
        }

        public OpMsg DeletePricingTableRow(ContractToken contractToken, OpDataCollectorFlattenedList pricingTableRows)
        {
            return pricingTableRows.DeleteByIds(OpDataElementType.PRC_TBL_ROW, contractToken, _dataCollectorLib);
        }

        public OpMsgQueue UnGroupPricingTableRowById(ContractToken contractToken, int ptrId)
        {
            MyDealsData myDealsData = GetPricingTableRowAndWip(ptrId);
            return myDealsData.UnGroupPricingTableRow(contractToken, _dataCollectorLib);
        }

        public OpMsgQueue ActionWipDeals(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actns)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();
            List<int> dealsOffHold = new List<int>();

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID
            };

            Dictionary<int, string> id2actnMapping = new Dictionary<int, string>();
            Dictionary<int, string> id2stageMapping = new Dictionary<int, string>();
            List<int> ids = new List<int>();
            foreach (KeyValuePair<string, List<WfActnItem>> kvp in actns)
            {
                List<int> wipIds = kvp.Value.Select(t => t.DC_ID).ToList();
                ids.AddRange(wipIds);
                foreach (int i in wipIds)
                {
                    id2actnMapping[i] = kvp.Key;
                }
                foreach (WfActnItem wfActnItem in kvp.Value)
                {
                    id2stageMapping[wfActnItem.DC_ID] = wfActnItem.WF_STG_CD;
                }
            }

            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(ids, opDataElementTypes, atrbs);
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                string stageInDb = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                string stageIn = id2stageMapping[dc.DcID];
                string actn = id2actnMapping[dc.DcID];

                // concurency check
                if (stageIn != stageInDb)
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = "The stage was changed by another source prior to this action.  Please refresh and try again.",
                        MsgType = OpMsg.MessageType.Warning,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                    continue;
                }

                // get next stage
                string targetStage = dc.GetNextStage(actn);

                if (string.IsNullOrEmpty(targetStage))
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = $"You do not have permission to {actn} the Wip Deal from the {stageIn} stage.",
                        MsgType = OpMsg.MessageType.Warning,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                    continue;
                }

                if (stageIn == WorkFlowStages.Hold && actn == "Approve")
                {
                    dealsOffHold.Add(dc.DcID);
                }

                dc.SetAtrb(AttributeCodes.WF_STG_CD, targetStage);
                opMsgQueue.Messages.Add(new OpMsg
                {
                    Message = $"Wip Deal moved from {stageIn} to {targetStage}.",
                    ShortMessage = targetStage,
                    MsgType = OpMsg.MessageType.Info,
                    ExtraDetails = dc.DcType,
                    KeyIdentifiers = new[] { dc.DcID }
                });

                dc.AddTimelineComment($"Wip Deal moved from {stageIn} to {targetStage}.");

                // TODO add actions to stack like TRACKER NUMBER or WIP-TO_REAL or COST TEST, etc...
                // This should probably be a rule item
            }

            myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.WIP_DEAL].GroupID = -101; // Whatever the real ID of this object is

            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.WIP_DEAL].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.WIP_DEAL].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions();

            if (dealsOffHold.Any())
            {
                bool needRedeal = false;
                MyDealsData myDealsPsData = OpDataElementType.WIP_DEAL.GetByIDs(dealsOffHold
                    , new List<OpDataElementType> { OpDataElementType.PRC_ST }
                    , new List<int> { Attributes.WF_STG_CD.ATRB_SID });
                myDealsData[OpDataElementType.PRC_ST] = myDealsPsData[OpDataElementType.PRC_ST];

                foreach (OpDataCollector dc in myDealsPsData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    var psStage = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                    var futureStage = dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), psStage, OpDataElementType.PRC_ST);
                    if (futureStage != null)
                    {
                        needRedeal = true;
                        dc.SetAtrb(AttributeCodes.WF_STG_CD, futureStage);
                    }
                }

                if (needRedeal)
                {
                    myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
                    myDealsData[OpDataElementType.PRC_ST].GroupID = -102; // Whatever the real ID of this object is

                    // Back to normal operations, clear out the messages and all.
                    myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
                    myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

                    // Tack on the save action call now
                    myDealsData[OpDataElementType.PRC_ST].AddSaveActions();
                }
            }

            myDealsData.EnsureBatchIDs();
            MyDealsData retData = myDealsData.Save(contractToken);

            if (retData.ContainsKey(OpDataElementType.PRC_ST))
            {
                foreach (OpDataCollector dc in retData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    var targetStage = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = $"PS moved to {targetStage}.",
                        ShortMessage = targetStage,
                        MsgType = OpMsg.MessageType.Info,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                }
            }

            return opMsgQueue;
        }

        public List<Overlapping> GetOverlappingDeals(OpDataElementType opDataElementType, List<int> ids, List<TimeFlowItem> timeFlows)
        {
            OpDataCollectorDataLib OD = new OpDataCollectorDataLib();

            DateTime start = DateTime.Now;
            List<Overlapping> overlapps = OD.GetOverlappingDeals(opDataElementType, ids);
            timeFlows.Add(new TimeFlowItem
            {
                StepTitle = "Get Overlapping Deals",
                Media = TimeFlowMedia.DB,
                MsLapseTiming = 0,
                MsExecutionTiming = (DateTime.Now - start).TotalMilliseconds
            });

            return overlapps;

            // With new approach, we don't need to update the deal to set opverlap status or passed validation... time saving here!!!

            // Need to update
            List<int> wipIds = overlapps.Select(o => o.WIP_DEAL_OBJ_SID).Distinct().ToList();

            MyDealsData myDealsData = opDataElementType.GetByIDs(
                ids,
                new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                new List<int>
                {
                    Attributes.PASSED_VALIDATION.ATRB_SID,
                    Attributes.OVERLAP_RESULT.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                    Attributes.CUST_MBR_SID.ATRB_SID
                });

            ContractToken contractToken = new ContractToken("ContractToken Created - GetOverlappingDeals")
            {
                ContractId = 1,
                NeedToCheckForDelete = false
            };

            List<OpDataCollector> allDcs = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.ToList();

            foreach (OpDataCollector dc in allDcs)
            {
                IOpDataElement de = dc.GetDataElement(AttributeCodes.OVERLAP_RESULT);
                IOpDataElement deValid = dc.GetDataElement(AttributeCodes.PASSED_VALIDATION);
                IOpDataElement deCust = dc.GetDataElement(AttributeCodes.CUST_MBR_SID);
                IOpDataElement deDefault = deCust ?? dc.GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD);

                contractToken.CustId = deCust == null ? 0 : int.Parse(deCust.AtrbValue.ToString());

                string value = wipIds.Contains(deDefault.DcID) ? "Fail" : "Pass";

                if (de == null)
                {
                    dc.DataElements.Add(new OpDataElement
                    {
                        DcID = deDefault.DcID,
                        DcType = deDefault.DcType,
                        DcParentType = deDefault.DcParentType,
                        DcParentID = deDefault.DcParentID,
                        AtrbID = Attributes.OVERLAP_RESULT.ATRB_SID,
                        AtrbCd = Attributes.OVERLAP_RESULT.ATRB_COL_NM,
                        AtrbValue = value,
                        State = OpDataElementState.Modified
                    });
                }
                else
                {
                    de.SetAtrbValue(value);
                    if (de.AtrbValue.ToString() != de.OrigAtrbValue.ToString()) de.State = OpDataElementState.Modified;
                }

                // Only update passed validation to FALSE... if value failed.  NEVER just blindly set it to PASS
                if (value != "Fail") continue;

                if (deValid == null)
                {
                    dc.DataElements.Add(new OpDataElement
                    {
                        DcID = deDefault.DcID,
                        DcType = deDefault.DcType,
                        DcParentType = deDefault.DcParentType,
                        DcParentID = deDefault.DcParentID,
                        AtrbID = Attributes.PASSED_VALIDATION.ATRB_SID,
                        AtrbCd = Attributes.PASSED_VALIDATION.ATRB_COL_NM,
                        AtrbValue = PassedValidation.Dirty,
                        State = OpDataElementState.Modified
                    });
                }
                else
                {
                    deValid.SetAtrbValue(PassedValidation.Dirty);
                    deValid.State = OpDataElementState.Modified;
                }
            }

            if (myDealsData[OpDataElementType.WIP_DEAL].AllDataElements.Any(d => d.State != OpDataElementState.Unchanged))
            {
                myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
                myDealsData[OpDataElementType.WIP_DEAL].GroupID = -101; // Whatever the real ID of this object is
                myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions();
                myDealsData.EnsureBatchIDs();

                start = DateTime.Now;
                MyDealsData retData = myDealsData.Save(contractToken);
                timeFlows.Add(new TimeFlowItem
                {
                    StepTitle = "Save Overlapping Results",
                    Media = TimeFlowMedia.DB,
                    MsLapseTiming = 0,
                    MsExecutionTiming = (DateTime.Now - start).TotalMilliseconds
                });
            }
            return overlapps;
        }

        public List<Overlapping> UpdateOverlappingDeals(int PRICING_TABLES_ID, string YCS2_OVERLAP_OVERRIDE)
        {
            OpDataCollectorDataLib OD = new OpDataCollectorDataLib();
            return OD.UpdateOverlappingDeals(PRICING_TABLES_ID, YCS2_OVERLAP_OVERRIDE);
        }
    }
}