using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDataCollectorLib
    {
        OpDataCollectorFlattenedList GetDealsbyIDs(List<int> ids);
        void SaveDealsbyDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, Guid myWbBatchId);
        void SavePacketByDictionary(OpDataCollectorFlattenedList data, MyDealsData myDealsData, OpDataElementType opDataElementType, Guid myWbBatchId);
        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, int custId);
    }
}