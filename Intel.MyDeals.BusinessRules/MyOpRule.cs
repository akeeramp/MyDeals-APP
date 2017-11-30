using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// MyDeals specific strongly typed OpRule class
    /// This class is just to make writing rules much easier.
    /// </summary>

    public class MyOpRule : OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>
    {
    }

    public class MyObjectRule : OpRule<object[], object, MyRulesTrigger, object>
    {
    }
}
