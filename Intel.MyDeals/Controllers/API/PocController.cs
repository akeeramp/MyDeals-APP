using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Others")]
    public class PocController : BaseApiController
    {
        [Authorize]
        [Route("GetPocEmp")]
        public IEnumerable<PocEmp> GetPocEmp()
        {
            return new PocLib().GetPocEmp();
        }

        [Authorize]
        [HttpPost]
        [Route("SetPocEmp")]
        public void SetPocEmp(PocEmp pocEmp)
        {
            new PocLib().SetPocEmp(pocEmp);
        }

        [Authorize]
        [HttpGet]
        [Route("DelPocEmp/{empSid}")]
        public void DelPocEmp(int empSid)
        {
            new PocLib().DelPocEmp(empSid);
        }
    }
}
