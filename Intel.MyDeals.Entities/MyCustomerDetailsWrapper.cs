using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class MyCustomerDetailsWrapper
    {
        public List<MyCustomersInformation> CustomerInfo { get; set; }
        //public List<MyCustomersSoldTo> CustomerSoldTo { get; set; }
    }

    public class MyVerticalDetailsWrapper
    {
        public List<VerticalSecurityItem> VerticalInfo { get; set; }
    }

    public class VistexCustomerMappingWrapper
    {
        public VistexCustomerMapping VistexCustomerInfo { get; set; }
        public string[] CustomerReportedGeos { get; set; }
    }
}
