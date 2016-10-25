using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Access()
        {
            return View();
        }

        public ActionResult Timeout()
        {
            return View();
        }

        public ActionResult NotFound()
        {
            return View();
        }

        public ActionResult Security()
        {
            return View();
        }
    }
}