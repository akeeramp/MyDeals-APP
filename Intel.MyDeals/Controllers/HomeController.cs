using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Reflection;
using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
		{
            // Sample Async Get (tightly bound)
            //op.HttpCall.GetAsync<OpUserToken>("http://localhost:25942/api/v1/OpServer/{env}/GetUserToken", (s, e) =>
            //{
            //    if (e != null) throw new ArgumentException("API error: {0}", e.Message);
            //    OpUserToken uToken = s;
            //});

            //OpUserToken uToken2 = op.HttpCall.Get<OpUserToken>("http://localhost:25942/api/v1/OpServer/Local/GetUserToken");

            //return new RedirectResult(Url.Action("Index") + "#region");
            //return Redirect($"{Url.RouteUrl(new { controller = "Dashboard", action = "Index" })}#/portal");
            return View(AppLib.AVM);
        }

    }
}
