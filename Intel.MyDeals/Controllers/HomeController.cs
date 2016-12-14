using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class HomeController : Controller
    {
        OpCore op = OpAppConfig.Init();

        public ActionResult Index()
		{
			OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;

            // Sample Async Get (tightly bound)
            //op.HttpCall.GetAsync<OpUserToken>("http://localhost:25942/api/v1/OpServer/{env}/GetUserToken", (s, e) =>
            //{
            //    if (e != null) throw new ArgumentException("API error: {0}", e.Message);
            //    OpUserToken uToken = s;
            //});

            //OpUserToken uToken2 = op.HttpCall.Get<OpUserToken>("http://localhost:25942/api/v1/OpServer/Local/GetUserToken");


            return View(AppLib.AVM);
        }



    }
}
