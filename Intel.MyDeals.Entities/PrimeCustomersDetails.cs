using System.Collections.Generic;



namespace Intel.MyDeals.Entities
{
    public partial class PrimeCustomersDetails
    {
        public List<PrimeCustomers> Items { get; set; }
        public int TotalRows { get; set; }
    }
}