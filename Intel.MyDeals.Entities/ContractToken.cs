namespace Intel.MyDeals.Entities
{
    public class ContractToken
    {
        public ContractToken()
        {
            NeedToCheckForDelete = true;
            CopyFromContractId = 0;
        }

        public int ContractId { get; set; }
        public int CustId { get; set; }
        public string CustAccpt { get; set; }
        public bool DelPtr { get; set; }
        public int CopyFromContractId { get; set; }
        public bool NeedToCheckForDelete { get; set; }
    }
}
