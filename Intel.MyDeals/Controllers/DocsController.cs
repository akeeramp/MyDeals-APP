using System.Web.Mvc;

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
            return View();
        }

        public ActionResult Formulas()
        {
            return View();
        }

    }
}