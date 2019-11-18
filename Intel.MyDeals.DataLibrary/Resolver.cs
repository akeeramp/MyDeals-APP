using Intel.MyDeals.DependencyResolver;
using Intel.MyDeals.IDataLibrary;
using System.ComponentModel.Composition;

namespace Intel.MyDeals.DataLibrary
{
    [Export(typeof(IService))]
    public class Resolver : IService
    {
        public void SetUp(IRegisterService registerService)
        {
            registerService.RegisterType<IConstantLookupDataLib, ConstantLookupDataLib>();
            registerService.RegisterType<ICostTestDataLib, CostTestDataLib>();
            registerService.RegisterType<ICustomerCalendarDataLib, CustomerCalendarDataLib>();
            registerService.RegisterType<ICustomerDataLib, CustomerDataLib>();
            registerService.RegisterType<IDashboardDataLib, DashboardDataLib>();
            registerService.RegisterType<IDataCollectionsDataLib, DataCollectionsDataLib>();
            registerService.RegisterType<IOpDataCollectorDataLib, OpDataCollectorDataLib>();
            registerService.RegisterType<IEcapTrackerDataLib, EcapTrackerDataLib>();
            registerService.RegisterType<IDropdownDataLib, DropdownDataLib>();
            registerService.RegisterType<IFilesDataLib, FilesDataLib>();
            registerService.RegisterType<IFunfactDataLib, FunfactDataLib>();
            registerService.RegisterType<IQuoteLetterDataLib, QuoteLetterDataLib>();
            registerService.RegisterType<IGeoDataLib, GeoDataLib>();
            registerService.RegisterType<ILoggingDataLib, LoggingDataLib>();
            registerService.RegisterType<IProductCategoriesDataLib, ProductCategoriesDataLib>();
            registerService.RegisterType<IProductCostTestDataLib, ProductCostTestDataLib>();
            registerService.RegisterType<IProductDataLib, ProductDataLib>();
            registerService.RegisterType<IRetailPullDataLib, RetailPullDataLib>();
            registerService.RegisterType<ISearchDataLib, SearchDataLib>();
            registerService.RegisterType<ISecurityAttributesDataLib, SecurityAttributesDataLib>();
            registerService.RegisterType<ISoldToIdDataLib, SoldToIdDataLib>();
            registerService.RegisterType<IUiTemplateDataLib, UiTemplateDataLib>();
            registerService.RegisterType<IWorkFlowDataLib, WorkFlowDataLib>();
            registerService.RegisterType<ITimelineDataLib, TimelineDataLib>();
            registerService.RegisterType<IMeetCompDataLib, MeetCompDataLib>();
            registerService.RegisterType<IUserPreferencesDataLib, UserPreferencesDataLib>();
            registerService.RegisterType<IQuoteLetterDataLib, QuoteLetterDataLib>();
            registerService.RegisterType<IJmsDataLib, JmsDataLib>();
            registerService.RegisterType<INotificationsDataLib, NotificationsDataLib>();
            registerService.RegisterType<IDataQualityDataLib, DataQualityDataLib>();
            registerService.RegisterType<IReportingDataLib, ReportingDataLib>();
        }
    }
}