using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.DataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class DealMassUpdateLib : IDealMassUpdateLib
    {
        private readonly IDealMassUpdateDataLib _dealMassUpdateDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public DealMassUpdateLib(IDealMassUpdateDataLib dealMassUpdateDataLib,IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _dealMassUpdateDataLib = dealMassUpdateDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public DealMassUpdateLib()
        {
            _dealMassUpdateDataLib = new DealMassUpdateDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }
        public List<DealMassUpdateResults> UpdateMassDealAttributes(DealMassUpdateData data)
        {
            List<DealMassUpdateResults> lstResults = _dealMassUpdateDataLib.UpdateMassDealAttributes(data);
            return lstResults;
        }

        public List<AttributeFeildvalues> GetAttributeValues(int atrb_sid)
        {
            List<AttributeFeildvalues> results = _dealMassUpdateDataLib.GetAttributeValues(atrb_sid);
            return results;
        }
    }
}
