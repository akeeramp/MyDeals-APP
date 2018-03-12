using System.Collections.Generic;
using System.Linq;
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

        public OpMsg SetManageUserData(EmployeeCustomers data)
        {
            new EmployeeDataLib().SetManageUserData(data);
            return new OpMsg("Customers have been saved");
        }

    }
}