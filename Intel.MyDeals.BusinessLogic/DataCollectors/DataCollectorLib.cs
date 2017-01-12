using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class DataCollectorLib : IDataCollectorLib
    {
        /// <summary>
        /// Data Collector Data library
        /// </summary>
//        private readonly IDataCollectorLib _dataCollectorLib;

        /// <summary>
        /// DataCollector Data Library, wrapper methods to access static cache
        /// </summary>
        private readonly IDataCollectorDataLib _dataCollectorDataLib;

        public DataCollectorLib(IDataCollectorDataLib dataCollectorDataLib)
        {
            _dataCollectorDataLib = dataCollectorDataLib;
        }

        public OpDataCollectorFlattenedList GetDealsbyIDs(List<int> ids)
        {
            return _dataCollectorDataLib
                .GetByIDs(OpDataElementType.Deals, ids, new List<OpDataElementType> { OpDataElementType.Deals })
                .BuildDealContainer(ids);
        }

        public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data)
        {
            // How this should work:
            // Step 1 - get all of the related DEs for each object given a set of object levels (OpDataElementType) and IDs
            // Step 2 - For each OpDataElementType, Merge changes, then validate

            // get all layer (OpDataElementTypes) based on passed data
            List<int> ids;
            List<OpDataElementType> opDataElementTypes;
            OpDataElementType opTypeGrp;

            data.PredictIdsAndLevels(out ids, out opDataElementTypes, out opTypeGrp);

            // Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
            MyDealsData myDealsData = _dataCollectorDataLib
                .GetByIDs(opTypeGrp, ids, opDataElementTypes)
                .Merge(data)
                .FillInHolesFromTemplate();


            // Note to self..  This does take order values into account.
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                if (!data.ContainsKey(opDataElementType)) continue;

                Guid myBatchId = Guid.NewGuid();

                if (opDataElementType == OpDataElementType.Deals)
                {
                    SaveDealsbyDictionary(data[opDataElementType], myDealsData, myBatchId);
                }
                else
                {
                    SavePacketByDictionary(data[opDataElementType], myDealsData, opDataElementType, myBatchId);
                }
            }

            return PerformTasks(OpActionType.Save, myDealsData);  // execute all save perform task items now
        }

        public void SavePacketByDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, OpDataElementType opDataElementType, Guid myWbBatchId)
        {
            myDealsData.Merge(opDataElementType, data);
            OpDataPacket<OpDataElementType> newPacket = myDealsData[opDataElementType].GetChanges();
            newPacket.BatchID = myWbBatchId;

            // Remove elements that should be ignored for this stage of the save.  
            // In the future, this would tag elements that need to be saved that would then roll out of the changes list due to reset modified
            List<string> myRemoveActions = new List<string> { "SYNCDEAL", "ACTION" }; // (REMOVE LIST) Any sync or action will require a full Save/Sync call that runs through rules, so remove it now.
            List<int> removeList = GetTargets(myDealsData[opDataElementType], myRemoveActions);
            List<OpDataCollector> removeDcList = newPacket.AllDataCollectors.Where(d => removeList.Contains(d.DcID)).ToList();
            foreach (OpDataCollector removeDc in removeDcList)
            {
                if (removeDc.DcID >= 0)
                    newPacket.Data.Remove(removeDc.DcID);
            }

            // Back to normal operations, clear out the messages and all.
            newPacket.Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            newPacket.Messages.Messages.RemoveAll(r => true);
            newPacket.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 20)); // Set action - save it.
            myDealsData[opDataElementType] = newPacket;
            // This is replacing the packet with the changes only.
        }

        public void SaveDealsbyDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, Guid myWbBatchId)
        {
            OpDataElementType opDataElementType = OpDataElementType.Deals;

            //List<int> ids = data.Select(items => int.Parse(items["DEAL_NBR"].ToString())).ToList();
            List<int> prepIds = data.Select(items => int.Parse(items["DEAL_SID"].ToString())).ToList();
            //MyDealsData myDealsData = new DataCollectorDataLib().GetByIDs(OpUserStack.MyOpUserToken, ids, new List<string>(), true, new List<OpDataElementType> { opDataElementType });

            myDealsData.Merge(opDataElementType, data);

            // TODO - Validate data - Run Rules

            OpDataPacket<OpDataElementType> newPacket = myDealsData[opDataElementType].GetChanges();
            newPacket.BatchID = myWbBatchId;

            // Remove elements that should be ignored for this stage of the save.  
            // In the future, this would tag elements that need to be saved that would then roll out of the changes list due to reset modified
            List<string> myRemoveActions = new List<string> { "SYNCDEAL", "ACTION" }; // (REMOVE LIST) Any sync or action will require a full Save/Sync call that runs through rules, so remove it now.
            List<int> removeList = GetTargets(myDealsData[opDataElementType], myRemoveActions);
            List<OpDataCollector> removeDcList = newPacket.AllDataCollectors.Where(d => removeList.Contains(d.DcID)).ToList();
            foreach (OpDataCollector removeDc in removeDcList)
            {
                if (removeDc.DcID >= 0)
                    newPacket.Data.Remove(removeDc.DcID);
            }

            // Back to normal operations, clear out the messages and all.
            newPacket.Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            newPacket.Messages.Messages.RemoveAll(r => true);
            newPacket.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 20)); // Set action to do for PLI data - save it.
            newPacket.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.PREP2DEAL, prepIds, 30));
            myDealsData[opDataElementType] = newPacket;
            // This is replacing the packet with the changes only.
        }
        
        private MyDealsData PerformTasks(OpActionType? actionToRun, MyDealsData myDealsData)
        {
            //return new MyDealsData();
            MyDealsData saveResponseSet = new MyDealsData();

            switch (actionToRun)
            {
                case OpActionType.Save:
                    myDealsData.VerifyBatchIDs();
                    ////saveResponseSet = new DealDataLib().SaveDeals(myDealsData, OpUserStack.MyOpUserToken);
                    break;
                case OpActionType.SyncDeal:
                    myDealsData.VerifyBatchIDs();
        ////        LimitRecords(myDealsData, new List<string> { "PREP2DEAL" }); // SYNCDEAL
        ////        saveResponseSet = new DealDataLib().SaveDeals(myDealsData, OpUserStack.MyOpUserToken);
                    break;
                case OpActionType.Action:
                    myDealsData.VerifyBatchIDs();
        ////        LimitRecords(myDealsData, new List<string> { "PREP2DEAL", "CALC_MSP", "GEN_TRACKER", "DEAL_ROLLBACK_TO_ACTIVE", "SNAPSHOT" }); // SYNCDEAL - DEAL_DELETE is not here, remove those elements since they might cause ghost deals
        ////        saveResponseSet = new DealDataLib().SaveDeals(myDealsData, opUserToken);
                    break;
            }
            return saveResponseSet;
        }

        private List<int> GetTargets(OpDataPacket<OpDataElementType> dataPacket, List<string> gatherActionLists)
        {
            List<int> myTargetIds = new List<int>();
            foreach (OpDataAction action in dataPacket.Actions)
            {
                if (gatherActionLists.Contains(action.Action))
                {
                    myTargetIds.AddRange(action.TargetDcIDs.ToArray());
                }
            }
            return myTargetIds;
        }
    }
}
