using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class ProductEpmObject
    {
        public int PrdGrpEpmId { get; set; }
        public int PcsrNbrSid { get; set; }
        public string EdwPcsrNbr { get; set; }
        public string MydlPcsrNbr { get; set; }
    }

    public class TenderTransferObject
    {
        public int RqstSid { get; set; }
        public int DealId { get; set; }
        public Guid BtchId { get; set; }
        public string RqstJsonData { get; set; }
        public string RqstSts { get; set; }
    }
    
    public class Header
    {
        public string source_system { get; set; }
        public string target_system { get; set; }
        public string action { get; set; }
        public string xid { get; set; }
    }

    public class SBQQAccountC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Core_CIM_ID__c { get; set; }
    }

    public class SBQQProductC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Core_Product_Name_EPM_ID__c { get; set; }
    }

    public class PricingCompetetorProductC
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class PricingPerformanceMetricC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Pricing_Performance_Metric_Nm__c { get; set; }
        public string Pricing_Intel_SKU_Performance_Nbr__c { get; set; }
        public string Pricing_Comp_SKU_Performance_Nbr__c { get; set; }
        public string Pricing_Weighting_Pct__c { get; set; }
    }

    public class SBQQQuoteLineC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Pricing_Deal_RFQ_Status_Nm__c { get; set; }
        public string Pricing_ECAP_Price__c { get; set; }
        public string Pricing_Meet_Comp_Price_Amt__c { get; set; }
        public string Pricing_Unit_Qty__c { get; set; }
        public string Pricing_Deal_RFQ_Id__c { get; set; }
        public string Pricing_Status_Nm__c { get; set; }
        public SBQQProductC SBQQ__Product__c { get; set; }
        public PricingCompetetorProductC Pricing_Competetor_Product__c { get; set; }
        public List<PricingPerformanceMetricC> Pricing_Performance_Metric__c { get; set; }
    }

    public class PricingCommentsC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Pricing_Question__c { get; set; }
        public string Pricing_Answer__c { get; set; }
    }

    public class SBQQQuoteC
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Pricing_Folio_ID_Nm__c { get; set; }
        public SBQQAccountC SBQQ__Account__c { get; set; }
        public string Pricing_Deal_Type_Nm__c { get; set; }
        public string Pricing_Customer_Nm__c { get; set; }
        public string Pricing_Project_Name_Nm__c { get; set; }
        public string Pricing_ShipmentStDate_Dt__c { get; set; }
        public string Pricing_ShipmentEndDate_Dt__c { get; set; }
        public string Pricing_Server_Deal_Type_Nm__c { get; set; }
        public string Pricing_Region_Nm__c { get; set; }
        public List<SBQQQuoteLineC> SBQQ__QuoteLine__c { get; set; }
        public List<PricingCommentsC> Pricing_Comments__c { get; set; }
    }

    public class RecordDetails
    {
        public SBQQQuoteC SBQQ__Quote__c { get; set; }
    }

    public class TenderTransferRootObject
    {
        public Header header { get; set; }
        public RecordDetails recordDetails { get; set; }
    }

}
