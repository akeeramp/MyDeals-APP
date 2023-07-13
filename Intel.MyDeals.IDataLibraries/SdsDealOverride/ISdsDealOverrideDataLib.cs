using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ISdsDealOverrideDataLib
    {
        List<SdsDealOverride> GetSdsDealOverrideRules();

        string SaveSdsDealOverride(string _mode, SdsDealOverride data);

        string GetSdsOverrideReport(string _mode);

    }
}


