using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DSA")]
    public class DownStreamController : BaseApiController
    {
        private readonly IDsaEngineLib _dsaLib;

        public DownStreamController(IDsaEngineLib _dsaLib)
        {
            this._dsaLib = _dsaLib;
        }

        [Authorize]
        [Route("GetVistex")]
        public List<Vistex> GetVistex()
        {
            return SafeExecutor(() => _dsaLib.GetVistex(), $"Unable to get vistex data");
        }

        [Authorize]
        [Route("GetVistexAttrCollection/{id}")]
        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            return SafeExecutor(() => _dsaLib.GetVistexAttrCollection(id), $"Unable to get vistex data body");
        }
    }
}