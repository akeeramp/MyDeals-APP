using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class SecurityAttributesLib : ISecurityAttributesLib
    {
        private readonly ISecurityAttributesDataLib _securityAttributesDataLib;

        public SecurityAttributesLib(ISecurityAttributesDataLib _securityAttributesDataLib)
        {
            this._securityAttributesDataLib = _securityAttributesDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public SecurityAttributesLib()
        {
            this._securityAttributesDataLib = new SecurityAttributesDataLib();
        }

        public SecurityWrapper GetSecurityMasks()
        {
            return new SecurityWrapper(null, null, null);
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
            return _securityAttributesDataLib.GetSecurityActions();
        }

        public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
        {
            return _securityAttributesDataLib.ManageSecurityAction(action, state);
        }

        public bool DeleteSecurityAction(int id)
        {
            return _securityAttributesDataLib.DeleteSecurityAction(id);
        }

        #endregion SecurityActions

        #region Admin Applications

        public List<AdminApplications> GetAdminApplications()
        {
            return _securityAttributesDataLib.GetAdminApplications();
        }

        public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
        {
            return _securityAttributesDataLib.ManageAdminApplication(app, state);
        }

        public bool DeleteAdminApplication(int id)
        {
            return _securityAttributesDataLib.DeleteAdminApplication(id);
        }

        #endregion Admin Applications

        #region Admin DealTypes

        public List<AdminDealType> GetAdminDealTypes()
        {
            return _securityAttributesDataLib.GetAdminDealTypes();
        }

        public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
        {
            return _securityAttributesDataLib.ManageAdminDealType(dealType, state);
        }

        public bool DeleteAdminDealType(int id)
        {
            return _securityAttributesDataLib.DeleteAdminDealType(id);
        }

        #endregion Admin DealTypes

        #region Admin RoleTypes

        public List<AdminRoleType> GetAdminRoleTypes()
        {
            return _securityAttributesDataLib.GetAdminRoleTypes();
        }

        public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
        {
            return _securityAttributesDataLib.ManageAdminRoleType(roleType, state);
        }

        public bool DeleteAdminRoleType(int id)
        {
            return _securityAttributesDataLib.DeleteAdminRoleType(id);
        }

        #endregion Admin RoleTypes
    }
}