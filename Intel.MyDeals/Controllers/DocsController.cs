using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class DocsController : BaseController
    {
        // GET: Docs
        public ActionResult Index()
        {
            return RedirectToAction("Flows", "Docs");
        }

        public ActionResult Flows()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Formulas()
        {
            return View(AppLib.AVM);
        }

    }
}