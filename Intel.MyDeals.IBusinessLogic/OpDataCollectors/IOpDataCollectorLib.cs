using System;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IOpDataCollectorLib
    {
        void SavePacketByDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, OpDataElementType opDataElementType, Guid myWbBatchId);
        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, int custId, bool forceValidation, bool forcePublish);
    }
}