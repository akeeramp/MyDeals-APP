using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    // VISTEX Objects
    #region Vistex Deals Send Packet Object
    public class VistexSendDealsObj
    {
        public string SourceSystem { get; set; }
        public string TargetSystem { get; set; }
        public string Action { get; set; }
        public string BatchId { get; set; }
        public List<DealResponse> DealResponses { get; set; }

        public class DealResponse
        {
            public int DealId { get; set; }
            public string ErrMessage { get; set; }
        }
    }

    public class VistexQueueObject
    {
        public int DealId { get; set; }
        public Guid BatchId { get; set; }
        public string RqstJsonData { get; set; }
    }

    public class VistexDFDataLoadObject // Customers and Products
    {
        public int BatchId { get; set; }
        public string JsonData { get; set; }
    }

    public class VistexDealsDataLoadObject // Customers and Products
    {
        public string SourceSystem { get; set; }
        public string TargetSystem { get; set; }
        public string Action { get; set; }
        public Guid BatchId { get; set; }
        public string DealObjectsJson { get; set; }
    }

    public class VistexDFResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
    }

    public class VistexDFDataResponseObject // Customers and Products
    {
        public string RunMode { get; set; }
        public string BatchId { get; set; }
        public string BatchMessage { get; set; }
        public string BatchName { get; set; }
        public string BatchStatus { get; set; }
        public List<string> MessageLog { get; set; }
    }

    public class VistexSendVertical
    {
        public List<VerticalData> ProductVertical { get; set; }

        public class VerticalData
        {
            public string GDM_PRD_TYPE_NM { get; set; }
            public string GDM_VRT_NM { get; set; }
            public string OPR_BUSNS_UN_CD { get; set; }
            public DateTime VALID_TO { get; set; }
            public string DIV_SHRT_NM { get; set; }
            public string DEAL_PRD_TYPE_NM { get; set; }
            public string DEAL_VRT_NM { get; set; }
            public string ACTIVE_IND { get; set; }
        }
    }
    #endregion Vistex Deals Send Packet Object

    #region Vistex Response Object - Vistex sending us response for what we sent them
    public class VistexResponseMsg
    {
        public VistexResponseHeader vistexResponseHeader { get; set; }

        public class VistexResponseHeader
        {
            public string SourceSystem { get; set; }
            public string TargetSystem { get; set; }
            public string Action { get; set; }
            public string BatchId { get; set; }

            [JsonConverter(typeof(SingleOrListConverter<DealResponse>))]
            public List<DealResponse> DealResponses { get; set; }
            public class DealResponse
            {
                public int DealId { get; set; }
                public string ErrMessage { get; set; }
                public string Status { get; set; }
                public int AgreementId { get; set; }
                public string DealType { get; set; }
            }
        }

        /// <summary>
        /// This method converts Single object to List during deserialization
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public class SingleOrListConverter<T> : JsonConverter
        {
            public override bool CanConvert(Type objectType)
            {
                return (objectType == typeof(List<T>));
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                JToken token = JToken.Load(reader);
                if (token.Type == JTokenType.Array)
                {
                    return token.ToObject<List<T>>();
                }
                return new List<T> { token.ToObject<T>() };
            }

            public override bool CanWrite
            {
                get { return false; }
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                throw new NotImplementedException();
            }
        }
    }
    #endregion Vistex Response Object

    #region Vistex Product Mapping Object - Us sending Vistex mapping items for Products
    public class RootObject
    {
        public SendProductVerticalPacket sendProductVerticalPacket { get; set; }

        public class SendProductVerticalPacket
        {
            public string SendType { get; set; }
            public string SendDate { get; set; }
            public List<ProdVerticalRule> ProdVerticalRules { get; set; }

            public class ProdVerticalRule
            {
                public string PRD_CAT_MAP_SID { get; set; }
                public string GDM_PRD_TYPE_NM { get; set; }
                public string GDM_VRT_NM { get; set; }
                public string OP_CD { get; set; }
                public string DIV_NM { get; set; }
                public string ACTV_IND { get; set; }
            }
        }
    }
    #endregion Vistex Product Mapping Object

    // Mahesh JSON objects (TENDERS)

    #region Tenders Deal Create/Update Generic Stage Packet
    public class TenderTransferObject
    {
        public int RqstSid { get; set; }
        public int DealId { get; set; }
        public Guid BtchId { get; set; }
        public string RqstJsonData { get; set; }
        public string RqstSts { get; set; }
    }

    public class SfApiGeeResponseObj
    {
        public string TotalRecords { get; set; }

        [JsonConverter(typeof(SingleOrListConverter<SuccessContent>))]
        public List<SuccessContent> successContent { get; set; }
        public string IsSuccess { get; set; }
        public string ErrorContent { get; set; }
        public string Code { get; set; }

        public class SuccessContent
        {
            public string Name { get; set; }
        }

        public class SingleOrListConverter<T> : JsonConverter
        {
            public override bool CanConvert(Type objectType)
            {
                return (objectType == typeof(List<T>));
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                JToken token = JToken.Load(reader);
                if (token.Type == JTokenType.Array)
                {
                    return token.ToObject<List<T>>();
                }
                return new List<T> { token.ToObject<T>() };
            }

            public override bool CanWrite
            {
                get { return false; }
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                throw new NotImplementedException();
            }
        }

    }
    #endregion Tenders Deal Create/Update Generic Stage Packet

    #region Tenders Deal Create/Update Objects
    public class TenderTransferRootObject
    {
        [JsonProperty("Header")]
        public Header header { get; set; }

        [JsonProperty("RecordDetails")]
        public RecordDetails recordDetails { get; set; }

        public class Header
        {
            public string xid { get; set; }
            public string target_system { get; set; }
            public string source_system { get; set; }
            public string action { get; set; }
        }

        public class RecordDetails
        {
            [JsonProperty("Quote")]
            public Quote quote { get; set; }

            public class Quote
            {
                public string Id { get; set; }
                public string FolioID { get; set; }
                public string Name { get; set; }
                public string FolioName { get; set; }
                public string ProjectName { get; set; }
                public string DealType { get; set; }
                public string EndCustomer { get; set; }
                public string EndCustomerCountry { get; set; }
                public string UnifiedEndCustomer { get; set; }
                public string UnifiedEndCustomerId { get; set; }
                public string UnifiedCountryEndCustomerId { get; set; }
                public bool IsUnifiedEndCustomer { get; set; }
                [JsonProperty("Account")]
                public Account account { get; set; }
                public string ShipmentStartDate { get; set; }
                public string ShipmentEndDate { get; set; }
                public string ServerDealType { get; set; }

                [JsonProperty("QuoteLine")]
                public List<QuoteLine> quoteLine { get; set; }

                public class Account
                {
                    public string Id { get; set; }
                    public string Name { get; set; }
                    public string CIMId { get; set; }
                }

                public class QuoteLine
                {
                    public string Id { get; set; }
                    public string Name { get; set; }
                    public string ReferenceQuoteLineNumber { get; set; }
                    public string Status { get; set; }
                    public string IntegrationStatus { get; set; }
                    public string EffectivePricingStartDate { get; set; }
                    public string Wwid { get; set; }
                    public string QuoteLineNumber { get; set; }
                    public string Region { get; set; }
                    public string EndCustomerRegion { get; set; }
                    public string DealDescription { get; set; }
                    public string GroupType { get; set; }
                    public string MarketSegment { get; set; }
                    [JsonProperty("Product")]
                    public Product product { get; set; }
                    [JsonProperty("CompetitorProduct")]
                    public CompetitorProduct competitorProduct { get; set; }
                    public string OtherProduct { get; set; }
                    public string MeetCompPrice { get; set; }
                    public string ApprovedStartDate { get; set; }
                    public string ApprovedEndDate { get; set; }
                    public string BackdateReason { get; set; }
                    public string BillingStartDate { get; set; }
                    public string BillingEndDate { get; set; }
                    public string ApprovedQuantity { get; set; }
                    public string ApprovedECAPPrice { get; set; }
                    public string AdditionalTandC { get; set; }
                    public bool ExcludeAutomation { get; set; }
                    public string DealRFQStatus { get; set; }
                    public string DealRFQId { get; set; }
                    [JsonProperty("PerformanceMetric")]
                    public List<PerformanceMetric> performanceMetric { get; set; }
                    public string ApprovedByInfo { get; set; }
                    [JsonProperty("ErrorMessages")]
                    public List<ErrorMessages> errorMessages { get; set; }

                    public class ErrorMessages
                    {
                        public int Code { get; set; }
                        public string Message { get; set; }
                        public string MessageDetails { get; set; }
                    }

                    public class Product
                    {
                        public string Id { get; set; }
                        public string Name { get; set; }
                        public string ProductNameEPMID { get; set; }
                    }

                    public class CompetitorProduct
                    {
                        public string Id { get; set; }
                        public string Name { get; set; }
                    }

                    public class PerformanceMetric
                    {
                        public string Id { get; set; }
                        public string Name { get; set; }
                        public string performanceMetric { get; set; }
                        public string IntelSKUPerformance { get; set; }
                        public string CompSKUPerformance { get; set; }
                        public string Weighting { get; set; }
                    }
                }
            }
        }
    }
    #endregion Tenders Deal Create/Update Objects

    #region Tenders Deal Stage Update Objects
    public class TenderTransferStageRoot
    {
        public Header header { get; set; }
        public RecordDetails recordDetails { get; set; }

        public class Header
        {
            public string source_system { get; set; }
            public string target_system { get; set; }
            public string action { get; set; }
            public string xid { get; set; }
            public string ErrorMessage { get; set; }
        }

        public class RecordDetails
        {
            public SBQQQuoteC SBQQ__Quote__c { get; set; }

            public class SBQQQuoteC
            {
                public string Id { get; set; }
                public string Name { get; set; }
                public string Pricing_Folio_ID_Nm__c { get; set; } // My Deals Contract ID number
                public List<SBQQQuoteLineC> SBQQ__QuoteLine__c { get; set; }

                public class SBQQQuoteLineC
                {
                    public string Id { get; set; }
                    public string Name { get; set; }
                    public string Pricing_Deal_RFQ_Id__c { get; set; } // My Deals Deal ID number
                    public string Pricing_Integration_Status_Nm__c { get; set; } // My Deals response - Success for Failure
                    public string Pricing_Status_Nm__c { get; set; } // Tenders Sent Deal Move-to Stage
                    public string Pricing_Deal_RFQ_Status_Nm__c { get; set; } // My Deals response - Present Deal Stage
                }
            }
        }
    }
    #endregion Tenders Deal Stage Update Objects

    #region Tenders XID and other Search Objects
    public class TenderXidObject
    {
        public int dealId { get; set; }
        public Guid btchGuid { get; set; }

    }

    public class TenderCapRequestObject
    {
        public string CustomerCIMId { get; set; }
        public string ProductNameEPMID { get; set; }
        public string RangeStartDate { get; set; }
        public string RangeEndDate { get; set; }
        public string Region { get; set; }
    }
    #endregion Tenders XID and other Search Objects

    // Support Objects

    #region Vistex/Tenders Support Classes
    public class ProductEpmObject
    {
        public int PrdGrpEpmId { get; set; }
        public int PcsrNbrSid { get; set; }
        public string EdwPcsrNbr { get; set; }
        public string MydlPcsrNbr { get; set; }
    }
    #endregion Tenders Common Message Classes

    #region End Customer Support Classes
    public class EndCustomerObject
    {
        public string UnifiedEndCustomer { get; set; }
        public int UnifiedEndCustomerId { get; set; }
        public int UnifiedCountryEndCustomerId { get; set; }
        public int IsUnifiedEndCustomer { get; set; }

    }
    #endregion End Customer Support Classes


}
