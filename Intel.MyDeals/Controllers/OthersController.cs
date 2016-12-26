using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class OthersController : BaseController
    {
        // GET: Others
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Constants()
        {
            return View();
        }
    }
}