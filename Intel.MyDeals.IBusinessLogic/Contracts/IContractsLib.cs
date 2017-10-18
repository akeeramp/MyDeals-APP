using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);

        MyDealsData GetContract(int id, bool inclusive = false);

        OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent);

        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent, bool resetValidationChild, bool isProductTranslate);

        OpMsg DeleteContract(ContractToken contractToken);

        OpDataCollectorFlattenedList GetUpperContract(int id);

        OpDataCollectorFlattenedList GetContractStatus(int id);

        OpDataCollectorFlattenedDictList GetFullContract(int id);

        OpDataCollectorFlattenedDictList SaveFullContract(ContractToken contractToken, OpDataCollectorFlattenedDictList fullContracts, List<int> validateIds, bool forcePublish, string sourceEvent);

        OpDataCollectorFlattenedDictList SaveContractAndPricingTable(ContractToken contractToken, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish, bool isProductTranslate);

        OpDataCollectorFlattenedDictList GetWipFromContract(int id);

        bool IsDuplicateContractTitle(int dcId, string title);

        dynamic GetContractsStatus(DashboardFilter dashboardFilter);
    }
}