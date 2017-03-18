using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;
using Intel.Opaque.Tools;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SecurityAttributes")]
    public class SecurityAttributesController : BaseApiController
    {
        private readonly ISecurityAttributesLib _securityAttributesLib;
		private readonly IWorkFlowLib _workFlowLib;
		private IDropdownLib _dropdownLib;

		public SecurityAttributesController(ISecurityAttributesLib _securityAttributesLib, IWorkFlowLib workflowLib, IDropdownLib _dropdownLib)
		{
			this._workFlowLib = workflowLib;
            this._securityAttributesLib = _securityAttributesLib;
			this._dropdownLib = _dropdownLib;
		}

		#region SecurityEngine Mappings

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
			List<Dropdown> securityActions = SafeExecutor(() => _dropdownLib.GetSecurityActionsDropdown().OrderBy(x => x.dropdownName).ToList()
				, $"Unable to get Security Actions"
			);
			
			List<OpDataElementSetTypeItem> dealTypes = OpDataElementSetTypeRepository.OpDestCollection.Items;

			// TODO: This might need to be replaced when role types are in the db
			List<Dropdown> roleTypes = SafeExecutor(() => _dropdownLib.GetRoleTypesDropdown().OrderBy(x => x.dropdownName).ToList()
				, $"Unable to get Role Types"
			);

			List<OpPair<int, string>> workflowStages = SafeExecutor(() => _workFlowLib.GetWorkFlowStages().Select(x => new OpPair<int, string>(x.WFSTG_MBR_SID, x.WFSTG_NM)).ToList()
				, $"Unable to get Workflow Stages"
			);
			
			List<OpDataElementTypeItem> objTypes = OpDataElementTypeRepository.OpDetCollection.Items;

			return ( new SecurityDropdownData(securityActions, dealTypes, roleTypes, workflowStages, objTypes));
		}

		[HttpGet]
		[Route("GetObjAtrbs")]
		public Dictionary<string, Dictionary<string, List<string>>> GetObjAtrbs()
		{
			return _securityAttributesLib.GetObjAtrbs();
		}
		
		[HttpPost]
		[Route("SaveSecurityMapping")]
		public bool SaveSecurityMappings(List<SecurityMapSave> saveMappings)
		{
			return _securityAttributesLib.SaveSecurityMappings(saveMappings);
		}
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