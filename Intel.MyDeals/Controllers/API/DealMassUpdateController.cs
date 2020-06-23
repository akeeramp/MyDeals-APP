using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Linq;
using Intel.MyDeals.DataLibrary;


namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DealMassUpdate")]
    public class DealMassUpdateController : BaseApiController
    {
        private readonly IDealMassUpdateLib _dealMassUpdateLib;

        public DealMassUpdateController(IDealMassUpdateLib dealMassUpdateLib)
        {
            _dealMassUpdateLib = dealMassUpdateLib;
        }

        [Route("UpdateDealsAttrbValue")]
        [HttpPost]
        public List<DealMassUpdateResults> UpdateDealsAttrbValue(DealMassUpdateData data)
        {
            return SafeExecutor(() => _dealMassUpdateLib.UpdateMassDealAttributes(data), "Unable to Update Deals");
        }

        [Authorize]
        [Route("GetUpdateAttributes")]
        public List<AttributeFeilds> GetUpdateAttributes()
        {
            AttributeFeilds atrbFields = new AttributeFeilds();
            var result = new List<AttributeFeilds>();
            var ret = DataCollections.GetAttributeData().All.FirstOrDefault(a => a.ATRB_SID == 3461);
            result.Add(new AttributeFeilds
            {
                ATRB_SID = ret.ATRB_SID,
                ATRB_DESC = ret.ATRB_DESC

            });
            return SafeExecutor(() => result);
        }
    }
}