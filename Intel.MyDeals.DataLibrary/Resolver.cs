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
            registerService.RegisterType<ICustomerCalendarDataLib, CustomerCalendarDataLib>();
            registerService.RegisterType<ICustomerDataLib, CustomerDataLib>();
            registerService.RegisterType<IDataCollectionsDataLib, DataCollectionsDataLib>();
            registerService.RegisterType<IDataCollectorDataLib, DataCollectorDataLib>();
            registerService.RegisterType<IDropdownDataLib, DropdownDataLib>();
            registerService.RegisterType<IGeoDataLib, GeoDataLib>();
            registerService.RegisterType<ILoggingDataLib, LoggingDataLib>();
            registerService.RegisterType<IProductCategoriesDataLib, ProductCategoriesDataLib>();
            registerService.RegisterType<IProductDataLib, ProductDataLib>();
            registerService.RegisterType<IRuleEngineDataLib, RuleEngineDataLib>();
            registerService.RegisterType<ISecurityAttributesDataLib, SecurityAttributesDataLib>();
            registerService.RegisterType<IUiTemplateDataLib, UiTemplateDataLib>();
            registerService.RegisterType<IWorkFlowDataLib, WorkFlowDataLib>();

            registerService.RegisterType<IProductCostTestDataLib, ProductCostTestDataLib>();
        }
    }
}