using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, SavePacket savePacket);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken);
        OpDataCollectorFlattenedDictList SaveFullPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedDictList fullpricingStrategies);
        OpMsg DeletePricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies);
        OpMsg RollBackObject(OpDataElementType opDataElementType, ContractToken contractToken, int dcId);
        OpMsgQueue CancelPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies);
        OpMsgQueue ActionPricingStrategies(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actnPs);
        OpMsgQueue ActionTenders(ContractToken contractToken, List<TenderActionItem> data, string actn);
        OpMsgQueue ActionTenderApprovals(ContractToken contractToken, List<TenderActionItem> data, string actn);
        OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id);
        OpDataCollectorFlattenedDictList FetchTenderData(List<int> ids, OpDataElementType idsType);
    }
}