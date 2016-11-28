using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class MyCustomerDetailsWrapper
    {
        public List<MyCustomersInformation> CustomerInfo { get; set; }
        public List<MyCustomersSoldTo> CustomerSoldTo { get; set; }
        public List<MyCustomersLineupAttributes> CustomerLineupAttributes { get; set; }
    }
}
