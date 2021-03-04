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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingStrategiesLib : IPricingStrategiesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly INotificationsLib _notificationsLib;
        //private readonly ITendersLib _tendersLib;

        public PricingStrategiesLib(IOpDataCollectorLib dataCollectorLib, INotificationsLib notificationsLib)
        {
            _dataCollectorLib = dataCollectorLib;
            _notificationsLib = notificationsLib;
            //_tendersLib = tendersLib;
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

        public OpMsg DeletePricingStrategyById(ContractToken contractToken, int dcId)
        {
            OpDataCollectorFlattenedDictList blah = OpDataElementType.PRC_ST.GetByIDs(new List<int> { dcId }).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, false);
            OpDataCollectorFlattenedList pricingStrategies = blah[OpDataElementType.PRC_ST];
            // Remove this pricing strategy with a hard delete
            return DeletePricingStrategy(contractToken, pricingStrategies);
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
            List<int> psStageChanges = new List<int>();
            List<int> salesForceTenderReturns = new List<int>();
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
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID, // added for approval blocking at submitted for fails or incomplete PCT/MCTs
                Attributes.COST_TEST_RESULT.ATRB_SID, // added for approval blocking at submitted for fails or incomplete PCT/MCTs
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

            //List<int> needsPctMctDealIds = new List<int>();

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
            {
                string stageInDb = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                string stageIn = id2stageMapping[dc.DcID];
                string actn = id2actnMapping[dc.DcID];
                string costTestInDB = dc.GetDataElementValue(AttributeCodes.COST_TEST_RESULT);
                string meetCompInDB = dc.GetDataElementValue(AttributeCodes.MEETCOMP_TEST_RESULT);

                bool hasL1 = dc.GetDataElementValue(AttributeCodes.HAS_L1) != "0";

                // concurrency check
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

                // concurrency check for meet comp and cost test values..
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
                //bool needToRunMct = actn == "Approve" && hasL1 && role == RoleTypes.GA && targetStage == WorkFlowStages.Submitted;
                //bool needToRunPct = actn == "Approve" && hasL1 && stageIn == WorkFlowStages.Submitted;
                //if (needToRunMct || needToRunPct)
                //{
                //    needsPctMctDealIds.Add(dc.DcID);
                //}

                // Check for pending stage... contract setting might bypass it
                if (targetStage == WorkFlowStages.Pending && contractToken.CustAccpt != "Pending") 
                {
                    targetStage = WorkFlowStages.Approved; // Was pending, but contract was set to force it approved, so move it
                }

                // Check to see if we are passing the Pending threshold for pending actions to be applied
                if (targetStage == WorkFlowStages.Pending) 
                {
                    psGoingPending.Add(dc.DcID);
                }

                // Check to see if we are passing the Approved threshold and need to pass actions
                if (targetStage == WorkFlowStages.Approved) 
                {
                    psGoingActive.Add(dc.DcID);
                }

                // Simple PS stage change to reflect down to deals history
                if (targetStage != WorkFlowStages.Pending && targetStage != WorkFlowStages.Approved) 
                {
                    psStageChanges.Add(dc.DcID);
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

                dc.SetAtrb(AttributeCodes.WF_STG_CD, targetStage); // Passed all checks, set the PS_WF_STG

                //// Put this in to test if we can remove the strategy stage change message for tender deals.  Creates an update error post save because UI
                //// relies upon the stage changed messages to capture the fact that is also needs to force UI update.  This is a non-starter for removing that message.
                ////var cntrctIsTender = OpDataElementType.CNTRCT.GetByIDs(new List<int> { dc.DcParentID }, new List<OpDataElementType> { OpDataElementType.CNTRCT }, new List<int> { Attributes.IS_TENDER.ATRB_SID });
                ////int stratIsTender = cntrctIsTender[OpDataElementType.CNTRCT].AllDataElements.FirstOrDefault().AtrbValue.ToString() == "1" ? 1 : 0;

                ////if (stratIsTender == 0) // This is not a tender strategy, tag the message
                ////{
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
                ////}
            }

            // Now let us test for PCT or MCT if needed
            //if (needsPctMctDealIds.Any())
            //{
            //    bool passMct, passPct;

            //    start = DateTime.Now;
            //    bool passed = new CostTestLib().ExecutePctMct(OpDataElementType.PRC_ST.ToId(), needsPctMctDealIds, out passMct, out passPct);
            //    contractToken.AddMark("ExecutePctMct - PR_MYDL_GET_MEET_COMP", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

            //    if (!passed && role == RoleTypes.DA) // Don't throw a warning for FSE/GA to run Meet Comp/Cost Test
            //    {
            //        string passMsg = !passMct && !passPct
            //            ? "Meet Comp and Cost Test"
            //            : !passMct ? "Meet Comp" : "Cost Test";

            //        foreach (int dcId in needsPctMctDealIds)
            //        {
            //            opMsgQueue.Messages.Add(new OpMsg
            //            {
            //                Message = $"Pricing Strategy did not pass {passMsg}.",
            //                MsgType = OpMsg.MessageType.Warning,
            //                ExtraDetails = dcId,
            //                KeyIdentifiers = new[] { dcId }
            //            });
            //        }

            //        return opMsgQueue;
            //    }
            //}


            // Stage changes are involved, go and grab the WIP deals for extra operations
            List<int> dealIds = new List<int>();
            List<int> pendingDealIds = new List<int>();
            List<int> tenderDealIds = new List<int>();
            List<int> stageChangesDealIds = new List<int>();
            List<int> tenderWonDealsIds = new List<int>();
            List<int> quotableDealIds = new List<int>();

            if (psGoingPending.Any() || psGoingActive.Any() || psStageChanges.Any())
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
                myDealsData[OpDataElementType.WIP_DEAL].PacketType = OpDataElementType.WIP_DEAL; // Ensure that this new packet has the correct type for all cases

                List<int> atrbsActive = new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.REBATE_TYPE.ATRB_SID,
                    Attributes.IN_REDEAL.ATRB_SID,
                    Attributes.HAS_TRACKER.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                    Attributes.START_DT.ATRB_SID,
                    Attributes.LAST_REDEAL_DT.ATRB_SID,
                    Attributes.LAST_TRKR_START_DT_CHK.ATRB_SID,
                    Attributes.SALESFORCE_ID.ATRB_SID,
                    Attributes.AUTO_APPROVE_RULE_INFO.ATRB_SID,
                    Attributes.OBJ_PATH_HASH.ATRB_SID
                };

                if (psStageChanges.Any())
                {
                    start = DateTime.Now;
                    // Pull all WIP DEAL children from altered PS elements, stuff them into a new WIP_DEAL packet
                    var myDealsStageChangesDataPs = OpDataElementType.PRC_ST.GetByIDs(psStageChanges, opDataElementTypesActive, atrbsActive);
                    contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                    foreach (OpDataCollector t in myDealsStageChangesDataPs[OpDataElementType.WIP_DEAL].Data.Values)
                    {
                        myDealsData[OpDataElementType.WIP_DEAL].Data.Add(t);
                    }

                    // Now get a list or deals that are "in play", stage = Draft (not active or hold)
                    deals = myDealsStageChangesDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft)).ToList();

                    foreach (OpDataElement de in deals)
                    {
                        SetDealDcMessages(myDealsData, de, null);
                        stageChangesDealIds.Add(de.DcID);
                    }
                }

                if (psGoingPending.Any())
                {
                    start = DateTime.Now;
                    var myDealsPendingDataPs = OpDataElementType.PRC_ST.GetByIDs(psGoingActive.Union(psGoingPending), opDataElementTypesActive, atrbsActive);
                    contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                    foreach (OpDataCollector t in myDealsPendingDataPs[OpDataElementType.WIP_DEAL].Data.Values)
                    {
                        myDealsData[OpDataElementType.WIP_DEAL].Data.Add(t);
                    }
                    deals = myDealsPendingDataPs[OpDataElementType.WIP_DEAL].AllDataElements
                        .Where(d => d.AtrbHasValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft)).ToList();

                    pendingDealIds = deals.Select(d => d.DcID).ToList();

                    foreach (OpDataElement de in deals)
                    {
                        SetDealDcMessages(myDealsData, de, WorkFlowStages.Pending);
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
                                    SetDealDcMessages(myDealsData, de, WorkFlowStages.Won);
                                    de.SetAtrbValue(WorkFlowStages.Won);
                                    tenderWonDealsIds.Add(de.DcID);
                                    dealIds.Add(de.DcID);
                                }
                                else
                                {
                                    if (de.AtrbValue.ToString() != WorkFlowStages.Offer)
                                    {
                                        SetDealDcMessages(myDealsData, de, WorkFlowStages.Offer);
                                        //myDealsDataPs[OpDataElementType.WIP_DEAL].AllDataCollectors
                                        //    .FirstOrDefault(d => d.DcID == de.DcID)
                                        //    .AddTimelineComment($"Stage changed from {de.AtrbValue} to {WorkFlowStages.Offer}");
                                    }
                                    de.SetAtrbValue(WorkFlowStages.Offer);

                                    // For tender deals Submitted to offer notification logged at deal level
                                    AddNotificationLog(notifications, contractToken.ContractId, de.DcID, OpDataElementType.WIP_DEAL, NotificationEvents.TenderSubmittedToOffer);
                                }
                            }
                            else
                            {
                                SetDealDcMessages(myDealsData, de, WorkFlowStages.Active);
                                de.SetAtrbValue(WorkFlowStages.Active);
                            }
                        }
                    }

                    // For non tender deals notification is logged at PS level, (Assumption if there are no Tender deal noifications then all of them are non tender PS)
                    if (!notifications.Any())
                    {
                        psGoingActive.ForEach(psId => AddNotificationLog(notifications, contractToken.ContractId, psId, OpDataElementType.PRC_ST, NotificationEvents.SubmittedToApproved));
                    }
                }
            }

            salesForceTenderReturns.AddRange(myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.SALESFORCE_ID && d.AtrbValue.ToString() != "").Select(d => d.DcID));

            myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.PRC_ST].GroupID = -101; // Whatever the real ID of this object is

            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.PRC_ST].AddSaveActions();
            myDealsData[OpDataElementType.PRC_ST].AddAuditActions(auditableDealIds);

            if (dealIds.Any() || pendingDealIds.Any() || tenderWonDealsIds.Any() || stageChangesDealIds.Any())
            {
                myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
                myDealsData[OpDataElementType.WIP_DEAL].GroupID = -102; // Whatever the real ID of this object is

                // Back to normal operations, clear out the messages and all.
                myDealsData[OpDataElementType.WIP_DEAL].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
                myDealsData[OpDataElementType.WIP_DEAL].Messages.Messages.RemoveAll(r => true);

                // Tack on the save action call now
                List<int> nonTenderIds = dealIds.Where(d => !tenderDealIds.Contains(d)).ToList();
                List<int> possibleMajorIds = dealIds.Where(d => !tenderDealIds.Contains(d) || tenderWonDealsIds.Contains(d) || stageChangesDealIds.Contains(d)).ToList();
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
                //if this is from the tender dashboard, we need to further customize the return message with the newly updated stage and new permisable _actions
                List<int> ps_ids = new List<int>();

                //we need to gather the pricing strategy ids here so that we can also retrieve the corresponding tender wip deals
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    ps_ids.Add(dc.DcID);
                }

                OpDataCollectorFlattenedDictList flatDictList = FetchTenderData(ps_ids, OpDataElementType.PRC_ST);
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
                            //IDs of data collector and opMsg align, so we want to add the item's _actions which will be used by the UI to set the updated dropdown options
                            //ASSUMPTION: Here we assume that as per design we will only ever have one WIP deal for each PS - and that we retrieve them all in the correct order
                            om.ExtraDetails = wip_data[i];
                        }
                        else
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

            if (!salesForceTenderReturns.Any()) return opMsgQueue;
            // Otherwise, these were SalesForce Tenders, process IQR updates and send
            try
            {
                var sendStageToIqr = new TenderTransferRootObject
                {
                    header = new TenderTransferRootObject.Header(),
                    recordDetails = new TenderTransferRootObject.RecordDetails
                    {
                        quote = new TenderTransferRootObject.RecordDetails.Quote
                        {
                            quoteLine =
                                new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine>()
                        }
                    }
                };
                sendStageToIqr.header.xid = Guid.NewGuid().ToString();
                sendStageToIqr.header.source_system = "MyDeals";
                sendStageToIqr.header.target_system = "Tender";
                sendStageToIqr.header.action = "UpdateStatus";
                int lastWipId = -100;

                foreach (int wipDealId in salesForceTenderReturns)
                {
                    string dealBreadcrumbPathJson = myDealsData[OpDataElementType.WIP_DEAL].Data[wipDealId].GetDataElementValue(AttributeCodes.OBJ_PATH_HASH);
                    dynamic dealBreadcrumbPath = JObject.Parse(dealBreadcrumbPathJson);
                    int dealParentPsId = int.Parse(dealBreadcrumbPath.PS.ToString());

                    string newStage = myDealsData[OpDataElementType.WIP_DEAL].Data[wipDealId].GetDataElementValue(AttributeCodes.WF_STG_CD) == WorkFlowStages.Draft
                        ? myDealsData[OpDataElementType.PRC_ST].Data[dealParentPsId].GetDataElementValue(AttributeCodes.WF_STG_CD)
                        : myDealsData[OpDataElementType.WIP_DEAL].Data[wipDealId].GetDataElementValue(AttributeCodes.WF_STG_CD);
                    string wipSfId = myDealsData[OpDataElementType.WIP_DEAL].Data[wipDealId].GetDataElementValue(AttributeCodes.SALESFORCE_ID);

                    //string ApprovedByString = "";
                    //if (newStage == WorkFlowStages.Offer) ApprovedByString = "Manually approved by " + wwid.ToString();
                    string ApprovedByString = wwid.ToString() != "" ? "Manually approved by " + wwid.ToString(): "";

                    var newQuoteLine = new TenderTransferRootObject.RecordDetails.Quote.QuoteLine
                    {
                        DealRFQId = wipDealId.ToString(),
                        DealRFQStatus = newStage,
                        Id = wipSfId,
                        ApprovedByInfo = ApprovedByString
                    };
                    sendStageToIqr.recordDetails.quote.quoteLine.Add(newQuoteLine);

                    lastWipId = wipDealId;
                }

                string jsonData = JsonConvert.SerializeObject(sendStageToIqr);

                JmsDataLib jmsDataLib = new JmsDataLib();

                Guid saveSuccessful = jmsDataLib.SaveTendersDataToStage("TENDER_DEALS_RESPONSE", new List<int>() { lastWipId }, jsonData);

                if (saveSuccessful != Guid.Empty)
                {
                    if (jmsDataLib.PublishBackToSfTenders(jsonData) == true) // The return data has been sent back to tenders, close out our safety record
                        jmsDataLib.UpdateTendersStage(saveSuccessful, "PO_Processing_Complete", new List<int>() { lastWipId });
                }
            }
            catch
            {
                // Something failed in IRQ response send, Do not throw UI exception and Do nothing in this case
            }

            return opMsgQueue;
        }

        // This takes a WIP and myDealsData packet, and sets the deal level DC stage change message as defined by its parent PS
        public void SetDealDcMessages(MyDealsData myDealsData, OpDataElement dealDe, string specificStage)
        {
            List<string> tenderStages = new List<string> { WorkFlowStages.Offer, WorkFlowStages.Won, WorkFlowStages.Lost };
            List<string> salesForceUpdateStages = new List<string> { WorkFlowStages.Pending, WorkFlowStages.Offer, WorkFlowStages.Won };
            OpDataCollector dealDc = myDealsData[OpDataElementType.WIP_DEAL].Data[dealDe.DcID];
            string sfDealTag = dealDc.GetDataElementValue(AttributeCodes.SALESFORCE_ID);
            string dealBreadcrumbPathJson = dealDc.GetDataElementValue(AttributeCodes.OBJ_PATH_HASH);
            if (!string.IsNullOrEmpty(dealBreadcrumbPathJson))
            {
                // Dynamic makes the JSON an map-able object, otherwise need to parse it via dealBreadcrumbPath["PS"].ToString()
                dynamic dealBreadcrumbPath = JObject.Parse(dealBreadcrumbPathJson);
                int dealParentPsId = int.Parse(dealBreadcrumbPath.PS.ToString());
                if (dealParentPsId != 0) // We got back a PS ID, get stage data from there
                {
                    IOpDataElement psWfStgDe = myDealsData[OpDataElementType.PRC_ST].Data[dealParentPsId].GetDataElement(AttributeCodes.WF_STG_CD); 
                    // If this is a tender deal - take the tender WIP stage, else take the PS stage
                    string fromStage = tenderStages.Contains(dealDe.OrigAtrbValue.ToString()) ? dealDe.OrigAtrbValue.ToString() : psWfStgDe.OrigAtrbValue.ToString();
                    string destStage = string.IsNullOrEmpty(specificStage) ? psWfStgDe.AtrbValue.ToString() : specificStage;
                    if (psWfStgDe != null) dealDc.AddTimelineComment($"Deal moved from {fromStage} to {destStage}.");
                    // Check if it is a DA making a change and update the salesforce auto approved by tag
                    if (sfDealTag != "" && fromStage == WorkFlowStages.Submitted && salesForceUpdateStages.Contains(destStage)) dealDc.AddSalesForceApprover();
                }
            }
        }

        public OpMsgQueue ActionTenderApprovals(ContractToken contractToken, List<TenderActionItem> data, string actn)
        {
            //modify contract token with necessary PS/Contract information
            contractToken.CustId = 0;       //we send 0 custId for tenders. when the db sees a 0 on temp table translation it will pull the correct customer info
            contractToken.ContractId = -1;  //we send -1 ContractId for tenders. when the db completes a save the middle tier will catch this -1 case and call a rollup proc that is necessary for approval actions. (see OpDataCollectorDataLib_Save.cs)
            contractToken.ContractIdList = new List<int>(); //when ContractId = -1, we send a contractId List in its place when we call the rollup SP.  (see OpDataCollectorDataLib_Save.cs)
            contractToken.CustAccpt = "Acceptance Not Required in C2A";   //TODO: for now I am assuming tender deals do not need customer acceptance - need to double check with Rabi/Meera
            contractToken.BulkTenderUpdate = true;  //we use this flag to indicate our actions are coming from the tender dashboard.  flag is utilized througout save and approval function pipelines.

            //create actnPs (a list of WfActnItem) which contains pricing strategy IDs and the current wf_stg_cds keyed against the actn (like "Approve")
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>();

            OpMsgQueue ret = new OpMsgQueue();
            List<WfActnItem> wfActnList = new List<WfActnItem>();

            foreach (TenderActionItem tai in data)
            {
                var item = new WfActnItem();
                item.WF_STG_CD = tai.PS_WF_STG_CD;
                item.DC_ID = tai.PS_ID;
                wfActnList.Add(item);

                if (!contractToken.ContractIdList.Contains(tai.CNTRCT_OBJ_SID))
                {
                    contractToken.ContractIdList.Add(tai.CNTRCT_OBJ_SID);
                }
            }

            actnPs[actn] = wfActnList;
            return ActionPricingStrategies(contractToken, actnPs);
        }

        public OpMsgQueue ActionTenders(ContractToken contractToken, List<TenderActionItem> data, string actn)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();

            Dictionary<int, List<TenderActionItem>> contractDecoder = new Dictionary<int, List<TenderActionItem>>();
            foreach (TenderActionItem item in data)
            {
                if (!contractDecoder.ContainsKey(item.CNTRCT_OBJ_SID)) contractDecoder[item.CNTRCT_OBJ_SID] = new List<TenderActionItem>();
                contractDecoder[item.CNTRCT_OBJ_SID].Add(item);
            }

            // Get new Tender Action List
            List<string> actions = MyOpDataCollectorFlattenedItemActions.GetTenderActionList(actn);

            //if the actn does not match anything in the tender action list, this means we are setting an approval action from the tender dashboard
            if (actions.Count() == 0)
            {
                //Code flows through here when the "actn" is not Offer, Won, or Lost - therefore we expect it to be an approval action such as Approve/Revise
                opMsgQueue = ActionTenderApprovals(contractToken, data, actn);
            }
            else
            {
                //Standard code flow for applying a bid action (Offer, Won, Lost) to a tender deal
                List<int> custs = data.Select(t => t.CUST_MBR_SID).ToList();
                List<int> conIds = data.Select(t => t.CNTRCT_OBJ_SID).ToList();

                contractToken.CustId = custs.Count() == 1 ? custs.FirstOrDefault() : 0;
                contractToken.ContractId = conIds.Count() == 1 ? conIds.FirstOrDefault() : -1;

                MyDealsData retMyDealsData = OpDataElementType.WIP_DEAL.UpdateAtrbValue(contractToken, data.Select(t => t.DC_ID).ToList(), Attributes.WF_STG_CD, actn, actn == WorkFlowStages.Won);

                //Flattend the data and pass Trackers as object to UI
                OpDataCollectorFlattenedDictList flatDictList = retMyDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);
                OpDataCollectorFlattenedList rtn = flatDictList.ToHierarchialList(OpDataElementType.WIP_DEAL);
                Dictionary<int, object> dictTrkrs = new Dictionary<int, object>();
                foreach (OpDataCollectorFlattenedItem item in rtn)
                {
                    int dcid = int.Parse(item[AttributeCodes.DC_ID].ToString());
                    var hasTrackers = item[AttributeCodes.HAS_TRACKER];

                    if (hasTrackers.ToString() != "1") continue; // DE84892 - Offer and Lost will not have a tracker and will fail without this check
                    var trackers = item[AttributeCodes.TRKR_NBR];
                    if (!dictTrkrs.ContainsKey(dcid)) dictTrkrs.Add(dcid, trackers);
                }

                // Apply messaging
                opMsgQueue.Messages.Add(new OpMsg
                {
                    MsgType = OpMsg.MessageType.Info,
                    Message = "Action List",
                    ExtraDetails = actn == WorkFlowStages.Won ? (object)dictTrkrs : actions
                });
            }

            return opMsgQueue;
        }

        //fetches data and formats it for tender deals dashboard. Inputs "ids" must be DC_IDs of element types "idTypes".  function put here due to circular referencing problems with keeping it in the tenderslib...
        public OpDataCollectorFlattenedDictList FetchTenderData(List<int> ids, OpDataElementType idTypes)
        {
            MyDealsData myDealsData = idTypes.GetByIDs(ids,
               new List<OpDataElementType>
               {
                    OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL
               });

            // Get all the products in a collection base on the PRODUCT_FILTER
            // Note: the first hit is a performance dog as the product cache builds for the first time
            List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
                .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
            }
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_ST].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
            }

            myDealsData.FillInHolesFromAtrbTemplate();

            OpDataCollectorFlattenedDictList flatDictList = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);

            if (idTypes == OpDataElementType.PRC_ST)
            {
                //we want paths starting from wip deal, so we need to get their ids
                List<int> wip_ids = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.DC_ID))
                .Select(d => d.DcID).ToList();
                //replace the ps_ids we originally passed in with the wip ids
                ids = wip_ids;
            }
            //TODO: get dc paths also calls GetByIds - there ought to be a way to reduce our number of GetByIds calls.
            List<DcPath> paths = OpDataElementType.WIP_DEAL.GetDcPaths(ids);

            // we need to check the contract to see if it was published... best way is to create a dictionary
            Dictionary<int, int> cntrctPublished = new Dictionary<int, int>();
            foreach (var de in myDealsData[OpDataElementType.CNTRCT].AllDataElements.Where(a => a.AtrbCd == AttributeCodes.TENDER_PUBLISHED))
            {
                cntrctPublished[de.DcID] = de.AtrbValue.ToString() == "1" || de.AtrbValue.ToString().ToUpper() == "TRUE" ? 1 : 0;
            }

            // we don't know if this is 1:1 or a mixture of Tender Deals or Tender Folios
            Dictionary<int, OpDataCollectorFlattenedItem> psDecoder = new Dictionary<int, OpDataCollectorFlattenedItem>();
            for (var i = 0; i < flatDictList[OpDataElementType.PRC_ST].Count(); i++)
            {
                psDecoder[(int)flatDictList[OpDataElementType.PRC_ST][i]["DC_ID"]] = flatDictList[OpDataElementType.PRC_ST][i];
            }

            for (var i = 0; i < flatDictList[OpDataElementType.WIP_DEAL].Count(); i++)
            {
                var myDcPath = paths.FirstOrDefault(p => p.WipDealId == (int)flatDictList[OpDataElementType.WIP_DEAL][i]["DC_ID"]);

                if (psDecoder.ContainsKey(myDcPath.PricingStrategyId))
                {
                    var myPs = psDecoder[myDcPath.PricingStrategyId];

                    flatDictList[OpDataElementType.WIP_DEAL][i]["_actionsPS"] = myPs["_actions"];
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_parentIdPS"] = myPs["DC_ID"];
                    flatDictList[OpDataElementType.WIP_DEAL][i]["PRC_ST_OBJ_SID"] = myPs["DC_ID"];
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_actionReasonsPS"] = myPs["_actionReasons"];

                    //the below 2 are relics of when we would potentially see unpublished tender deals in the tender dashboard.  while they are no longer needed, it doesn't hurt to leave the logic here as a failsafe.
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_contractPublished"] = cntrctPublished.ContainsKey((int)myPs["DC_PARENT_ID"]) ? cntrctPublished[(int)myPs["DC_PARENT_ID"]] : 0;
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_contractId"] = (int)myPs["DC_PARENT_ID"];
                }
                else
                {
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_actionsPS"] = null;
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_parentIdPS"] = null;

                    // Angular code expecting a different variable. TODO: make it consistant across to use one variable between _parentIdPS and PRC_ST_OBJ_SID
                    flatDictList[OpDataElementType.WIP_DEAL][i]["PRC_ST_OBJ_SID"] = null;
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_actionReasonsPS"] = null;
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_contractPublished"] = 0;
                    flatDictList[OpDataElementType.WIP_DEAL][i]["_contractId"] = 0;
                }
            }

            return flatDictList;
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