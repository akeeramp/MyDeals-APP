namespace Intel.MyDeals.Entities
{
    public class ContractToken
    {
        public ContractToken()
        {
            NeedToCheckForDelete = true;
            CopyFromId = 0;
            CopyFromObjType = OpDataElementType.CNTRCT;
        }

        public int ContractId { get; set; }
        public int CustId { get; set; }
        public string CustAccpt { get; set; }
        public bool DeleteAllPTR { get; set; }
        public int CopyFromId { get; set; }
        public OpDataElementType CopyFromObjType { get; set; }
        public bool NeedToCheckForDelete { get; set; }
    }
}
