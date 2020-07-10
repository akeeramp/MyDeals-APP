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
        [Route("GetUpdateAttributes/{atrb_sid}")]
        public List<AttributeFeildvalues> GetUpdateAttributes(int atrb_sid)
        {
            
                return SafeExecutor(() => _dealMassUpdateLib.GetAttributeValues(atrb_sid), "Unable to get Attribute List");
        }
    }
}