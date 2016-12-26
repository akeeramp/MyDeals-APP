using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class PocController : BaseController
    {
        // GET: Poc
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SPA()
        {
            return View();
        }
    }
}