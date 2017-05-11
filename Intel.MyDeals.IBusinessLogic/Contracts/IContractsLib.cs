using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);

        MyDealsData GetContract(int id, bool inclusive = false);

        OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, int custId, bool forceValidation = false);

        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId, bool forceValidation = false);

        OpMsg DeleteContract(int id);

        OpDataCollectorFlattenedList GetUpperContract(int id);

        OpDataCollectorFlattenedList GetContractStatus(int id);
        
        OpDataCollectorFlattenedDictList GetFullContract(int id);

        OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts, bool forceValidation = false);

        OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndStrategy, bool forceValidation = false);

        bool IsDuplicateContractTitle(int dcId, string title);

        dynamic GetContractsStatus(DashboardFilter dashboardFilter);
    }
}