using Intel.MyDeals.App;
using Intel.Opaque;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class CodingPracticesController : Controller
    {
        OpCore op = OpAppConfig.Init();

        // GET: CodingPractices
        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #region Top Level

        public ActionResult BusinessDesign()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Project()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Flows()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Formulas()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult CodingTools()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion


        #region Data Access

        public ActionResult DataAccess()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult DataAccessStoredProcedure()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

        #region Entities

        public ActionResult Entities()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult SharedClasses()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult ClassFromProcedure()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

        #region DataLibrary
        public ActionResult DataLibrary()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult CallProcedure()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Cache()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult CacheManager()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

        #region Business Logic

        public ActionResult BusinessLogic()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult BusinessLogicLayout()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult BusinessLogicScope()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult BusinessLogicFunction()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult BusinessLogicCallProcedure()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult BusinessLogicCallCache()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion



        public ActionResult BusinessRules()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Application()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #region MyDeal Presentation

        public ActionResult Presentation()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult PresentationWebApi()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult PresentationMvcController()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult PresentationCallWebApi()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion



        #region Examples

        public ActionResult Examples()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult DataFromProcWithCache()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult DataFromApiWithCache()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

        #region Coding Tools

        public ActionResult Logging()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult ErrorHandling()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        #endregion

    }
}