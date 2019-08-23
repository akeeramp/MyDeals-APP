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

        public ActionResult NeedCustomers()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it

            // Set the user details to view bag, these variables are available to all the views
            ViewBag.UserToken = OpUserStack.MyOpUserToken;

            return View();
        }

        public ActionResult LostAccountToken()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it
            return View();
        }

        public ActionResult DirectUser()
        {
            Response.ContentType = "text/html";  //page was rendering as plaintext, this prevents it

            AppLib.InitAvm(OpAppConfig.Init(), AvmforceMode.User);

            // Set the user details to view bag, these variables are available to all the views
            ViewBag.UserToken = OpUserStack.MyOpUserToken;

            return View();
        }

        public ActionResult ResetAVM()
        {
            new CacheLib().ClearCache();
            AppLib.InitAvm(OpAppConfig.Init(), AvmforceMode.AVM);
            return RedirectToAction("Index", "Home");
        }

        public ActionResult ResetMyCache()
        {
            new CacheLib().ClearMyCustomerCache();
            AppLib.InitAvm(OpAppConfig.Init(), AvmforceMode.User);
            return RedirectToAction("Index", "Home");
        }

        public ActionResult ResetMT()
        {
            new CacheLib().ClearCache();
            AppLib.InitAvm(OpAppConfig.Init(), AvmforceMode.All);
            return RedirectToAction("Index", "Home");
        }
    }
}