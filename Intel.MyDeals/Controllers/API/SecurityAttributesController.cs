using Intel.MyDeals.App;
using System.Web.Http;
using Intel.Opaque;
using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using Intel.MyDeals.BusinesssLogic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Controllers
{
    [RoutePrefix("api/SecurityAttributes")]
    public class SecurityAttributesAPIController : ApiController
	{
		#region SecurityActions
		[HttpGet]
		[Route("GetSecurityActions")]
		public IEnumerable<SecurityActions> GetSecurityActions()
		{
			return new SecurityAttributesLib().GetSecurityActions();
		}

		[HttpPost]
		[Route("InsertAction")]
		public SecurityActions InsertAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageSecurityAction(action, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAction")]
		public SecurityActions UpdateAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageSecurityAction(action, CrudModes.Update);
		}

		[Route("DeleteAction")]
		public bool DeleteAction(int id)
		{
			return new SecurityAttributesLib().DeleteSecurityAction(id);
		}
		#endregion

		#region Admin Application
		[HttpGet]
		[Route("GetAdminApplications")]
		public IEnumerable<AdminApplications> GetAdminApplications()
		{
			return new SecurityAttributesLib().GetAdminApplications();
		}

		[HttpPost]
		[Route("InsertAdminApplication")]
		public AdminApplications InsertApplication(AdminApplications app)
		{
			return new SecurityAttributesLib().ManageAdminApplication(app, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminApplication")]
		public AdminApplications UpdateAdminApplication(AdminApplications app)
		{
			return new SecurityAttributesLib().ManageAdminApplication(app, CrudModes.Update);
		}

		[Route("DeleteAdminApplication")]
		public bool DeleteAdminApplication(int id)
		{
			return new SecurityAttributesLib().DeleteAdminApplication(id);
		}
		#endregion

		#region Admin DealTypes
		[HttpGet]
		[Route("GetAdminDealTypes")]
		public IEnumerable<AdminDealType> GetAdminDealTypes()
		{
			return new SecurityAttributesLib().GetAdminDealTypes();
		}

		[HttpPost]
		[Route("InsertAdminDealType")]
		public AdminDealType InsertAdminDealType(AdminDealType dealType)
		{
			return new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminDealType")]
		public AdminDealType UpdateDealType(AdminDealType dealType)
		{
			return new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Update);
		}

		[Route("DeleteAdminDealType")]
		public bool DeleteAdminDealType(int id)
		{
			return new SecurityAttributesLib().DeleteAdminDealType(id);
		}
		#endregion

		#region Admin RoleTypes
		[HttpGet]
		[Route("GetAdminRoleTypes")]
		public IEnumerable<AdminRoleType> GetAdminRoleTypes()
		{
			return new SecurityAttributesLib().GetAdminRoleTypes();
		}

		[HttpPost]
		[Route("InsertAdminRoleType")]
		public AdminRoleType InsertAdminRoleType(AdminRoleType RoleType)
		{
			return new SecurityAttributesLib().ManageAdminRoleType(RoleType, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminRoleType")]
		public AdminRoleType UpdateAdminRoleType(AdminRoleType RoleType)
		{
			return new SecurityAttributesLib().ManageAdminRoleType(RoleType, CrudModes.Update);
		}

		[Route("DeleteAdminRoleType")]
		public bool DeleteAdminRoleType(int id)
		{
			return new SecurityAttributesLib().DeleteAdminRoleType(id);
		}
		#endregion
	}
}