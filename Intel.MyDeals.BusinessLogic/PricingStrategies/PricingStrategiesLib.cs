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

        public OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, int custId)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_ST] = data
            }, custId, false, false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PRC_ST] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId, false, false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveFullPricingStrategy(int custId, OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            return SavePricingStrategy(
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_ST) ? fullpricingStrategies[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_TBL) ? fullpricingStrategies[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullpricingStrategies[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.WIP_DEAL) ? fullpricingStrategies[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                custId);
        }


        public OpMsg DeletePricingStrategy(int custId, OpDataCollectorFlattenedList pricingStrategies)
        {
            return pricingStrategies.DeleteByIds(OpDataElementType.PRC_ST, custId, _dataCollectorLib);
        }

        public OpMsgQueue ActionPricingStrategies(int custId, Dictionary<string, List<WfActnItem>> actnPs)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_ST,
                OpDataElementType.PRC_TBL_ROW,
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

                dc.SetDataElementValue(AttributeCodes.WF_STG_CD, targetStage);
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



            myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.PRC_ST].GroupID = -101; // Whatever the real ID of this object is
            
            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.PRC_ST].AddSaveActions();


            myDealsData.EnsureBatchIDs();
            myDealsData.Save(custId);

            return opMsgQueue;
        }


    }
}