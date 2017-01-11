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
            registerService.RegisterType<IDataCollectionsDataLib, DataCollectionsDataLib>();
            registerService.RegisterType<ICustomerDataLib, CustomerDataLib>();
            registerService.RegisterType<IGeoDataLib, GeoDataLib>();
			registerService.RegisterType<IProductDataLib, ProductDataLib>();
			registerService.RegisterType<IProductCategoriesDataLib, ProductCategoriesDataLib>();
			registerService.RegisterType<ISecurityAttributesDataLib, SecurityAttributesDataLib>();
            registerService.RegisterType<ILoggingDataLib, LoggingDataLib>();
        }
    }
}