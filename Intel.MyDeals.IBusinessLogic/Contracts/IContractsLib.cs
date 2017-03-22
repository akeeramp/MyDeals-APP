using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);

        MyDealsData GetContract(int id, bool inclusive = false);

        OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, int custId);

        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);

        OpMsg DeleteContract(int id);

        OpDataCollectorFlattenedList GetUpperContract(int id);

        OpDataCollectorFlattenedDictList GetFullContract(int id);

        OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts);

        OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndStrategy);

        bool IsDuplicateContractTitle(int dcId, string title);
    }
}