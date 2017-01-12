using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class CodingPracticesController : BaseController
    {
        // GET: CodingPractices
        public ActionResult Index()
        {
            return View();
        }

        #region Top Level

        public ActionResult BusinessDesign()
        {
            return View();
        }

        public ActionResult Project()
        {
            return View();
        }

        public ActionResult Flows()
        {
            return View();
        }

        public ActionResult Formulas()
        {
            return View();
        }

        public ActionResult CodingTools()
        {
            return View();
        }

        #endregion


        #region Data Access

        public ActionResult DataAccess()
        {
            return View();
        }

        public ActionResult DataAccessStoredProcedure()
        {
            return View();
        }

        #endregion

        #region Entities

        public ActionResult Entities()
        {
            return View();
        }

        public ActionResult SharedClasses()
        {
            return View();
        }

        public ActionResult ClassFromProcedure()
        {
            return View();
        }

        #endregion

        #region DataLibrary
        public ActionResult DataLibrary()
        {
            return View();
        }

        public ActionResult CallProcedure()
        {
            return View();
        }

        public ActionResult Cache()
        {
            return View();
        }

        public ActionResult CacheManager()
        {
            return View();
        }

        #endregion

        #region Business Logic

        public ActionResult BusinessLogic()
        {
            return View();
        }

        public ActionResult BusinessLogicLayout()
        {
            return View();
        }

        public ActionResult BusinessLogicScope()
        {
            return View();
        }

        public ActionResult BusinessLogicFunction()
        {
            return View();
        }

        public ActionResult BusinessLogicCallProcedure()
        {
            return View();
        }

        public ActionResult BusinessLogicCallCache()
        {
            return View();
        }

        #endregion



        public ActionResult BusinessRules()
        {
            return View();
        }

        public ActionResult Application()
        {
            return View();
        }

        #region MyDeal Presentation

        public ActionResult Presentation()
        {
            return View();
        }

        public ActionResult PresentationWebApi()
        {
            return View();
        }

        public ActionResult PresentationMvcController()
        {
            return View();
        }

        public ActionResult PresentationCallWebApi()
        {
            return View();
        }

        public ActionResult PresentationAngularViews()
        {
            return View();
        }

        #endregion

        #region Examples

        public ActionResult Examples()
        {
            return View();
        }

        public ActionResult DataFromProcWithCache()
        {
            return View();
        }

        public ActionResult DataFromApiWithCache()
        {
            return View();
        }

        #endregion

        #region Coding Tools

        public ActionResult Logging()
        {
            return View();
        }

        public ActionResult ErrorHandling()
        {
            return View();
        }

        public ActionResult UnitTesting()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

    }
}