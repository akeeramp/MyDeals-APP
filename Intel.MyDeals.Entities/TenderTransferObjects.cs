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
    #endregion Tenders Deal Create/Update Generic Stage Packet

    #region Tenders Deal Create/Update Objects
    public class TenderTransferRootObject
    {
        public Header header { get; set; }
        public RecordDetails recordDetails { get; set; }

        public class Header
        {
            public string source_system { get; set; }
            public string target_system { get; set; }
            public string action { get; set; }
            public string xid { get; set; }
        }

        public class RecordDetails
        {
            public SBQQQuoteC SBQQ__Quote__c { get; set; }

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

                public class SBQQAccountC
                {
                    public string Id { get; set; }
                    public string Name { get; set; }
                    public string Core_CIM_ID__c { get; set; }
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
                }

                public class PricingCommentsC
                {
                    public string Id { get; set; }
                    public string Name { get; set; }
                    public string Pricing_Question__c { get; set; }
                    public string Pricing_Answer__c { get; set; }
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

}
