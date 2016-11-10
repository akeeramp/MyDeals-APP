using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;


namespace Intel.MyDeals.BusinesssLogic
{
    public class SecurityAttributesLib
    {

        public SecurityWrapper GetSecurityMasks()
        {
            return new SecurityWrapper(null,null,null);
            //return DataCollections.GetSecurityWrapper();
        }

        public List<AppRoleTier> GetAppRoleTiers()
        {
            return new List<AppRoleTier>();
            //return DataCollections.GetAppRoleTiers();
        }

		public List<OpRoleType> GetOpRoleTypes()
        {
            // Load Role Types
            return GetAppRoleTiers().Where(r => r.APPL_CD == "IDMS").Select(appRoleTier => new OpRoleType
            {
                RoleTypeId = appRoleTier.ROLE_TYPE_SID,
                RoleTypeCd = appRoleTier.ROLE_TYPE_CD,
                RoleTier = appRoleTier.ROLE_TIER_CD,
                RoleTypeDescription = appRoleTier.ROLE_TYPE_DESC,
                RoleTypeDisplayName = appRoleTier.ROLE_TYPE_DSPLY_CD
            }).ToList();
        }

		#region SecurityActions
		public List<SecurityActions> GetSecurityActions()
		{
			return new SecurityAttributesDataLib().GetSecurityActions();
		}
		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			return new SecurityAttributesDataLib().ManageSecurityAction(action, state);
		}

		public bool DeleteSecurityAction(int id)
		{
			return new SecurityAttributesDataLib().DeleteSecurityAction(id);
		}
		#endregion

		#region Admin Applications
		public List<AdminApplications> GetAdminApplications()
		{
			return new SecurityAttributesDataLib().GetAdminApplications();
		}
		public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
		{
			return new SecurityAttributesDataLib().ManageAdminApplication(app, state);
		}

		public bool DeleteAdminApplication(int id)
		{
			return new SecurityAttributesDataLib().DeleteAdminApplication(id);
		}
		#endregion

		#region Admin DealTypes
		public List<AdminDealType> GetAdminDealTypes()
		{
			return new SecurityAttributesDataLib().GetAdminDealTypes();
		}
		public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
		{
			return new SecurityAttributesDataLib().ManageAdminDealType(dealType, state);
		}

		public bool DeleteAdminDealType(int id)
		{
			return new SecurityAttributesDataLib().DeleteAdminDealType(id);
		}
		#endregion

		#region Admin RoleTypes
		public List<AdminRoleType> GetAdminRoleTypes()
		{
			return new SecurityAttributesDataLib().GetAdminRoleTypes();
		}
		public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
		{
			return new SecurityAttributesDataLib().ManageAdminRoleType(roleType, state);
		}

		public bool DeleteAdminRoleType(int id)
		{
			return new SecurityAttributesDataLib().DeleteAdminRoleType(id);
		}
		#endregion


	}
}
