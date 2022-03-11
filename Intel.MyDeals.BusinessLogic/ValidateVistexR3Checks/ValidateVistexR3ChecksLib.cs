using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class ValidateVistexR3ChecksLib : IValidateVistexR3ChecksLib
    {
        private readonly IValidateVistexR3ChecksDataLib _validateVistexR3ChecksDataLib;

        public ValidateVistexR3ChecksLib(IValidateVistexR3ChecksDataLib validateVistexR3ChecksDataLib)
        {
            _validateVistexR3ChecksDataLib = validateVistexR3ChecksDataLib;
        }

        public ValidateVistexR3Wrapper ValidateVistexR3Checks(PushValidateVistexR3Data data)
        {
            List<int> dealIds = new List<int>(System.Array.ConvertAll(data.DEAL_IDS.Split(','), int.Parse));
            string custName = data.CUST;
            int action = data.MODE;
            ValidateVistexR3Wrapper results = _validateVistexR3ChecksDataLib.ValidateVistexR3Check(dealIds, action, custName);
            return results;
        }
    }
}