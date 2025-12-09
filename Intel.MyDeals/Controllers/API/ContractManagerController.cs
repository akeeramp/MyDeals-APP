using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ContractManager")]
    public class ContractManagerController: BaseApiController
    {
        private readonly IDealExpireStatusLib _dealExpireStatusLib;

        public ContractManagerController(IDealExpireStatusLib dealExpireStatusLib)
        {
            _dealExpireStatusLib = dealExpireStatusLib;
        }

        [Authorize]
        [HttpPost]
        [Route("GetDealExpireStatus")]
        public List<InActvDeals> GetDealExpireStatus([FromBody] DealExpIn CntrctId)
        {
            return SafeExecutor(() => _dealExpireStatusLib.GetDealExpireStatus(CntrctId.ContractID)
                , $"Unable to get Pricing Table {CntrctId.ContractID}"
            );
        }
    }
}