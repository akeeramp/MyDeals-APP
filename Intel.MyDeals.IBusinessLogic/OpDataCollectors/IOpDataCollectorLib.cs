using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IOpDataCollectorLib
    {
        void SavePacketByDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, OpDataElementType opDataElementType, Guid myWbBatchId);
        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, int custId, List<int> validateIds, bool forcePublish, string sourceEvent);
    }
}