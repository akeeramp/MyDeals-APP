namespace Intel.MyDeals.Entities
{
    public class DcPath
    {
        public DcPath()
        {
            Message = string.Empty;
        }

        public int ContractId { get; set; }
        public string ContractTitle { get; set; }
        public int PricingStrategyId { get; set; }
        public string PricingStrategyTitle { get; set; }
        public int PricingTableId { get; set; }
        public string PricingTableTitle { get; set; }
        public int PricingTableRowId { get; set; }
        public int WipDealId { get; set; }
        public int CustMbrSid { get; set; }
        public string Message { get; set; }
    }
}
