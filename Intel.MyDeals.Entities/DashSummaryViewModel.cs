using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class DashSummaryViewModel
    {
        private List<DashDealTypeSum> _dashDealTypeSums;
        public List<DashDealTypeSum> DashDealTypeSums
        {
            get { return _dashDealTypeSums; }
            set
            {
                if (Equals(_dashDealTypeSums, value)) return;
                _dashDealTypeSums = value;
            }
        }

        private List<DashStgSum> _dashStgSums;
        public List<DashStgSum> DashStgSums
        {
            get { return _dashStgSums; }
            set
            {
                if (_dashStgSums != null && _dashStgSums == value) return;
                _dashStgSums = value;
            }
        }

        private List<DashCustSum> _dashCustSums;
        public List<DashCustSum> DashCustSums
        {
            get { return _dashCustSums; }
            set
            {
                if (value != null && _dashCustSums == value) return;
                _dashCustSums = value;
            }
        }
        
    }
}