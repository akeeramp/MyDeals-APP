using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexCustomerMappingLib :IVistexCustomerMappingDataLib
    {
        private readonly IVistexCustomerMappingDataLib _vistexCustomerMappingDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public VistexCustomerMappingLib(IVistexCustomerMappingDataLib vistexCustomerMappingDataLib,IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _vistexCustomerMappingDataLib = vistexCustomerMappingDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public VistexCustomerMappingLib()
        {
            _vistexCustomerMappingDataLib = new VistexCustomerMappingDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public List<VistexCustomerMapping> GetVistexCustomerMapping(bool getCachedResult = true)
        {
            return !getCachedResult ? _vistexCustomerMappingDataLib.GetVistexCustomerMappings() : _dataCollectionsDataLib.GetVistexCustomerMappings();
                
         }

        public List<VistexCustomerMapping> GetVistexCustomerMappings()
        {
            return GetVistexCustomerMapping().OrderBy(c => c.CUST_NM).ToList();
        }
    }
}
