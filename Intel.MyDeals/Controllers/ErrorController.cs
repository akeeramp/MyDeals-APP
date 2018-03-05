using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

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
            return View();
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

        public ActionResult NeedCustomers()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it

            // Set the user details to view bag, these variables are available to all the views
            ViewBag.UserToken = OpUserStack.MyOpUserToken;

            return View();
        }

        public ActionResult ResetAVM()
        {
            new CacheLib().ClearCache();
            //new DataCollectionsDataLib().ClearCache();

            OpCore op = OpAppConfig.Init();
            OpUserToken user = AppLib.InitAvm(op, true);

            return RedirectToAction("Index", "Home");
        }
    }
}