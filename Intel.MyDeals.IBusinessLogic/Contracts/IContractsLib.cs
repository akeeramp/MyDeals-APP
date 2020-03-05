using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);

        MyDealsData GetContract(int id, bool inclusive = false);

        OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, SavePacket savePacket);

        OpDataCollectorFlattenedDictList SaveTenderContract(int custId, int contractId, ContractTransferPacket data);

        MyDealsData CreateTenderFolio(OpDataCollectorFlattenedList data, SavePacket savePacket);

        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, SavePacket savePacket);

        OpMsg DeleteContract(ContractToken contractToken);

        OpDataCollectorFlattenedList GetUpperContract(int id);

        OpDataCollectorFlattenedList GetContractStatus(int id);

        OpDataCollectorFlattenedDictList GetFullContract(int id);

        OpDataCollectorFlattenedList GetExportContract(int id);

        OpDataCollectorFlattenedDictList SaveFullContract(OpDataCollectorFlattenedDictList fullContracts, SavePacket savePacket);
        

        OpDataCollectorFlattenedDictList SaveContractAndPricingTable(ContractToken contractToken, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish);

        OpDataCollectorFlattenedDictList GetWipFromContract(int id);

        OpDataCollectorFlattenedDictList GetWipExclusionFromContract(int id);

        OpDataCollectorFlattenedDictList UpdateAtrbValue(int custId, int contractId, AtrbSaveItem atrbSaveItem);

        bool IsDuplicateContractTitle(int dcId, string title);       

        bool PublishTenderDeals(int CONTRACT_SID, List<int> excludeList);

        // Salesforce Process Data Call - can't move out of here due to reliance upon built in processing items for opDataCollectors
        string ExecuteSalesForceTenderData(Guid workId);
    }
}