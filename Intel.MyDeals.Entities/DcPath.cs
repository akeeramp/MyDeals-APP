namespace Intel.MyDeals.Entities
{
    public class DcPath
    {
        public DcPath()
        {
            Message = string.Empty;
        }

        public int ContractId { get; set; }
        public int PricingStrategyId { get; set; }
        public int PricingTableId { get; set; }
        public int PricingTableRowId { get; set; }
        public int WipDealId { get; set; }
        public int CustMbrSid { get; set; }
        public string Message { get; set; }
    }
}
