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

        /// <summary>
        /// Get All Customer Divisions
        /// </summary>
        /// <returns>list of customer division data</returns>
        public List<CustomerDivision> GetCustomerDivisions()
        {
            return DataCollections.GetCustomerDivisions();
        }

        /// <summary>
        /// Get specific Customer Divisions
        /// </summary>
        /// <input>int sid of desired customer division</input>
        /// <returns>customer division data</returns>
        public CustomerDivision GetCustomerDivision(int sid)
        {
            return GetCustomerDivisions().FirstOrDefault(c => c.CUST_MBR_SID == sid);
        }

        /// <summary>
        /// Get All Active Customer Divisions
        /// </summary>
        /// <returns>list of customer division data flagged as active</returns>
        public List<CustomerDivision> GetCustomerDivisionsActive()
        {
            return GetCustomerDivisions().Where(c => c.ACTV_IND == true).ToList();
        }

        /// <summary>
        /// Get All Customer Divisions By Specified Type
        /// </summary>
        /// <input>string type which is what will be filtered against</input>
        /// <returns>list of customer division data of specified type</returns>
        public List<CustomerDivision> GetCustomerDivisionsByType(string type)
        {
            return GetCustomerDivisions().Where(c => c.CUST_TYPE == type).ToList();
        }

        /// <summary>
        /// Get All Customer Divisions By Specified Geo
        /// </summary>
        /// <input>string geo which is what will be filtered against</input>
        /// <returns>list of customer division data of specified geo</returns>
        public List<CustomerDivision> GetCustomerDivisionsByHostedGeo(string geo)
        {
            return GetCustomerDivisions().Where(c => c.HOSTED_GEO == geo).ToList();
        }

        /// <summary>
        /// Get All Customer Divisions By Specified Category
        /// </summary>
        /// <input>string cat which is what will be filtered against</input>
        /// <returns>list of customer division data of specified category</returns>
        public List<CustomerDivision> GetCustomerDivisionsByCategory(string cat)
        {
            return GetCustomerDivisions().Where(c => c.CUST_CAT == cat).ToList();
        }

        #endregion

        #region MyCustomers

        /// <summary>
        /// Get All Customer Divisions that belong to requesting user
        /// </summary>
        /// <returns>lists of customer division data contained in wrapper</returns>
        public MyCustomerDetailsWrapper GetMyCustomers()
        {
            return new CustomerDataLib().GetMyCustomers();
        }

        /// <summary>
        /// Get Customer Information that belongs to requesting user
        /// </summary>
        /// <returns>list of customer information data</returns>
        public List<MyCustomersInformation> GetMyCustomersInfo()
        {
            return GetMyCustomers().CustomerInfo;
        }

        /// <summary>
        /// Get Customer Sold To data that belongs to requesting user
        /// </summary>
        /// <returns>list of customer sold to data</returns>
        public List<MyCustomersSoldTo> GetMyCustomersSoldTo()
        {
            return GetMyCustomers().CustomerSoldTo;
        }

        #endregion
    }
}
