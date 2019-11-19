using Intel.Opaque;
using System.DirectoryServices;
using System;
using System.DirectoryServices.AccountManagement;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{    
    public static class OpUserTokenExtensionMethods
    {
        private static bool ObjToBool(object obj)
        {
            if (obj is bool)
            {
                return (bool)obj;
            }
            return false;
        }
        
        public static bool IsSuper(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_SUPER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] ?? false);
        }
        public static bool IsDeveloper(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_DEVELOPER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] ?? false);
        }
        public static bool IsTester(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_TESTER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] ?? false);
        }
        public static bool IsCustomerAdmin(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_CUSTOMERADMIN) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_CUSTOMERADMIN] ?? false);
        }

        public static bool IsRealSA(this OpUserToken opUserToken)
        {
            return opUserToken != null && 
                opUserToken.Role.RoleTypeCd == "SA" && // And is an SA user
                opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_CUSTOMERADMIN) && 
                !ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_CUSTOMERADMIN] ?? false); // And is not Customer Admin, else neuter the SA
        }

        public static bool IsInvalidUser(this OpUserToken opUserToken)
        {
            return opUserToken.Usr.WWID <= 0;
        }

        //TODO: Saurav will Cache this in MT and remove user.GetGroups() call everytime..
        public static bool IsReportingUser(this OpUserToken opUserToken)
        {
            string userName = opUserToken.Usr.Idsid;
            UserPrincipal user = null;
            bool isReportingUser = false;

            PrincipalContext ctx = new PrincipalContext(ContextType.Domain, "corpad.intel.com");
            {
                if ((user = UserPrincipal.FindByIdentity(ctx, userName)) != null)
                {
                    PrincipalSearchResult<Principal> groups = user.GetGroups(); //TODO: Need to Cached into MT
                    string agsRoleName1 = "Cognos BI_NextGen_DealMgmt_DealMgmt_Report_User";
                    string agsRoleName2 = "Cognos BI_IDMS_NextGen_";
                    List<string> myList = new List<string>();
                    var results = groups.ToList().Where(s => s.Name.ToString().Contains(agsRoleName1) || s.Name.ToString().Contains(agsRoleName2)).Select(s => s).ToList();
                    if (results.Any())
                    {
                        isReportingUser = true;
                    }
                }
                else
                {
                    isReportingUser = true;
                }
            }            
            return isReportingUser;
        }
    }
}