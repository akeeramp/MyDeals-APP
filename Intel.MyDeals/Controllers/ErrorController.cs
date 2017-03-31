using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult Access()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult Timeout()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult NotFound()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult Security()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }
    }
}