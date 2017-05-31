using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class CustomerLib : ICustomerLib
    {
        private readonly ICustomerDataLib _customerDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        /// <summary>
        /// Customer Library
        /// </summary>
        public CustomerLib(ICustomerDataLib customerDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _customerDataLib = customerDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public CustomerLib()
        {
            _customerDataLib = new CustomerDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        #region Customer Divisions

        /// <summary>
        /// Get All Customer Divisions
        /// </summary>
        /// <param name="getCachedResult">When set to false read
        /// request is coming from Admin screens by pass cached data
        /// </param>
        /// <returns>list of customer division data</returns>
        public List<CustomerDivision> GetCustomerDivisions(bool getCachedResult = true)
        {
            return !getCachedResult ? _customerDataLib.GetCustomerDivisions() : _dataCollectionsDataLib.GetCustomerDivisions();
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

        public List<CustomerDivision> GetCustomerDivisionsByCustNmId(int sid)
        {
            return GetCustomerDivisions().Where(c => c.CUST_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Active Customer Divisions
        /// </summary>
        /// <returns>list of customer division data flagged as active</returns>
        public List<CustomerDivision> GetCustomerDivisionsActive()
        {
            return GetCustomerDivisions().Where(c => c.ACTV_IND).ToList();
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

        public List<CustomerDivision> GetCustomerDivisionsByCustNmSid(int custNmSid)
        {
            return GetCustomerDivisions().Where(c => c.CUST_NM_SID == custNmSid).ToList();
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

        #endregion Customer Divisions

        #region MyCustomers

        /// <summary>
        /// Get All Customer Divisions that belong to requesting user
        /// </summary>
        /// <returns>lists of customer division data contained in wrapper</returns>
        public MyCustomerDetailsWrapper GetMyCustomers()
        {
            return _customerDataLib.GetMyCustomers();
        }


        public List<MyCustomersInformation> GetMyCustomerNames()
        {
            return _customerDataLib.GetMyCustomers().CustomerInfo.Where(c => c.CUST_LVL_SID == 2002).ToList();
        }

        public List<MyCustomersInformation> GetMyCustomerDivsByCustNmSid(int custNmSid)
        {
            return _customerDataLib.GetMyCustomers().CustomerInfo.Where(c => c.CUST_LVL_SID == 2003 && c.CUST_LVL_SID == custNmSid).ToList();
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

        #endregion MyCustomers
    }
}