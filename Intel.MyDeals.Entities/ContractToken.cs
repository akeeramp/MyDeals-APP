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
            _stepCnt = 0;
            _lastTimeFlowItem = DateTime.Now;
            AddTimeFlow("ContractToken Created", TimeFlowMedia.MT);
        }
        public ContractToken(string msg, TimeFlowMedia media = TimeFlowMedia.MT)
        {
            NeedToCheckForDelete = true;
            CopyFromId = 0;
            CopyFromObjType = OpDataElementType.CNTRCT;
            TimeFlow = new List<TimeFlowItem>();
            _stepCnt = 0;
            _lastTimeFlowItem = DateTime.Now;
            _lapTimeFlowItem = null;
            AddTimeFlow(msg, media);
        }

        private int _stepCnt;
        private DateTime _lastTimeFlowItem;
        private DateTime? _lapTimeFlowItem;

        public int ContractId { get; set; }
        public int CustId { get; set; }
        public string CustAccpt { get; set; }
        public bool DeleteAllPTR { get; set; }
        public int CopyFromId { get; set; }
        public OpDataElementType CopyFromObjType { get; set; }
        public bool NeedToCheckForDelete { get; set; }
        public List<TimeFlowItem> TimeFlow { get; set; }

        public void MarkTimeFlow()
        {
            _lapTimeFlowItem = DateTime.Now;
        }

        public void AddTimeFlow(string title, TimeFlowMedia media, string details = null)
        {
            var now = DateTime.Now;
            TimeFlow.Add(new TimeFlowItem
            {
                StepNum = _stepCnt++,
                StepTitle = title,
                Media = media,
                MsLapseTiming = (now - _lastTimeFlowItem).TotalMilliseconds,
                MsExecutionTiming = _lapTimeFlowItem == null ? 0 : (now - (DateTime)_lapTimeFlowItem).TotalMilliseconds,
                Details = details ?? ""
            });
            _lastTimeFlowItem = now;
            _lapTimeFlowItem = null;
        }

    }
}
