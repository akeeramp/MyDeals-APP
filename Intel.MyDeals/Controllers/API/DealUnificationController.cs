using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DealUnification")]
    public class DealUnificationController : BaseApiController
    {
        private readonly IDealUnificationLib _dealUnificationLib;

        public DealUnificationController(IDealUnificationLib dealUnificationLib)
        {
            _dealUnificationLib = dealUnificationLib;
        }

        [Authorize]
        [HttpGet]
        [Route("GetUnificationDealReport")]
        public List<UnificationReconciliationReport> GetUnificationDealReport() {
            return SafeExecutor(() => _dealUnificationLib.GetDealUnificationReport(),
                $"Unable to get Unification & Reconciliation Report");
        }
    }
}