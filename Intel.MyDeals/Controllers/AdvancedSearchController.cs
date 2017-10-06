using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class AdvancedSearchController : BaseController
    {
        // GET: Dashboard
        // TODO: Develop a authorize attribute which will take care of security
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }

    }
}