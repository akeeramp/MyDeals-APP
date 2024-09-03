using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get customer information.
    [RoutePrefix("api/SDM")]
    public class SDMAPIController : BaseApiController
    {
        private readonly ISDMLib _isdmLib;

        public SDMAPIController(ISDMLib isdmLib)
        {
            _isdmLib = isdmLib;
        }

        /// <summary>
        /// Get All Retail Pull Dollar Stage Data
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("GetSDMStageData")]
        public SDMStageDataResult GetSDMStageData([FromBody] GetSdmFilter data)
        {
            return SafeExecutor(() => _isdmLib.GetSDMStageData(data.take, data.skip, data.whereStg, data.orderBy, data.pageChange)
                , "Unable to get Retail Pull Dollar Stage Data"
            );
        }

        /// <summary>
        /// Get All Retail Pull Dollar Master Prd Data
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("GetMstrPrdDtls")]
        public SDMMasterProductDetails GetMstrPrdDtls([FromBody] GetPrdMstr data)
        {
            return SafeExecutor(() => _isdmLib.GetMstrPrdDtls(data.take, data.skip, data.whereStg, data.pageChange)
                , "Unable to get Retail Pull Dollar Master Data"
            );
        }

        /// <summary>
        /// Get All Retail Pull Dollar Dropdown Data
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("GetSdmDropValues")]
        public IEnumerable<string> GetSdmDropValues([FromBody] SdmDropVal data)
        {
            return SafeExecutor(() => _isdmLib.GetSdmDropValues(data)
                , "Unable to get Retail Pull Dollar Dropdown Data"
            );
        }


        /// <summary>
        /// Update/Delete Retail Pull Dollar Data
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("UpdtSdmData")]
        [AntiForgeryValidate]
        public string UpdtSdmData([FromBody] List<SDMData> data)
        {
            return SafeExecutor(() => _isdmLib.UpdtSdmData(data)
                , "Unable to modify Retail Pull Dollar Data"
            );
        }
    }
}
