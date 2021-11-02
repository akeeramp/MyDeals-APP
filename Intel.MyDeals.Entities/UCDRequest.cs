using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{

    public class UCDRequest
    {
        [JsonProperty("AccountRequests")]
        public List<AccountRequests> accountRequests { get; set; }
        public class AccountRequests
        {

            public string Name { get; set; }
            public string CustomerAggregationTypeCode { get; set; }
            public string CustomerProcessEngagmentCode { get; set; }
            [JsonProperty("Addresses")]
            public List<Addresses> addresses { get; set; }
            public class Addresses
            {
                public string CountryName { get; set; }
            }
        }
    }

    public class UCDResponse
    {
        public string status { get; set; }
        public string errormessage { get; set; }
        [JsonProperty("Data")]
        public Data data { get; set; }

        public string code { get; set; }

        public class Data
        {
            public string Name { get; set; }
            public string CountryName { get; set; }
            public string AccountStatus { get; set; }
            public string AccountId { get; set; }

        }

    }

    public class AMCResponce
    {
        public List<ComplianceWatchList> complianceWatchList { get; set; }
        public List<CustomerProcessEngagement> customerProcessEngagement { get; set; }
        public string RequestedAccountRejectionReason { get; set; }
        public string RequestedAccountRejectionNotes { get; set; }
        public string RecordType { get; set; }
        public class PrimaryAddress
        {
            public string TypeCode { get; set; }
            public string CountryName { get; set; }
            public string CountryCode { get; set; }
        }
        public class ParentAccount
        {
            public string BusinessPartyIdentifier { get; set; }
            public string AccountName { get; set; }
            public string AccountId { get; set; }
        }
        public string MasteredSimplifiedAccountName { get; set; }
        public class MasteredBusinessPhysicalAddress
        {
            public string CountryName { get; set; }
            public string CountryCode { get; set; }
        }
        public class CustomerProcessEngagement
        {
            public string Name { get; set; }
            public string Code { get; set; }
        }
        public class CustomerAggregationType
        {
            public string Name { get; set; }
            public string Code { get; set; }
        }
        public class ComplianceWatchList
        {
            public string Name { get; set; }
            public string Code { get; set; }
        }
        public string BusinessPartyIdentifier { get; set; }
        public string AccountName { get; set; }
        public string AccountId { get; set; }

    }
}
