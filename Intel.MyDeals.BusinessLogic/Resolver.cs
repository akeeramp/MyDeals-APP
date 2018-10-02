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
            registerService.RegisterType<ICostTestLib, CostTestLib>();
            registerService.RegisterType<ICustomerCalendarLib, CustomerCalendarLib>();
            registerService.RegisterType<ICustomerLib, CustomerLib>();
            registerService.RegisterType<IDashboardLib, DashboardLib>();
            registerService.RegisterType<IOpDataCollectorLib, OpDataCollectorLib>();
            registerService.RegisterType<IDropdownLib, DropdownLib>();
            registerService.RegisterType<IEcapTrackerLib, EcapTrackerLib>();
            registerService.RegisterType<IEmployeesLib, EmployeesLib>();
            registerService.RegisterType<IFilesLib, FilesLib>();
            registerService.RegisterType<IFunfactLib, FunfactLib>();
            registerService.RegisterType<IGeosLib, GeosLib>();
            registerService.RegisterType<ILoggingLib, LoggingLib>();
            registerService.RegisterType<IPricingStrategiesLib, PricingStrategiesLib>();
            registerService.RegisterType<IPricingTablesLib, PricingTablesLib>();
            registerService.RegisterType<IProductsLib, ProductsLib>();
            registerService.RegisterType<IProductCategoriesLib, ProductCategoriesLib>();
            registerService.RegisterType<IProductCostTestLib, ProductCostTestLib>();
            registerService.RegisterType<IRuleEngineLib, RuleEngineLib>();
            registerService.RegisterType<ISearchLib, SearchLib>();
            registerService.RegisterType<ISecurityAttributesLib, SecurityAttributesLib>();
            registerService.RegisterType<ITendersLib, TendersLib>();
            registerService.RegisterType<IUiTemplateLib, UiTemplateLib>();
            registerService.RegisterType<IWorkFlowLib, WorkFlowLib>();
            registerService.RegisterType<ITimelineLib, TimelineLib>();
            registerService.RegisterType<IMeetCompLib, MeetCompLib>();
            registerService.RegisterType<IUserPreferencesLib, UserPreferencesLib>();
            registerService.RegisterType<IQuoteLetterLib, QuoteLetterLib>();
            registerService.RegisterType<IJmsLib, JmsLib>();
            registerService.RegisterType<IOpLogLib, OpLogLib>();
            registerService.RegisterType<INotificationsLib, NotificationsLib>();
        }
    }
}