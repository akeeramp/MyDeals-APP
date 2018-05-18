using Intel.MyDeals.App;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class HelpController : BaseController
    {
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }
	}
}