using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/dataFix")]
    public class DataFixController : BaseApiController
    {
        private readonly IDataFixLib _dataFixLib;

        public DataFixController(IDataFixLib dataFixLib)
        {
            _dataFixLib = dataFixLib;
        }

        [Authorize]
        [Route("UpdateDataFix")]
        [HttpPost]
        [AntiForgeryValidate]
        public DataFix UpdateDataFix(DataFix data)
        {
            return SafeExecutor(() => _dataFixLib.UpdateDataFix(data), "Unable to save data fix");
        }

        [Route("GetDataFixes")]
        public List<DataFix> GetDataFixes()
        {
            return SafeExecutor(() => _dataFixLib.GetDataFixes(), "Unable to get data fixes");
        }

        [Route("GetDataFixActions")]
        public List<DropDowns> GetDataFixActions()
        {
            return SafeExecutor(() => _dataFixLib.GetDataFixActions(), "Unable to get actions for data fix");
        }
    }
}
