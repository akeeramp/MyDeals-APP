using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class MeetCompValidation
    {
        public bool HasInvalidMeetComp { get; set; }
        public bool IsEmptyCustomerAvailable { get; set; }
        public bool IsEmptyProductAvailable { get; set; }
        public bool IsEmptyMeetCompSkuAvailable { get; set; }
        public bool IsEmptyMeetCompPriceAvailable { get; set; }
        public List<string> InValidCustomers { get; set; }
        public List<string> InValidProducts { get; set; }
        public List<MeetComp> DistinctMeetComps { get; set; }
    }
}
