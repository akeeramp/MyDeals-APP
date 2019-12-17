using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.Employees;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class EmployeesLib : IEmployeesLib
    {
        public UserSetting GetUserSettings(OpUserToken opUserToken)
        {
            return new EmployeeDataLib().GetUserSettings(opUserToken);
        }

        public List<UsrProfileRole> GetUsrProfileRole()
        {
            return DataCollections.GetUsrProfileRole().Where(e => e.USR_ACTV_IND).OrderBy(e => e.LST_NM).ToList();
        }

        public List<UsrProfileRole> GetUsrProfileRoleByRoleCode(string[] strRoleCode)
        {
            return DataCollections.GetUsrProfileRole().Where(e => strRoleCode.Contains(e.ROLE_NM)).Distinct(new DistinctItemComparerUsrProfileRole()).OrderBy(x=>x.NAME).ToList();
        }

        public OpMsg SetOpUserToken(OpUserTokenParameters data)
        {
            new EmployeeDataLib().SetOpUserToken(data);
            return new OpMsg("Role has been set");
        }

        public List<ManageUsersInfo> GetManageUserData(int wwid)
        {
            //return new EmployeeDataLib().GetManageUserData(wwid).Where(e => e.ACTV_IND).OrderBy(e => e.LST_NM).ToList()
            return new EmployeeDataLib().GetManageUserData(wwid).ToList();
        }

        public List<CustomerDivision> GetManageUserDataGetCustomers()
        {
            return new CustomerLib().GetCustomerDivisions().Where(c => c.CUST_DIV_NM == c.CUST_NM).OrderBy(c => c.CUST_NM).ToList();
        }

        public List<CustomerDivision> GetManageUserDataGetCustomers(string geos)
        {
            // TODO: future clean up this should probably be moved to CustomerLib rather than be kept here in EmployeeLib

            // This is very hackish, but I didn't want to wreck any code that actually depended upon special division data for an admin screen,
            // so all customers is added on for this manage list to pre-pend "all customers" as a selection. Thank me now, shoot me later.  :)
            List<string> arGeos = geos.Split(',').ToList();
            CustomerDivision allCusts = new CustomerDivision
            {
                ACTV_IND = true,
                CUST_CAT = "",
                CUST_DIV_NM = "All Customers",
                CUST_DIV_NM_SID = 1,
                CUST_MBR_SID = 1,
                CUST_NM = "All Customers",
                CUST_NM_SID = 1,
                CUST_TYPE = "",
                HOSTED_GEO = "",
                PRC_GRP_CD = ""
            };
            List<CustomerDivision> customersList = new List<CustomerDivision>();
            customersList.Add(allCusts);
            customersList.AddRange(new CustomerLib().GetCustomerDivisions().Where(c => c.CUST_DIV_NM == c.CUST_NM && (arGeos.Contains("WW") || arGeos.Contains("Worldwide") || arGeos.Contains(c.HOSTED_GEO))).OrderBy(c => c.CUST_NM).ToList()); // 142
            return customersList;
            //if (geos.Contains("Worldwide"))
            //{
            //    return new CustomerLib().GetCustomerDivisions().Where(c => c.CUST_DIV_NM == c.CUST_NM).OrderBy(c => c.CUST_NM).ToList();
            //}
            //else // We are safe, it is all geos.  Cut the list down some.
            //{
            //    return new CustomerLib().GetCustomerDivisions().Where(c => c.CUST_DIV_NM == c.CUST_NM && geos.Contains(c.HOSTED_GEO)).OrderBy(c => c.CUST_NM).ToList();
            //}
        }

        public OpMsg SetManageUserData(EmployeeCustomers data)
        {
            new EmployeeDataLib().SetManageUserData(data);
            return new OpMsg("Customers have been saved");
        }

        public OpMsg ApplyForCustomers(EmployeeEmailCustomers data)
        {
            EmployeeHelpers.SendEmailMessageOfNewCustomers(data);
            new EmployeeDataLib().SetManageUserData(new EmployeeCustomers
            {
                empWWID = OpUserStack.MyOpUserToken.Usr.WWID,
                custIds = data.CustIds,
                vertIds = data.VertIds
            });
            return new OpMsg("Customers have been saved");
        }

        public OpMsg SetEmployeeVerticalData(EmployeeCustomers data)
        {
            new EmployeeDataLib().SetManageUserVerticalData(data);
            return new OpMsg("Verticals have been saved");
        }

    }

    class DistinctItemComparerUsrProfileRole : IEqualityComparer<UsrProfileRole>
    {
        public bool Equals(UsrProfileRole x, UsrProfileRole y)
        {
            //return x.EMP_WWID == y.EMP_WWID && x.EMAIL_ADDR == y.EMAIL_ADDR;
            return x.EMP_WWID == y.EMP_WWID;
        }

        public int GetHashCode(UsrProfileRole obj)
        {
            //return obj.EMP_WWID.GetHashCode() ^ obj.EMAIL_ADDR.GetHashCode();
            return obj.EMP_WWID.GetHashCode();
        }
    }
}