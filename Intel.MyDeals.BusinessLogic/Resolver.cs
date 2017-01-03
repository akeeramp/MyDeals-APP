using Intel.MyDeals.BusinesssLogic;
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
            registerService.RegisterType<IConstantsLookupsLib, ConstantsLookupsLib>();
            registerService.RegisterType<ICustomerCalendarLib, CustomerCalendarLib>();
            registerService.RegisterType<ICacheLib, CacheLib>();
            registerService.RegisterType<ICustomerLib, CustomerLib>();
            registerService.RegisterType<IGeosLib, GeosLib>();
            registerService.RegisterType<IProductsLib, ProductsLib>();
            registerService.RegisterType<ISecurityAttributesLib, SecurityAttributesLib>();
            registerService.RegisterType<ILoggingLib, LoggingLib>();
        }
    }
}