using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.RulesEngine;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Intel.MyDeals.BusinessRules;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/Rules")]
    public class RulesController : BaseApiController
    {
        private readonly IRuleEngineLib _rulesLib;

        public RulesController(IRuleEngineLib _rulesLib)
        {
            this._rulesLib = _rulesLib;
        }

        [Authorize]
        [Route("GetBusinessRules")]
        public List<MyOpRule> GetBusinessRules()
        {
            return SafeExecutor(() => _rulesLib.GetBusinessRules()
                , $"Unable to get Business Rules"
            );
        }

        [Authorize]
        [Route("RunPriceRules")]
        public bool RunPriceRules()
        {
            return SafeExecutor(() => _rulesLib.RunPriceRules()
                            , $"Unable to get Business Rules"
                        );
        }
    }
}