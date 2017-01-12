using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Lookups/v1")]
    public class LookupsController : BaseApiController
    {
        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public LookupsController(IConstantsLookupsLib _constantsLookupsLib)
        {
            this._constantsLookupsLib = _constantsLookupsLib;
        }

        [Authorize]
        [Route("GetLookups")]
        public List<LookupItem> Get()
        {
            return SafeExecutor(() => _constantsLookupsLib.GetLookups()
                , "Unable to get lookup values"
            );
        }


        [Authorize]
        [Route("GetLookups/{cd}")]
        public IQueryable Get(string cd)
        {
            return SafeExecutor(() => _constantsLookupsLib.GetLookups(cd).AsQueryable()
                , $"Unable to get lookup value for {cd}"
            );
        }
    }
}
