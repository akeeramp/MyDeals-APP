using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SdsDealOverride")]
    public class SdsDealOverrideController : BaseApiController
    {
        private readonly ISdsDealOverrideLib _sdsDealOverrideLib;

        public SdsDealOverrideController(ISdsDealOverrideLib sdsDealOverrideLib)
        {
            _sdsDealOverrideLib = sdsDealOverrideLib;
        }

        [Authorize]
        [Route("GetSdsDealOverrideRules")]
        public List<SdsDealOverride> GetSdsDealOverrideRules()
        {
            return SafeExecutor(() => _sdsDealOverrideLib.GetSdsDealOverrideRules()
                , "Unable to get SdsDealOverrideRules"
            );
        }

        [Route("SaveSdsDealOverrides")]
        [HttpPost]
        public string SaveSdsDealOverrides(SdsDealOverride data)
        {
            string _mode = "SAVE";
            return SafeExecutor(() => _sdsDealOverrideLib.SaveSdsDealOverride(_mode, data), "Unable to Save SDS Updates");
            //return "{\"COLUMNS\":[{\"FIELD\":\"PTR\",\"TITLE\":\"Price Table ID\"},{\"FIELD\":\"WIP\",\"TITLE\":\"Deal ID\"},{\"FIELD\":\"STG\",\"TITLE\":\"Deal Stage\"},{\"FIELD\":\"STAT\",\"TITLE\":\"Status\"}],\"DATA\":[{\"PTR\":93361,\"WIP\":200586,\"STG\":\"Active\",\"STAT\":\"Value Update FAILED Due to Stage\"},{\"PTR\":93365,\"WIP\":200589,\"STG\":\"Cancelled\",\"STAT\":\"Value Update FAILED Due to Stage\"},{\"PTR\":4813575,\"WIP\":4912425,\"STG\":\"Draft\",\"STAT\":\"Value Update was Successful\"},{\"PTR\":591104,\"WIP\":585931,\"STG\":\"Offer\",\"STAT\":\"Value Update FAILED Due to Stage\"},{\"PTR\":592063,\"WIP\":586551,\"STG\":\"Hold\",\"STAT\":\"Value Update was Successful\"}]}";
        }

        [Route("SdsGetActiveOverrides")]
        [HttpGet]
        public string SdsGetActiveOverrides()
        {
            string _mode = "CURRENT_OVERRIDES";
            //return "[{\"DealId\":4912424,\"Value\":\"5\",\"Date\":\"07-06-2023\",\"WWID\":10548414},{\"Deal Id\":4912425,\"Value\":\"5\",\"Date\":\"06-23-2023\",\"WWID\":999999999}]";
            return SafeExecutor(() => _sdsDealOverrideLib.GetSdsOverrideReport(_mode), "Unable to Get SDS Active Overrides Report");
        }


        [Route("SdsGetHistoryOverrides")]
        [HttpGet]
        public string SdsGetHistoryOverrides()
        {
            string _mode = "HISTORY_OVERRIDES";
            return SafeExecutor(() => _sdsDealOverrideLib.GetSdsOverrideReport(_mode), "Unable to Get SDS Active Overrides Report");
        }

    }
}