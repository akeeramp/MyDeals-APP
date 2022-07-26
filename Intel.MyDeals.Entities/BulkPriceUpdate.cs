using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class BulkPriceUpdateRecordsList
    {
        [JsonProperty("BulkPriceUpdateRecord")]
        public List<BulkPriceUpdateRecord> bulkPriceUpdateRecord { get; set; }

        public class BulkPriceUpdateRecord
        {
            public int DealId { get; set; }
            public string DealDesc { get; set; }
            public string EcapPrice { get; set; }
            public string Volume { get; set; }
            public string DealStartDate { get; set; }
            public string DealEndDate { get; set; }
            public string ProjectName { get; set; }
            public string BillingsStartDate { get; set; }
            public string BillingsEndDate { get; set; }
            public string AdditionalTermsAndConditions { get; set; }
            public string UpdateStatus { get; set; }
            public string DealStage { get; set; }
            public string ValidationMessages { get; set; }
        }
    }

    public class BulkPriceUpdateRecord
    {
        public int DealId { get; set; }
        public string DealDesc { get; set; }
        public string EcapPrice { get; set; }
        public string Volume { get; set; }
        public string DealStartDate { get; set; }
        public string DealEndDate { get; set; }
        public string ProjectName { get; set; }
        public string BillingsStartDate { get; set; }
        public string BillingsEndDate { get; set; }
        public string AdditionalTermsAndConditions { get; set; }
        public string UpdateStatus { get; set; }
        public string DealStage { get; set; }
        public string ValidationMessages { get; set; }
    }

}
