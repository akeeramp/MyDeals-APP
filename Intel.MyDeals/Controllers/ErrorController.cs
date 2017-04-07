using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View(AppLib.AVM);
        }

        public ActionResult Access()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View(AppLib.AVM);
        }

        public ActionResult Timeout()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View(AppLib.AVM);
        }

        public ActionResult NotFound()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View(AppLib.AVM);
        }

        public ActionResult Security()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View(AppLib.AVM);
        }
    }
}