using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SecurityAttributes")]
    public class SecurityAttributesController : BaseApiController
    {
        private readonly ISecurityAttributesLib _securityAttributesLib;

        public SecurityAttributesController(ISecurityAttributesLib _securityAttributesLib)
        {
            this._securityAttributesLib = _securityAttributesLib;
        }

		#region Mappings

		[HttpGet]
		[Route("GetSecurityWrapper")]
		public SecurityWrapper GetSecurityWrapper()
		{
			return _securityAttributesLib.GetSecurityMasks();
		}

		[HttpGet]
		[Route("GetSecurityDropdownData")]
		public SecurityDropdownData GetSecurityDropdownData()
		{
			List<OpPair<int, string>> securityActions = GetSecurityActions().OrderBy(x => x.ACTN_CD).Select(x => new OpPair<int, string>(x.ACTN_SID, x.ACTN_CD )).ToList();
			List<OpPair<int, string>> dealTypes = GetAdminDealTypes().OrderBy(x => x.OBJ_SET_TYPE_CD).Select(x => new OpPair<int, string>(x.OBJ_SET_TYPE_SID, x.OBJ_SET_TYPE_CD)).ToList();
			// TODO: Replace Hard-coded appID=1 (for IDMS) with something more dynamic or just get this from db already filtered
			List<OpPair<int, string>> roleTypes = GetAdminRoleTypes().OrderBy(x => x.ROLE_TYPE_CD).Where(x => x.APP_SID == 1).Select(x => new OpPair<int, string>(x.ROLE_TYPE_SID, x.ROLE_TYPE_CD)).ToList(); 

			// TODO: Get Stages from db
			List<OpPair<int, string>> workflowStages = new List<OpPair<int, string>> {
				new OpPair<int, string>(0, "Requested"),
				new OpPair<int, string>(0, "Submitted"),
				new OpPair<int, string>(0, "Hold_Waiting"),
				new OpPair<int, string>(0, "Final_Approval"),
				new OpPair<int, string>(0, "Active"),
				new OpPair<int, string>(0, "Customer_Declined"),
				new OpPair<int, string>(0, "Cancelled"),
				new OpPair<int, string>(0, "Expired")
			}; 

			SecurityDropdownData result = new SecurityDropdownData(securityActions, dealTypes, roleTypes, workflowStages);

			return result;
		}

		[HttpGet]
		[Route("GetDealTypeAtrbs")]
		public Dictionary<string, List<string>> GetDealTypeAtrbs()
		{
			return _securityAttributesLib.GetDealTypeAtrbs();
		}
		
		 // TODO
		//[HttpPost]
		//[Route("InsertMapping")]
		//public SecurityMapping InsertMapping(SecurityMapping Engine)
		//{
		//    return _securityEngineLib.ManageSecurityMapping(Engine, CrudModes.Insert);
		//}

		//[HttpPut]
		//[Route("UpdateMapping")]
		//public SecurityMapping UpdateMapping(SecurityMapping Engine)
		//{
		//    return _securityEngineLib.ManageSecurityMapping(Engine, CrudModes.Update);
		//}

		//[Route("DeleteMapping")]
		//public bool DeleteMapping(int id)
		//{
		//    return _securityEngineLib.DeleteSecurityMapping(id);
		//}


		#endregion

		#region SecurityActions

		[HttpGet]
        [Route("GetSecurityActions")]
        public IEnumerable<SecurityActions> GetSecurityActions()
        {
            return _securityAttributesLib.GetSecurityActions();
        }

        [HttpPost]
        [Route("InsertAction")]
        public SecurityActions InsertAction(SecurityActions action)
        {
            return _securityAttributesLib.ManageSecurityAction(action, CrudModes.Insert);
        }

        [HttpPut]
        [Route("UpdateAction")]
        public SecurityActions UpdateAction(SecurityActions action)
        {
            return _securityAttributesLib.ManageSecurityAction(action, CrudModes.Update);
        }

        [Route("DeleteAction")]
        public bool DeleteAction(int id)
        {
            return _securityAttributesLib.DeleteSecurityAction(id);
        }

        #endregion SecurityActions

        #region Admin Application

        [HttpGet]
        [Route("GetAdminApplications")]
        public IEnumerable<AdminApplications> GetAdminApplications()
        {
            return _securityAttributesLib.GetAdminApplications();
        }

        [HttpPost]
        [Route("InsertAdminApplication")]
        public AdminApplications InsertApplication(AdminApplications app)
        {
            return _securityAttributesLib.ManageAdminApplication(app, CrudModes.Insert);
        }

        [HttpPut]
        [Route("UpdateAdminApplication")]
        public AdminApplications UpdateAdminApplication(AdminApplications app)
        {
			return _securityAttributesLib.ManageAdminApplication(app, CrudModes.Update);
        }

        [Route("DeleteAdminApplication")]
        public bool DeleteAdminApplication(int id)
        {
            return _securityAttributesLib.DeleteAdminApplication(id);
        }

        #endregion Admin Application

        #region Admin DealTypes

        [HttpGet]
        [Route("GetAdminDealTypes")]
        public IEnumerable<AdminDealType> GetAdminDealTypes()
        {
            return _securityAttributesLib.GetAdminDealTypes();
        }

        [HttpPost]
        [Route("InsertAdminDealType")]
        public AdminDealType InsertAdminDealType(AdminDealType dealType)
        {
            return _securityAttributesLib.ManageAdminDealType(dealType, CrudModes.Insert);
        }

        [HttpPut]
        [Route("UpdateAdminDealType")]
        public AdminDealType UpdateDealType(AdminDealType dealType)
        {
            return _securityAttributesLib.ManageAdminDealType(dealType, CrudModes.Update);
        }

        [Route("DeleteAdminDealType")]
        public bool DeleteAdminDealType(int id)
        {
            return _securityAttributesLib.DeleteAdminDealType(id);
        }

        #endregion Admin DealTypes

        #region Admin RoleTypes

        [HttpGet]
        [Route("GetAdminRoleTypes")]
        public IEnumerable<AdminRoleType> GetAdminRoleTypes()
        {
            return _securityAttributesLib.GetAdminRoleTypes();
        }

        [HttpPost]
        [Route("InsertAdminRoleType")]
        public AdminRoleType InsertAdminRoleType(AdminRoleType RoleType)
        {
            return _securityAttributesLib.ManageAdminRoleType(RoleType, CrudModes.Insert);
        }

        [HttpPut]
        [Route("UpdateAdminRoleType")]
        public AdminRoleType UpdateAdminRoleType(AdminRoleType RoleType)
        {
            return _securityAttributesLib.ManageAdminRoleType(RoleType, CrudModes.Update);
        }

        [Route("DeleteAdminRoleType")]
        public bool DeleteAdminRoleType(int id)
        {
            return _securityAttributesLib.DeleteAdminRoleType(id);
        }

        #endregion Admin RoleTypes
    }
}