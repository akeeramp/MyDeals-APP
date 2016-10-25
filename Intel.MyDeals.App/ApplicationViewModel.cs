using System;
using System.Collections.Generic;

namespace Intel.MyDeals.App
{
    public class ApplicationViewModel
    {
        public ApplicationViewModel()
        {
            StatusMsg = new List<string>();
            AppSettings = new List<ApplicationSetting>();
            UserMapping = new Dictionary<string, string>();
        }

        public string AppName;
        public string AppDescShort;
        public string AppDesc;
        public string AppEnv;
        public string AppVer;
        public DateTime AppCompileDate;
        public string AppCopy;
        public string AppCopyShort;
        public List<string> StatusMsg;
        public List<ApplicationSetting> AppSettings;
        public Dictionary<string, string> UserMapping;

        ////public Dictionary<string, CustomerQuarter> CustomerQuarters;
        ////public List<ToolConstants> Constants => new ConstantsLookupsLib().GetToolConstants();        
    }
}
