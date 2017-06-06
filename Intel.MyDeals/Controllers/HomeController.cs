using System.Web.Mvc;
using Intel.MyDeals.App;

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
