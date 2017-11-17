using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, ContractToken contractToken);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken);
        OpDataCollectorFlattenedDictList SaveFullPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedDictList fullpricingStrategies);
        OpMsg DeletePricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies);
        OpMsg RollBackPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies);
        OpMsgQueue CancelPricingStrategy(ContractToken contractToken, OpDataCollectorFlattenedList pricingStrategies);
        OpMsgQueue ActionPricingStrategies(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actnPs);
        OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id);
    }
}