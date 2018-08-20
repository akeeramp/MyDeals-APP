using System;
using System.Configuration;

namespace Intel.MyDeals.Entities
{
    public class CLFLogItem
    {
        public string MachineAccount { get; set; }

        public string LogType { get; set; }

        public string LogCategory { get; set; }

        public string StepName { get; set; }

        public string StepDetail { get; set; }

        public string DBName { get; set; }

        public string SchemaName { get; set; }

        public string ServerMachineName { get; set; }

        public string ServerMachineIP { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string SessionId { get; set; }

        public CustomLog Custom { get; set; }
    }

    public class CustomLog
    {
        internal int str_MyDeals_Step;

        public string str_MyDeals_UserName { get; set; }

        public int int_MyDeals_RecordCount { get; set; }

        public int int_MyDeals_ThreadId { get; set; }

        public string str_MyDeals_Environment { get; set; }

        public DateTime str_MyDeals_LogDateTime { get; set; }

        public string str_MyDeals_RunTime { get; set; }
    }
}