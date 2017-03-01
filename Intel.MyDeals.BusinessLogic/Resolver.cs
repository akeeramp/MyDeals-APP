using Intel.MyDeals.DependencyResolver;
using Intel.MyDeals.IBusinessLogic;
using System.ComponentModel.Composition;

namespace Intel.MyDeals.BusinessLogic
{
    [Export(typeof(IService))]
    public class Resolver : IService
    {
        public void SetUp(IRegisterService registerService)
        {
            registerService.RegisterType<ICacheLib, CacheLib>();
            registerService.RegisterType<IContractsLib, ContractsLib>();
            registerService.RegisterType<IConstantsLookupsLib, ConstantsLookupsLib>();
            registerService.RegisterType<ICustomerCalendarLib, CustomerCalendarLib>();
            registerService.RegisterType<ICustomerLib, CustomerLib>();
            registerService.RegisterType<IDataCollectorLib, DataCollectorLib>();
            registerService.RegisterType<IDropdownLib, DropdownLib>();
            registerService.RegisterType<IGeosLib, GeosLib>();
            registerService.RegisterType<ILoggingLib, LoggingLib>();
            registerService.RegisterType<IPricingStrategiesLib, PricingStrategiesLib>();
            registerService.RegisterType<IPricingTablesLib, PricingTablesLib>();
            registerService.RegisterType<IProductsLib, ProductsLib>();
            registerService.RegisterType<IProductCategoriesLib, ProductCategoriesLib>();
            registerService.RegisterType<IProductCostTestLib, ProductCostTestLib>();
            registerService.RegisterType<IRuleEngineLib, RuleEngineLib>();
            registerService.RegisterType<ISecurityAttributesLib, SecurityAttributesLib>();
            registerService.RegisterType<IUiTemplateLib, UiTemplateLib>();
            registerService.RegisterType<IWorkFlowLib, WorkFlowLib>();
        }
    }
}