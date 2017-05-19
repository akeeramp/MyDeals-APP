using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);

        MyDealsData GetContract(int id, bool inclusive = false);

        OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, int custId, List<int> validateIds, bool forcePublish, string sourceEvent);

        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId, List<int> validateIds, bool forcePublish, string sourceEvent);

        OpMsg DeleteContract(int id);

        OpDataCollectorFlattenedList GetUpperContract(int id);

        OpDataCollectorFlattenedList GetContractStatus(int id);
        
        OpDataCollectorFlattenedDictList GetFullContract(int id);

        OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts, List<int> validateIds, bool forcePublish, string sourceEvent);

        OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish);

        OpDataCollectorFlattenedDictList GetWipFromContract(int id);

        bool IsDuplicateContractTitle(int dcId, string title);

        dynamic GetContractsStatus(DashboardFilter dashboardFilter);
    }
}