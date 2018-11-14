using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ITendersLib
    {
        OpDataCollectorFlattenedDictList GetMaster(int id);

        OpDataCollectorFlattenedDictList GetChildren(int id);

        OpDataCollectorFlattenedDictList BulkTenderUpdate(ContractToken contractToken, ContractTransferPacket contractAndPricingTable);
        
        string BuildWhereClause(SearchParams data, OpDataElementType dealtype);
    }
}