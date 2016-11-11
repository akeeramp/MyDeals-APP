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
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult Security()
        {
            return View();
        }
    }
}