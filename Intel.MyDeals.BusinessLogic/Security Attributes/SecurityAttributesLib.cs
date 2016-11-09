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

		public List<SecurityActions> GetSecurityActions()
		{
			return new SecurityAttributesDataLib().GetSecurityAction();
		}
		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			return new SecurityAttributesDataLib().ManageSecurityAction(action, state);
		}

		public bool DeleteSecurityAction(int id)
		{
			return new SecurityAttributesDataLib().DeleteSecurityAction(id);
		}

	}
}
