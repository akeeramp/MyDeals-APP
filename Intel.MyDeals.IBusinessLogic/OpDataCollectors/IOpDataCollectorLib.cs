using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IOpDataCollectorLib
    {
        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent);

        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, ContractToken contractToken, List<int> validateIds,
            bool forcePublish, string sourceEvent,
            List<int> ids, List<OpDataElementType> opDataElementTypes, OpDataElementType opTypeGrp,
            List<int> secondaryIds, List<OpDataElementType> secondaryOpDataElementTypes,
            OpDataElementType secondaryOpTypeGrp);

    }
}