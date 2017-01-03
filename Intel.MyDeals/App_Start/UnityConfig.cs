using Intel.MyDeals.DependencyResolver;
using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.Mvc3;

namespace Intel.MyDeals
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = BuildUnityContainer();

            System.Web.Mvc.DependencyResolver.SetResolver(new UnityDependencyResolver(container));

            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            RegisterTypes(container);

            return container;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            //Component initialization via MEF
            ServiceLoader.LoadContainer(container, ".\\bin", "Intel.MyDeals.dll");
            ServiceLoader.LoadContainer(container, ".\\bin", "Intel.MyDeals.BusinessLogic.dll");
            ServiceLoader.LoadContainer(container, ".\\bin", "Intel.MyDeals.DataLibrary.dll");
        }
    }
}