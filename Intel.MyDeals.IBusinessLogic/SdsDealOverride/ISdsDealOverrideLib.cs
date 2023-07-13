using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{ 
    public interface ISdsDealOverrideLib
    {
        List<SdsDealOverride> GetSdsDealOverrideRules();

        string SaveSdsDealOverride(string _mode, SdsDealOverride data);

        string GetSdsOverrideReport(string _mode);

    }
}
