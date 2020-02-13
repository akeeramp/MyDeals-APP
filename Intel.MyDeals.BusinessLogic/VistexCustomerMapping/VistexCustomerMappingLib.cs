using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexCustomerMappingLib : IVistexCustomerMappingLib
    {
        private readonly IVistexCustomerMappingDataLib _vistexCustomerMappingDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        /// <summary>
        /// Vistex Customer Mapping Lib
        /// </summary>
        /// <param name="vistexCustomerMappingDataLib"></param>
        /// <param name="dataCollectionsDataLib"></param>
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


        /// <summary>
        /// Get All Vistex Customer Mappings 
        /// </summary>
        /// <returns>List of Vistex Customer Mappings Data </returns>
        public List<VistexCustomerMapping> GetVistexCustomerMapping(bool getCachedResult = true)
        {
            return !getCachedResult ? _vistexCustomerMappingDataLib.GetVistexCustomerMappings() : _dataCollectionsDataLib.GetVistexCustomerMappings();

        }

        /// <summary>
        /// Save Is vistex customer flag Changes 
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public List<VistexCustomerMapping> SetVistexCustomerMapping(CrudModes mode, VistexCustomerMapping data)
        {
            return _vistexCustomerMappingDataLib.SetVistexCustomerMapping(mode, data);
        }


    }
}
