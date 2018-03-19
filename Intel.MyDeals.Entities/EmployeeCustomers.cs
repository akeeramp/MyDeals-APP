using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class EmployeeCustomers
    {
        public int empWWID { get; set; }
        public List<int> custIds { get; set; }
    }
}