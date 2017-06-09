using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class OpDataCollectorLib : IOpDataCollectorLib
    {
        /// <summary>
        /// DataCollector Data Library, wrapper methods to access static cache
        /// </summary>
        private readonly IOpDataCollectorDataLib _dataCollectorDataLib;

        public OpDataCollectorLib(IOpDataCollectorDataLib dataCollectorDataLib)
        {
            _dataCollectorDataLib = dataCollectorDataLib;
        }


        public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, int custId, List<int> validateIds, bool forcePublish, string sourceEvent,
            List<int> ids, List<OpDataElementType> opDataElementTypes, OpDataElementType opTypeGrp,
            List<int> secondaryIds, List<OpDataElementType> secondaryOpDataElementTypes, OpDataElementType secondaryOpTypeGrp)
        {
            MyDealsData myDealsData = new MyDealsData();

            // Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
            if (ids.Any() && opDataElementTypes.Any())
            {
                MyDealsData primaryMyDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data);
                foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in primaryMyDealsData)
                {
                    myDealsData[kvp.Key] = kvp.Value;
                }
            }

            if (secondaryIds.Any() && secondaryOpDataElementTypes.Any())
            {
                MyDealsData secondaryMyDealsData = secondaryOpTypeGrp.GetByIDs(secondaryIds, secondaryOpDataElementTypes, data);
                foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in secondaryMyDealsData)
                {
                    myDealsData[kvp.Key] = kvp.Value;
                }
            }

            return SavePacketsBase(data, custId, myDealsData, validateIds, forcePublish, sourceEvent);
        }

        public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, int custId, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            List<int> ids;
            List<OpDataElementType> opDataElementTypes;
            OpDataElementType opTypeGrp;

            // get all layer (OpDataElementTypes) based on passed data
            data.PredictIdsAndLevels(out ids, out opDataElementTypes, out opTypeGrp);

            // Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
            MyDealsData myDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data);

            return SavePacketsBase(data, custId, myDealsData, validateIds, forcePublish, sourceEvent);
        }


        public MyDealsData SavePacketsBase(OpDataCollectorFlattenedDictList data, int custId, MyDealsData myDealsData, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            // Save Data Cycle: Point 9

            // How this should work:
            // Step 1 - get all of the related DEs for each object given a set of object levels (OpDataElementType) and IDs
            // Step 2 - For each OpDataElementType, Merge changes, then validate



            // RUN RULES HERE - If there are validation errors... stop... but we need to save the validation status
            MyDealsData myDealsDataWithErrors = null;
            bool hasErrors = myDealsData.ValidationApplyRules(validateIds, forcePublish, sourceEvent, custId);
            if (hasErrors)
            {
                // "Clone" to object...
                string json = JsonConvert.SerializeObject(myDealsData);
                myDealsDataWithErrors = JsonConvert.DeserializeObject<MyDealsData>(json);
            }

            // Note to self..  This does take order values into account.
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                if (!data.ContainsKey(opDataElementType)) continue;
                SavePacketByDictionary(data[opDataElementType], myDealsData, opDataElementType, Guid.NewGuid());
            }

            MyDealsData myDealsDataResults = PerformTasks(OpActionType.Save, myDealsData, custId);  // execute all save perform task items now

            if (hasErrors) TransferActions(myDealsDataResults, myDealsDataWithErrors);
            return hasErrors ? myDealsDataWithErrors : myDealsDataResults;
        }

        private void TransferActions(MyDealsData myDealsDataResults, MyDealsData myDealsDataWithErrors)
        {
            foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in myDealsDataResults)
            {
                if (myDealsDataResults[kvp.Key].Actions == null || !myDealsDataResults[kvp.Key].Actions.Any()) continue;
                if (!myDealsDataWithErrors.ContainsKey(kvp.Key)) myDealsDataWithErrors[kvp.Key] = new OpDataPacket<OpDataElementType>();
                myDealsDataWithErrors[kvp.Key].Actions = myDealsDataResults[kvp.Key].Actions;
            }
        }

        public void SavePacketByDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, OpDataElementType opDataElementType, Guid myWbBatchId)
        {
            // Save Data Cycle: Point 10

            //myDealsData.Merge(opDataElementType, data);
            OpDataPacket<OpDataElementType> newPacket = myDealsData[opDataElementType].GetChanges(); // Goes through the collection and passes only changes after rules.

            newPacket.BatchID = myWbBatchId;
            newPacket.GroupID = -101; // Whatever the real ID of this object is
            newPacket.PacketType = opDataElementType; // Why wasn't this set in constructor??

            // Back to normal operations, clear out the messages and all.
            //newPacket.Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            //newPacket.Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            newPacket.AddSaveActions();
            newPacket.AddDeleteActions(data);

            myDealsData[opDataElementType] = newPacket;
        }


        //public void SaveDealsbyDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, Guid myWbBatchId)
        //{
        //    OpDataElementType opDataElementType = OpDataElementType.Deals;

        //    myDealsData.Merge(opDataElementType, data);

        //    // TODO - Validate data - Run Rules

        //    OpDataPacket<OpDataElementType> newPacket = myDealsData[opDataElementType].GetChanges();
        //    newPacket.BatchID = myWbBatchId;
        //    newPacket.PacketType = opDataElementType; // Why wasn't this set in constructor??

        //    // Remove elements that should be ignored for this stage of the save.  
        //    // In the future, this would tag elements that need to be saved that would then roll out of the changes list due to reset modified
        //    List<string> myRemoveActions = new List<string> { "SYNCDEAL", "ACTION" }; // (REMOVE LIST) Any sync or action will require a full Save/Sync call that runs through rules, so remove it now.
        //    List<int> removeList = GetTargets(myDealsData[opDataElementType], myRemoveActions);
        //    List<OpDataCollector> removeDcList = newPacket.AllDataCollectors.Where(d => removeList.Contains(d.DcID)).ToList();
        //    foreach (OpDataCollector removeDc in removeDcList)
        //    {
        //        if (removeDc.DcID >= 0)
        //            newPacket.Data.Remove(removeDc.DcID);
        //    }

        //    // Back to normal operations, clear out the messages and all.
        //    newPacket.Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
        //    newPacket.Messages.Messages.RemoveAll(r => true);
        //    newPacket.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 20)); // Set action to do for PLI data - save it.
        //    //newPacket.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.PREP2DEAL, prepIds, 30));
        //    myDealsData[opDataElementType] = newPacket;
        //    // This is replacing the packet with the changes only.
        //}

        private MyDealsData PerformTasks(OpActionType? actionToRun, MyDealsData myDealsData, int custId)
        {
            // Save Data Cycle: Point 14

            //return new MyDealsData();
            MyDealsData saveResponseSet = new MyDealsData();
            myDealsData.EnsureBatchIDs();

            switch (actionToRun)
            {
                case OpActionType.Save:
                    saveResponseSet = myDealsData.Save(custId);
                    // Save Data Cycle: Point 21 (END)
                    break;
                case OpActionType.SyncDeal:
        ////        LimitRecords(myDealsData, new List<string> { "PREP2DEAL" }); // SYNCDEAL
        ////        saveResponseSet = new DealDataLib().SaveDeals(myDealsData, OpUserStack.MyOpUserToken);
                    break;
                case OpActionType.Action:
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
