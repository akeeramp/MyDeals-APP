using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class DataFixLib : IDataFixLib
    {
        private readonly IDataFixDataLib _dataFixDataLib;

        public DataFixLib(IDataFixDataLib dataFixDataLib)
        {
            _dataFixDataLib = dataFixDataLib;
        }

        public List<DropDowns> GetDataFixActions()
        {
            return _dataFixDataLib.GetDataFixActions();
        }

        public List<DataFix> GetDataFixes()
        {
            return _dataFixDataLib.GetDataFixes();
        }

        public DataFix UpdateDataFix(DataFix data)
        {
            return _dataFixDataLib.UpdateDataFix(data);
        }
    }
}
