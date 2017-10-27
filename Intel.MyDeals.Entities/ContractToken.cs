namespace Intel.MyDeals.Entities
{
    public class ContractToken
    {
        public ContractToken()
        {
            NeedToCheckForDelete = true;
        }

        public int ContractId { get; set; }
        public int CustId { get; set; }
        public string CustAccpt { get; set; }
        public bool DelPtr { get; set; }
        public bool NeedToCheckForDelete { get; set; }
    }
}
