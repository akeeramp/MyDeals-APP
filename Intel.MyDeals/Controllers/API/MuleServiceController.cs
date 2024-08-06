using System;
using System.Web;
using System.Linq;
using System.Web.Http;
using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/MuleService")]
    public class MuleServiceController : ApiController
    {
        private readonly IMuleServiceLib _muleServiceLib;

        public MuleServiceController(IMuleServiceLib muleServiceLib)
        {
            _muleServiceLib = muleServiceLib;
        }

    }
}