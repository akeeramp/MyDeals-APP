using System.Web.Mvc;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class UIAccessController : Controller
    {
        private readonly IEmployeesLib _employeeLib;

        public UIAccessController(IEmployeesLib employeeLib)
        {
            _employeeLib = employeeLib;
        }
        // GET: UIAccess
        public ActionResult Index()
        {
            OpCore op = OpAppConfig.Init();
            string fullUserId = op.Authentication.ContextUserName;
            string userIdentity = (string.IsNullOrEmpty(fullUserId) ? "" : fullUserId);
            string[] aId = userIdentity.Split('\\', '/');
            userIdentity = ((aId.Length == 1) ? aId[0] : aId[aId.Length - 1]).ToUpper();
            OpMsg msg = _employeeLib.getSelfGrantUIAccess(userIdentity);
            return RedirectToAction("Index", "Dashboard");            
        }
    }
}