using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingStrategiesLib : IPricingStrategiesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public PricingStrategiesLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
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

            return OpDataElementType.PRC_ST.GetByIDs(new List<int> {id}, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id)
        {
            return GetPricingStrategy(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, ContractToken contractToken)
        {
            SavePacket savePacket = new SavePacket(contractToken);
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

            var allActnItems =  ActionPricingStrategies(contractToken, actnPs); // PS and all WIP items that get stage change

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
            string role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_ST
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


            MyDealsData myDealsData = OpDataElementType.PRC_ST.GetByIDs(ids, opDataElementTypes, atrbs);
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
            {
                string stageInDb = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                string stageIn = id2stageMapping[dc.DcID];
                string actn = id2actnMapping[dc.DcID];

                // concurency check
                if (stageIn != stageInDb)
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = "The stage was change by another source prior to this action.  Please refresh and try again.",
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

                // Meet Comp Test / Price Cost Test Check
                bool needToRunMct = actn == "Approve" && role == RoleTypes.GA && targetStage == WorkFlowStages.Submitted;
                bool needToRunPct = actn == "Approve" && stageIn == WorkFlowStages.Submitted;
                if (needToRunMct || needToRunPct)
                {
                    bool passMct, passPct;
                    bool passed = new CostTestLib().ExecutePctMct(OpDataElementType.PRC_ST.ToId(), new List<int> { dc.DcID }, out passMct, out passPct);
                    if (!passed && (role == RoleTypes.DA)) // Don't throw a warning for FSE/GA to run Meet Comp/Cost Test
                    {
                        string passMsg = !passMct && !passPct
                            ? "Meet Comp and Cost Test"
                            : !passMct ? "Meet Comp" : "Cost Test";

                        opMsgQueue.Messages.Add(new OpMsg
                        {
                            Message = $"Pricing Strategy did not pass {passMsg}.",
                            MsgType = OpMsg.MessageType.Warning,
                            ExtraDetails = dc.DcType,
                            KeyIdentifiers = new[] { dc.DcID }
                        });
                        continue;

                    }
                }


                // Check for pending stage... might need to bypass it
                if (targetStage == WorkFlowStages.Pending && contractToken.CustAccpt != "Pending")
                {
                    targetStage = WorkFlowStages.Approved;
                }

                // Check to see if we are passing the Approved threshold and need to pass actions
                if (targetStage == WorkFlowStages.Approved)
                {
                    psGoingActive.Add(dc.DcID);
                }


                dc.SetAtrb(AttributeCodes.WF_STG_CD, targetStage);
                opMsgQueue.Messages.Add(new OpMsg
                {
                    Message = $"Pricing Strategy moved from {stageIn} to {targetStage}.",
                    MsgType = OpMsg.MessageType.Info,
                    ExtraDetails = dc.DcType,
                    KeyIdentifiers = new[] { dc.DcID }
                });

                // TODO add actions to stack like TRACKER NUMBER or WIP-TO_REAL or COST TEST, etc...
                // This should probably be a rule item
            }

            List<int> dealIds = new List<int>();
            if (psGoingActive.Any())
            {
                List<OpDataElementType> opDataElementTypesActive = new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                };

                List<int> atrbsActive = new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID
                };

                var myDealsDataPs = OpDataElementType.PRC_ST.GetByIDs(psGoingActive, opDataElementTypesActive, atrbsActive);

                myDealsData[OpDataElementType.WIP_DEAL] = myDealsDataPs[OpDataElementType.WIP_DEAL];
                List<OpDataElement> deals = myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataElements.Where(d => d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft)).ToList();

                foreach (OpDataElement de in deals)
                {
                    de.SetAtrbValue(WorkFlowStages.Active);
                }

                dealIds = deals.Select(d => d.DcID).ToList();
            }


            myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.PRC_ST].GroupID = -101; // Whatever the real ID of this object is
            
            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.PRC_ST].AddSaveActions();
            //myDealsData[OpDataElementType.PRC_ST].AddGoingActiveActions(dealIds); // Don't know if this is a messup or not.  Sync actions should be WIP level.

            if (dealIds.Any())
            {
                myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
                myDealsData[OpDataElementType.WIP_DEAL].GroupID = -102; // Whatever the real ID of this object is

                // Back to normal operations, clear out the messages and all.
                myDealsData[OpDataElementType.WIP_DEAL].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
                myDealsData[OpDataElementType.WIP_DEAL].Messages.Messages.RemoveAll(r => true);

                // Tack on the save action call now
                myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions();
                myDealsData[OpDataElementType.WIP_DEAL].AddGoingActiveActions(dealIds); // not sure if we need it in both places or just the PS
            }

            myDealsData.EnsureBatchIDs();
            myDealsData.Save(contractToken);

            return opMsgQueue;
        }

    }
}