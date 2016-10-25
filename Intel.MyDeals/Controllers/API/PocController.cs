using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    public class PocController : ApiController
    {
        [Authorize]
        [Route("api/Others/GetPocEmp")]
        public IEnumerable<PocEmp> GetPocEmp()
        {
            return new PocLib().GetPocEmp();
        }

        [Authorize]
        [HttpPost]
        [Route("api/Others/SetPocEmp")]
        public void SetPocEmp(PocEmp pocEmp)
        {
            new PocLib().SetPocEmp(pocEmp);
        }

        [Authorize]
        [HttpGet]
        [Route("api/Others/DelPocEmp/{empSid}")]
        public void DelPocEmp(int empSid)
        {
            new PocLib().DelPocEmp(empSid);
        }
    }
}
