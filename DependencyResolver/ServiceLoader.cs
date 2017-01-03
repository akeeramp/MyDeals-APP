using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition.Hosting;
using System.ComponentModel.Composition.Primitives;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Intel.MyDeals.DependencyResolver
{
    public static class ServiceLoader
    {
        public static void LoadContainer(IUnityContainer container, string path, string pattern)
        {
            var directoryCatalog = new DirectoryCatalog(path, pattern);
            var importDefinition = BuildImportDefinition();
            try
            {
                using (var aggregateCatalog = new AggregateCatalog())
                {
                    aggregateCatalog.Catalogs.Add(directoryCatalog);

                    using (var componsitionContainer = new CompositionContainer(aggregateCatalog))
                    {
                        IEnumerable<Export> exports = componsitionContainer.GetExports(importDefinition);

                        IEnumerable<IService> modules =
                            exports.Select(export => export.Value as IService).Where(m => m != null);

                        var registerService = new RegisterService(container);
                        foreach (IService module in modules)
                        {
                            module.SetUp(registerService);
                        }
                    }
                }
            }
            catch (ReflectionTypeLoadException typeLoadException)
            {
                var builder = new StringBuilder();
                foreach (Exception loaderException in typeLoadException.LoaderExceptions)
                {
                    builder.AppendFormat("{0}\n", loaderException.Message);
                }

                throw new TypeLoadException(builder.ToString(), typeLoadException);
            }
        }

        private static ImportDefinition BuildImportDefinition()
        {
            return new ImportDefinition(
                def => true, typeof(IService).FullName, ImportCardinality.ZeroOrMore, false, false);
        }
    }

    internal class RegisterService : IRegisterService
    {
        private readonly IUnityContainer _container;

        public RegisterService(IUnityContainer container)
        {
            this._container = container;
        }

        public void RegisterType<TFrom, TTo>(bool withInterception = false) where TTo : TFrom
        {
            if (withInterception)
            {
                //register with interception
            }
            else
            {
                _container.RegisterType<TFrom, TTo>();
                //_container.RegisterType(AllClasses.FromLoadedAssemblies, WithMappings.MatchingInterface,
                //    WithName.Default);
            }
        }
    }
}