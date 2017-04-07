using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class AdminController : BaseController
    {
        // GET: Dashboard
        // TODO: Develop a authorize attribute which will take care of security
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }
    }
}