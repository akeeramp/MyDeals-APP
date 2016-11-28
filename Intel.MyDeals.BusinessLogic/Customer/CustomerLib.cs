using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.BusinesssLogic
{
    public class CustomerLib
    {
        #region Customer Divisions
        public List<CustomerDivision> GetCustomerDivisions()
        {
            return DataCollections.GetCustomerDivisions();
        }

        public CustomerDivision GetCustomerDivision(int sid)
        {
            return GetCustomerDivisions().FirstOrDefault(c => c.CUST_MBR_SID == sid);
        }

        public List<CustomerDivision> GetCustomerDivisionsActive()
        {
            return GetCustomerDivisions().Where(c => c.ACTV_IND == true).ToList();
        }
        
        public List<CustomerDivision> GetCustomerDivisionsByType(string type)
        {
            return GetCustomerDivisions().Where(c => c.CUST_TYPE == type).ToList();
        }

        public List<CustomerDivision> GetCustomerDivisionsByHostedGeo(string geo)
        {
            return GetCustomerDivisions().Where(c => c.HOSTED_GEO == geo).ToList();
        }

        public List<CustomerDivision> GetCustomerDivisionsByCategory(string cat)
        {
            return GetCustomerDivisions().Where(c => c.CUST_CAT == cat).ToList();
        }

        #endregion

        #region MyCustomers
        public MyCustomerDetailsWrapper GetMyCustomers()
        {
            return DataCollections.GetMyCustomers();
        }
        public List<MyCustomersInformation> GetMyCustomersInfo()
        {
            return GetMyCustomers().CustomerInfo;
        }

        public List<MyCustomersSoldTo> GetMyCustomersSoldTo()
        {
            return GetMyCustomers().CustomerSoldTo;
        }

        public List<MyCustomersLineupAttributes> GetMyCustomersLineupAttributes()
        {
            return GetMyCustomers().CustomerLineupAttributes;
        }

        #endregion
    }
}
