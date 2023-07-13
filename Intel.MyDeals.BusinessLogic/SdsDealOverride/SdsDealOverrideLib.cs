using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class SdsDealOverrideLib : ISdsDealOverrideLib
    {
        private readonly ISdsDealOverrideDataLib _sdsDealOverrideDataLib;
        /// <summary>
        /// Customer Library
        /// </summary>
        public SdsDealOverrideLib()
        {
            _sdsDealOverrideDataLib = new SdsDealOverrideDataLib();
        }

        /// <summary>
        /// Get SDS Deal Override Rules
        /// </summary>
        /// <returns>SDS Deal Override Rules</returns>
        public List<SdsDealOverride> GetSdsDealOverrideRules()
        {
            return _sdsDealOverrideDataLib.GetSdsDealOverrideRules();
        }

        public string SaveSdsDealOverride(string _mode, SdsDealOverride data)
        {
            return _sdsDealOverrideDataLib.SaveSdsDealOverride(_mode, data);
        }

        public string GetSdsOverrideReport(string _mode)
        {
            return _sdsDealOverrideDataLib.GetSdsOverrideReport(_mode);
        }

    }
}
