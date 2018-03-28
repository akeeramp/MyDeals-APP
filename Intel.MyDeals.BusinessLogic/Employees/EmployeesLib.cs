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

        public List<CustomerDivision> GetManageUserDataGetCustomers(List<string> geos)
        {
            return new CustomerLib().GetCustomerDivisions().Where(c => c.CUST_DIV_NM == c.CUST_NM && (geos.Contains("Worldwide") || geos.Contains(c.HOSTED_GEO))).OrderBy(c => c.CUST_NM).ToList();
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
                custIds = data.CustIds
            });
            return new OpMsg("Customers have been saved");
        }

    }
}