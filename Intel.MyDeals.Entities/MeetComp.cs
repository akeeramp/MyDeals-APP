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
        public bool IsInvalidIABenchAvailable { get; set; }
        public bool IsInvalidCompBenchAvailable { get; set; }
        public List<string> InValidCustomers { get; set; }
        public List<string> InValidProducts { get; set; }
        public List<string> ProductsRequiredBench { get; set; }
        public List<MeetComp> ValidatedMeetComps { get; set; }
    }

    public class MeetCompProductValidation
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public bool IsServerProduct { get; set; }
    }
}
