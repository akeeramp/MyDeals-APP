using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ContractToken
    {
        public ContractToken()
        {
            NeedToCheckForDelete = true;
            CopyFromId = 0;
            CopyFromObjType = OpDataElementType.CNTRCT;
            TimeFlow = new List<TimeFlowItem>();
            stepCnt = 0;
            lastTimeFlowItem = DateTime.Now;
        }

        private int stepCnt;
        private DateTime lastTimeFlowItem;

        public int ContractId { get; set; }
        public int CustId { get; set; }
        public string CustAccpt { get; set; }
        public bool DeleteAllPTR { get; set; }
        public int CopyFromId { get; set; }
        public OpDataElementType CopyFromObjType { get; set; }
        public bool NeedToCheckForDelete { get; set; }
        public List<TimeFlowItem> TimeFlow { get; set; }

        public void AddTimeFlow(string title)
        {
            var now = DateTime.Now;
            TimeFlow.Add(new TimeFlowItem
            {
                StepNum = stepCnt++,
                StepTitle = title,
                MsTiming = (lastTimeFlowItem - now).TotalMilliseconds
            });
            lastTimeFlowItem = now;
        }

    }
}
