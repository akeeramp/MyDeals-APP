using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Funfact")]
    public class FunfactController : BaseApiController
    {
        private readonly IFunfactLib _funfactLib;
        public FunfactController(IFunfactLib workflowLib)
        {
            _funfactLib = workflowLib;
        }

        [Authorize]
        [Route("GetFunfactItems")]
        public IEnumerable<Funfact> GetFunfactItems()
        {
            return SafeExecutor(() => _funfactLib.GetFunfactItems()
                , $"Unable to get {"Fun Fact"}"
            );
        }

        [Authorize]
        [Route("GetActiveFunfacts")]
        public IEnumerable<Funfact> GetActiveFunfacts()
        {
            return SafeExecutor(() => _funfactLib.GetActiveFunfacts()
                , $"Unable to get {"Fun Fact"}"
            );
        }

        [Authorize]
        [Route("SetFunfact")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<Funfact> SetFunfacts(Funfact data)
        {
            return SafeExecutor(() => _funfactLib.SetFunfacts(CrudModes.Insert, data)
                , $"Unable to get {"Fun Fact"}"
            );            
        }
        [Authorize]
        [Route("DeleteFunfact")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<Funfact> DeleteFunfact(Funfact data)
        {
            return SafeExecutor(() => _funfactLib.SetFunfacts(CrudModes.Delete, data)
                , $"Unable to get {"Fun Fact"}"
            );            
        }
        [Authorize]
        [Route("UpdateFunfact")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<Funfact> UpdateFunfact(Funfact data)
        {
            return SafeExecutor(() => _funfactLib.SetFunfacts(CrudModes.Update, data)
                , $"Unable to get {"Fun Fact"}"
            );
        }
    }
}
