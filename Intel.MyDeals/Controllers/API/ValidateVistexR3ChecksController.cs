using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ValidateVistexR3Checks")]
    public class ValidateVistexR3ChecksController : BaseApiController
    {
        private readonly IValidateVistexR3ChecksLib _validateVistexR3ChecksLib;
        //private readonly IValidateVistexR3ChecksLib _validateVistexR3ChecksLib;

        public ValidateVistexR3ChecksController(IValidateVistexR3ChecksLib validateVistexR3ChecksLib)
        {
            _validateVistexR3ChecksLib = validateVistexR3ChecksLib;
        }

        [Route("VistexR3Checks")]
        [HttpPost]
        public ValidateVistexR3Wrapper R3Checks(PushValidateVistexR3Data data)
        {
            return SafeExecutor(() => _validateVistexR3ChecksLib.ValidateVistexR3Checks(data), "Unable to Send Deals");
        }

    }
}