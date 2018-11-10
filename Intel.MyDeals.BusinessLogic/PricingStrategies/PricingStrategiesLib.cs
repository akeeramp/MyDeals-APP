using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.MyDeals.DataLibrary;
using System.Threading;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.BusinessLogic.DataCollectors;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingStrategiesLib : IPricingStrategiesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly INotificationsLib _notificationsLib;

        public PricingStrategiesLib(IOpDataCollectorLib dataCollectorLib, INotificationsLib notificationsLib)
        {
            _dataCollectorLib = dataCollectorLib;
            _notificationsLib = notificationsLib;
        }

        public MyDealsData GetPricingStrategy(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW,
                    OpDataElementType.WIP_DEAL
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PRC_ST
                };

            return OpDataElementType.PRC_ST.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id)
        {
            return GetPricingStrategy(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_ST] = data
            }, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PRC_ST] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, new SavePacket(contractToken)).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveFullPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            return SavePricingStrategy(
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_ST) ? fullpricingStrategies[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_TBL) ? fullpricingStrategies[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullpricingStrategies[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.WIP_DEAL) ? fullpricingStrategies[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                contractToken);
        }

        public OpMsg DeletePricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies)
        {
            // Remove this pricing strategy with a hard delete
            return pricingStrategies.DeleteByIds(OpDataElementType.PRC_ST, contractToken, _dataCollectorLib);
        }

        public OpMsg RollBackObject(OpDataElementType opDataElementType, ContractToken contractToken, int dcId)
        {
            // Issue the needed rollbacks and deletes - this is generalized code that will figure out the level and act as needed.
            return opDataElementType.RollbackOperations(dcId, contractToken, _dataCollectorLib);
        }

        public OpMsgQueue CancelPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies)
        {
            // Issue stage changes to Canceled stage for PS and all children deals
            // Get all IDs then make a call.
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>
            {
                [WorkFlowActions.Cancel] = pricingStrategies.Select(item => new WfActnItem
                {
                    DC_ID = int.Parse(item[AttributeCodes.DC_ID].ToString()),
                    WF_STG_CD = item[AttributeCodes.WF_STG_CD].ToString()
                }).ToList()
            };

            var allActnItems = ActionPricingStrategies(contractToken, actnPs); // PS and all WIP items that get stage change

            // make a DB call - Get WIP data
            MyDealsData myDealsData = OpDataElementType.PRC_ST.GetByIDs(actnPs[WorkFlowActions.Cancel].Select(d => d.DC_ID).ToList(),
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

            allActnItems.Merge(myDealsData.GatherWipStages(_dataCollectorLib, contractToken, WorkFlowActions.Cancel));

            return allActnItems;
        }

        public OpMsgQueue ActionPricingStrategies(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actnPs)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();
            List<int> psGoingActive = new List<int>();
            List<int> psGoingPending = new List<int>();
            string role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;
            List<int> auditableDealIds = new List<int>();
            List<NotificationLog> notifications = new List<NotificationLog>();
            var wwid = OpUserStack.MyOpUserToken.Usr.WWID;

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_ST
            };

            List<int> atrbs = new List<int>
            {
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.IN_REDEAL.ATRB_SID,
                Attributes.HAS_L1.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID, // added for approval blocking at submitted for fails or incompletes
                Attributes.COST_TEST_RESULT.ATRB_SID, // added for approval blocking at submitted for fails or incompletes
                Attributes.SYS_COMMENTS.ATRB_SID
            };

            List<string> submittedFailTests = new List<string>
            {
                "Not Run Yet",
                "InComplete",
                "Fail"
            };

            Dictionary<int, string> id2actnMapping = new Dictionary<int, string>();
            Dictionary<int, string> id2stageMapping = new Dictionary<int, string>();
            List<int> ids = new List<int>();
            foreach (KeyValuePair<string, List<WfActnItem>> kvp in actnPs)
            {
                List<int> psIds = kvp.Value.Select(t => t.DC_ID).ToList();
                ids.AddRange(psIds);
                foreach (int i in psIds)
                {
                    id2actnMapping[i] = kvp.Key;
                }
                foreach (WfActnItem wfActnItem in kvp.Value)
                {
                    id2stageMapping[wfActnItem.DC_ID] = wfActnItem.WF_STG_CD;
                }
            }

            DateTime start = DateTime.Now;
            MyDealsData myDealsData = OpDataElementType.PRC_ST.GetByIDs(ids, opDataElementTypes, atrbs);
            contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

            List<int> needsPctMctDealIds = new List<int>();

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
            {
                string stageInDb = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                string stageIn = id2stageMapping[dc.DcID];
                string actn = id2actnMapping[dc.DcID];
                string costTestInDB = dc.GetDataElementValue(AttributeCodes.COST_TEST_RESULT);
                string meetCompInDB = dc.GetDataElementValue(AttributeCodes.MEETCOMP_TEST_RESULT);

                bool hasL1 = dc.GetDataElementValue(AttributeCodes.HAS_L1) != "0";

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

                // concurency check for meet comp and cost test values..
                if (stageIn == WorkFlowStages.Submitted && (submittedFailTests.Contains(meetCompInDB) || submittedFailTests.Contains(costTestInDB)) && actnPs.ContainsKey("Approve") && actnPs["Approve"].Any(i => i.DC_ID == dc.DcID))
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = "Meet Comp and/or Cost Test failed or have been changed by another source prior to this action.  Please refresh and try again.",
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
                        Message = $"You do not have permission to {actn} the Pricing Strategy from the {stageIn} stage.",
                        MsgType = OpMsg.MessageType.Warning,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                    continue;
                }

                // Brought this block back in to force DA into having to re-run PCT/MCT on approval for Jyoti's "Change Cost in DB after user does PCT" defect (DE19996)
                // Meet Comp Test / Price Cost Test Check
                bool needToRunMct = actn == "Approve" && hasL1 && role == RoleTypes.GA && targetStage == WorkFlowStages.Submitted;
                bool needToRunPct = actn == "Approve" && hasL1 && stageIn == WorkFlowStages.Submitted;
                if (needToRunMct || needToRunPct)
                {
                    needsPctMctDealIds.Add(dc.DcID);
                }

                // Now let us test for PCT or MCT if needed
                if (needsPctMctDealIds.Any())
                {
                    bool passMct, passPct;

                    start = DateTime.Now;
                    bool passed = new CostTestLib().ExecutePctMct(OpDataElementType.PRC_ST.ToId(), needsPctMctDealIds, out passMct, out passPct);
                    contractToken.AddMark("ExecutePctMct - PR_MYDL_GET_MEET_COMP", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                    if (!passed && role == RoleTypes.DA) // Don't throw a warning for FSE/GA to run Meet Comp/Cost Test
                    {
                        string passMsg = !passMct && !passPct
                            ? "Meet Comp and Cost Test"
                            : !passMct ? "Meet Comp" : "Cost Test";

                        foreach (int dcId in needsPctMctDealIds)
                        {
                            opMsgQueue.Messages.Add(new OpMsg
                            {
                                Message = $"Pricing Strategy did not pass {passMsg}.",
                                MsgType = OpMsg.MessageType.Warning,
                                ExtraDetails = dcId,
                                KeyIdentifiers = new[] { dcId }
                            });
                        }

                        return opMsgQueue;
                    }
                }
                // END DE19996 block...

                // Check for pending stage... might need to bypass it
                if (targetStage == WorkFlowStages.Pending && contractToken.CustAccpt != "Pending")
                {
                    targetStage = WorkFlowStages.Approved;
                }

                // Check to see if we are passing the Pending threshold
                if (targetStage == WorkFlowStages.Pending)
                {
                    psGoingPending.Add(dc.DcID);
                }

                // Check to see if we are passing the Approved threshold and need to pass actions
                if (targetStage == WorkFlowStages.Approved)
                {
                    psGoingActive.Add(dc.DcID);
                }

                if (targetStage != stageIn && actnPs.ContainsKey("Approve") && actnPs["Approve"].Any(i => i.DC_ID == dc.DcID))
                {
                    if ((role == RoleTypes.FSE && stageIn == WorkFlowStages.Draft) ||
                        (role == RoleTypes.GA && stageIn == WorkFlowStages.Requested) ||
                        (role == RoleTypes.DA && stageIn == WorkFlowStages.Submitted))
                    {
                        auditableDealIds.Add(dc.DcID);
                    }
                }

                dc.SetAtrb(AttributeCodes.WF_STG_CD, targetStage);

                //standard manage screen approval
                opMsgQueue.Messages.Add(new OpMsg
                {
                    Message = $"Pricing Strategy moved from {stageIn} to {targetStage}.",
                    MsgType = OpMsg.MessageType.Info,
                    ExtraDetails = dc.DcType,
                    KeyIdentifiers = new[] { dc.DcID }
                });
                
                dc.AddTimelineComment($"Pricing Strategy moved from {stageIn} to {targetStage}.");
                // TODO add actions to stack like TRACKER NUMBER or WIP-TO_REAL or COST TEST, etc...
                // This should probably be a rule item
            }

            List<int> dealIds = new List<int>();
            List<int> pendingDealIds = new List<int>();
            List<int> tenderDealIds = new List<int>();
            List<int> tenderWonDealsIds = new List<int>();
            List<int> quotableDealIds = new List<int>();

            if (psGoingPending.Any() || psGoingActive.Any())
            {
                List<OpDataElementType> opDataElementTypesActive = new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                };

                List<OpDataElement> deals = new List<OpDataElement>();
                List<int> tenderPotentialIds = new List<int>();
                List<OpDataElement> tenderDeals = new List<OpDataElement>();
                List<OpDataElement> tenderWonDeals = new List<OpDataElement>();
                myDealsData[OpDataElementType.WIP_DEAL] = new OpDataPacket<OpDataElementType>();

                List<int> atrbsActive = new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.REBATE_TYPE.ATRB_SID,
                    Attributes.IN_REDEAL.ATRB_SID,
                    Attributes.HAS_TRACKER.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID
                };

                if (psGoingPending.Any())
                {
                    start = DateTime.Now;
                    var myDealsPendingDataPs = OpDataElementType.PRC_ST.GetByIDs(psGoingActive.Union(psGoingPending), opDataElementTypesActive, atrbsActive);
                    contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                    myDealsData[OpDataElementType.WIP_DEAL].PacketType = OpDataElementType.WIP_DEAL;

                    foreach (OpDataCollector t in myDealsPendingDataPs[OpDataElementType.WIP_DEAL].Data.Values)
                    {
                        myDealsData[OpDataElementType.WIP_DEAL].Data.Add(t);
                    }
                    deals = myDealsPendingDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft)).ToList();
                    pendingDealIds = deals.Select(d => d.DcID).ToList();

                    foreach (OpDataElement de in deals)
                    {
                        de.SetAtrbValue(WorkFlowStages.Pending);
                    }
                }

                if (psGoingActive.Any())
                {
                    start = DateTime.Now;
                    var myDealsDataPs = OpDataElementType.PRC_ST.GetByIDs(psGoingActive.Union(psGoingPending), opDataElementTypesActive, atrbsActive);
                    contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                    foreach (OpDataCollector t in myDealsDataPs[OpDataElementType.WIP_DEAL].Data.Values)
                    {
                        myDealsData[OpDataElementType.WIP_DEAL].Data.Add(t);
                    }

                    myDealsData[OpDataElementType.WIP_DEAL] = myDealsDataPs[OpDataElementType.WIP_DEAL];
                    deals = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft)
                        || d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Pending)).ToList();
                    dealIds = deals.Select(d => d.DcID).ToList();

                    tenderPotentialIds = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => d.AtrbHasValue(AttributeCodes.OBJ_SET_TYPE_CD, "ECAP") || d.AtrbHasValue(AttributeCodes.OBJ_SET_TYPE_CD, "KIT"))
                        .Select(d => d.DcID).ToList();

                    tenderDeals = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => dealIds.Contains(d.DcID) && tenderPotentialIds.Contains(d.DcID) && d.AtrbHasValue(AttributeCodes.REBATE_TYPE, "TENDER")).ToList();
                    tenderDealIds = tenderDeals.Select(d => d.DcID).ToList();

                    List<string> quotableTypes = new List<string> { "ECAP", "KIT" };
                    quotableDealIds = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => dealIds.Contains(d.DcID) && d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && quotableTypes.Contains(d.AtrbValue.ToString()))
                        .Select(d => d.DcID).ToList();

                    if (psGoingActive.Any())
                    {
                        foreach (OpDataElement de in deals)
                        {
                            if (tenderDealIds.Contains(de.DcID))
                            {
                                OpDataElement deTracker = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements.FirstOrDefault(d => d.DcID == de.DcID && d.AtrbCd == AttributeCodes.HAS_TRACKER);
                                if (deTracker != null && deTracker.AtrbValue.ToString() == "1")
                                {
                                    de.SetAtrbValue(WorkFlowStages.Won);
                                    tenderWonDealsIds.Add(de.DcID);
                                    dealIds.Add(de.DcID);
                                }
                                else
                                {
                                    de.SetAtrbValue(WorkFlowStages.Offer);

                                    // For tneder deals Sumbitted to offer notification logged at deal level
                                    AddNotificationLog(notifications, contractToken.ContractId, de.DcID, OpDataElementType.WIP_DEAL, NotificationEvents.TenderSubmittedToOffer);
                                }
                            }
                            else
                            {
                                de.SetAtrbValue(WorkFlowStages.Active);
                            }
                        }
                    }

                    // For non tender deals notification is logged at PS level, (Assumption if there are no Tneder deal noifications then all of them are non tender PS)
                    if (!notifications.Any())
                    {
                        psGoingActive.ForEach(psId => AddNotificationLog(notifications, contractToken.ContractId, psId, OpDataElementType.PRC_ST, NotificationEvents.SubmittedToApproved));
                    }
                }
            }

            myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.PRC_ST].GroupID = -101; // Whatever the real ID of this object is

            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.PRC_ST].AddSaveActions();
            //myDealsData[OpDataElementType.PRC_ST].AddGoingActiveActions(dealIds); // Don't know if this is a messup or not.  Sync actions should be WIP level.
            myDealsData[OpDataElementType.PRC_ST].AddAuditActions(auditableDealIds);

            if (dealIds.Any() || pendingDealIds.Any() || tenderWonDealsIds.Any())
            {
                myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
                myDealsData[OpDataElementType.WIP_DEAL].GroupID = -102; // Whatever the real ID of this object is

                // Back to normal operations, clear out the messages and all.
                myDealsData[OpDataElementType.WIP_DEAL].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
                myDealsData[OpDataElementType.WIP_DEAL].Messages.Messages.RemoveAll(r => true);

                // Tack on the save action call now
                List<int> nonTenderIds = dealIds.Where(d => !tenderDealIds.Contains(d)).ToList();
                List<int> possibleMajorIds = dealIds.Where(d => !tenderDealIds.Contains(d) || tenderWonDealsIds.Contains(d)).ToList();
                AttributeCollection atrbMstr = DataCollections.GetAttributeData();
                myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions(null, possibleMajorIds, atrbMstr);
                if (dealIds.Any())
                {
                    myDealsData[OpDataElementType.WIP_DEAL].AddGoingActiveActions(nonTenderIds.Union(tenderWonDealsIds).ToList()); // not sure if we need it in both places or just the PS
                    myDealsData[OpDataElementType.WIP_DEAL].AddQuoteLetterActions(quotableDealIds); // not sure if we need it in both places or just the PS
                }
            }

            myDealsData.EnsureBatchIDs();
            myDealsData.Save(contractToken);

            if (contractToken.BulkTenderUpdate)
            {
                //if this is from the tender dashboard, we need to further customize the return message with the newly updated stage and new permissable _actions 

                List<int> ps_ids = new List<int>();
                MyDealsData myDealsTenderData;

                //we need to gather the pricing strategy ids here so that we can also retrieve the corresponding tender wip deals
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    ps_ids.Add(dc.DcID);
                }

                //get updated wip deals now that we have changed ps stage
                myDealsTenderData = OpDataElementType.PRC_ST.GetByIDs(ps_ids,
                    new List<OpDataElementType>
                    {
                        OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL
                    },
                    new List<int>());

                //apply rules on the PRC_ST and WIP_DEAL data collectors
                foreach (OpDataCollector dc in myDealsTenderData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, null);
                }
                foreach (OpDataCollector dc in myDealsTenderData[OpDataElementType.WIP_DEAL].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, null);
                }

                //fill in holes for any missing attributes that we use in the grid that isn't saved
                myDealsTenderData.FillInHolesFromAtrbTemplate();

                OpDataCollectorFlattenedDictList flatDictList = myDealsTenderData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);
                //convert to UI friendly data types
                OpDataCollectorFlattenedList prc_st_data = flatDictList.ToHierarchialList(OpDataElementType.PRC_ST);
                OpDataCollectorFlattenedList wip_data = flatDictList.ToHierarchialList(OpDataElementType.WIP_DEAL);

                foreach (OpMsg om in opMsgQueue.Messages)
                {
                    for (var i = 0; i < prc_st_data.Count(); i++)
                    {
                        if (!(prc_st_data[i]).ContainsKey("DC_ID"))
                        {
                            continue;   //if the data collector doesn't have an ID, skip it.  This seems to happen sometimes when we have a SAVE action appended on as well.
                        }
                        if (om.KeyIdentifier.ToString() == prc_st_data[i][AttributeCodes.DC_ID].ToString())
                        {
                            //IDs of datacollector and opMsg align, so we want to add the item's _actions which will be used by the UI to set the updated dropdown options
                            //ASSUMPTION: Here we assume that as per design we will only ever have one WIP deal for each PS - and that we retrieve them all in the correct order
                            //IMPORTANT: the tender dashboard is very reliant on the wipData having these extra attributes added onto the wip data.  anywhere we send back wip data to the tender dashboard we need to make sure to append these as well!
                            wip_data[i]["_actionsPS"] = prc_st_data[i]["_actions"];
                            wip_data[i]["_actionReasonsPS"] = prc_st_data[i]["_actionReasons"];
                            wip_data[i]["PS_ID"] = prc_st_data[i]["DC_ID"];

                            //add wipData into the return msgQueue's extraDetails attribute
                            //om.ExtraDetails = new object[] { wip_data[i] };
                            om.ExtraDetails = wip_data[i];
                        } else
                        {
                            //returned ps data does not match id in this OpMsg so we continue
                            continue;
                        }
                    }
                }
            }

            // After save insert into notification log
            if (notifications.Any())
            {
                Thread notificationThread = new Thread(() => _notificationsLib.CreateNotificationLog(notifications, wwid));
                notificationThread.Start();
            }

            return opMsgQueue;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="contractId"></param>
        /// <param name="obj_sid"></param>
        /// <param name="opdataElementType"></param>
        /// <param name="notfEvent"></param>
        private void AddNotificationLog(IList<NotificationLog> notification, int contractId, int obj_sid, OpDataElementType opdataElementType, NotificationEvents notfEvent)
        {
            notification.Add(new NotificationLog
            {
                CONTRACT_SID = contractId,
                OBJ_SID = obj_sid,
                OBJ_TYPE_SID = (int)opdataElementType,
                NOTIF_ID = (int)notfEvent
            });
        }
    }
}