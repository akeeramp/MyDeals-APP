using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using System;
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
        [Route("GetVistexOutBoundData")]
        public List<Vistex> GetVistexOutBoundData()
        {
            return SafeExecutor(() => _dsaLib.GetVistexOutBoundData(), $"Unable to get vistex outbound data");
        }

        [Authorize]
        [Route("GetVistexStatuses")]
        public List<string> GetVistexStatuses()
        {
            return SafeExecutor(() => _dsaLib.GetVistexStatuses(), $"Unable to get vistex statuses");
        }

        [Authorize]
        [Route("GetVistexAttrCollection/{id}")]
        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            return SafeExecutor(() => _dsaLib.GetVistexAttrCollection(id), $"Unable to get vistex data body");
        }

        [Authorize]
        [Route("UpdateVistexStatus/{strTransantionId}/{strVistexStage}/{dealId}/{strErrorMessage}")]
        [HttpPost]
        [AntiForgeryValidate]
        public Guid UpdateVistexStatus(string strTransantionId, string strVistexStage, int dealId, string strErrorMessage)
        {
            Guid batchId = Guid.Parse(strTransantionId);
            VistexStage vistexStage = (VistexStage)Enum.Parse(typeof(VistexStage), strVistexStage);
            return SafeExecutor(() => _dsaLib.UpdateVistexStatus(batchId, vistexStage, dealId, strErrorMessage), $"Unable to update vistex status");
        }

        [Authorize]
        [Route("SendVistexData")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<Vistex> SendVistexData(List<int> lstDealIds)
        {
            return SafeExecutor(() => _dsaLib.AddVistexData(lstDealIds), $"Unable to send vistex data");
        }
    }
}