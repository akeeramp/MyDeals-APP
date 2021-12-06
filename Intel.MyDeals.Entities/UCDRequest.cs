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
            public string RequesterName { get; set; }
            public string RequesterWWID { get; set; }
            public string RequesterEmail { get; set; }

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
            public string DuplicateAccountRecordType { get; set; }
            [JsonProperty("DuplicateAccountInfo")]
            public DuplicateAccountInfo duplicateAccountInfo { get; set; }
            public class DuplicateAccountInfo
            {
                public string SurvivorAccountId { get; set; }
                [JsonProperty("SecondaryAddress")]
                public SecondaryAddress secondaryAddress { get; set; }
                
                public class SecondaryAddress
                {
                    public string TypeCode { get; set; }

                    public string CountryName { get; set; }
                    public string CountryCode { get; set; }


                }
                public string RequestedAccountRejectionReason { get; set; }
                public string RequestedAccountRejectionNotes { get; set; }
                public string RecordType { get; set; } 
                [JsonProperty("PrimaryAddress")]
                public PrimaryAddress primaryAddress { get; set; }
                public class PrimaryAddress
                {
                    public string TypeCode { get; set; }
                    public string CountryName { get; set; }
                    public string CountryCode { get; set; }
                }
                [JsonProperty("ParentAccount")]
                public ParentAccount parentAccount { get; set; }
                public class ParentAccount
                {
                   
                    public string SurvivorAccountId { get; set; }
                    public string SecondaryAddress { get; set; }
                    public string RequestedAccountRejectionReason { get; set; }
                    public string RequestedAccountRejectionNotes { get; set; }
                    public string RecordType { get; set; }
                    public string PrimaryAddress { get; set; }
                    [JsonProperty("ParentAccount")]
                    public string parentAccount { get; set; }
                    public string MasteredSimplifiedAccountName { get; set; }
                    public string MasteredBusinessPhysicalAddress { get; set; }
                    public string CustomerProcessEngagement { get; set; }
                    public string CustomerAggregationType { get; set; }
                    public string ComplianceWatchList { get; set; }
                    public string BusinessPartyIdentifier { get; set; }
                    public string AccountName { get; set; }
                    public string AccountId { get; set; }

                }

                public string MasteredSimplifiedAccountName { get; set; }
                [JsonProperty("MasteredBusinessPhysicalAddress")]
                public MasteredBusinessPhysicalAddress masteredBusinessPhysicalAddress { get; set; }

                //public string MasteredSimplifiedAccountName { get; set; }
                public class MasteredBusinessPhysicalAddress
                {
                    public string CountryName { get; set; }
                    public string CountryCode { get; set; }
                }
                [JsonProperty("CustomerProcessEngagement")]
                public List<CustomerProcessEngagement> customerProcessEngagement { get; set; }
               
                public class CustomerProcessEngagement
                {
                    public string Name { get; set; }
                    public string Code { get; set; }
                }
                [JsonProperty("CustomerAggregationType")]
                public  CustomerAggregationType customerAggregationType { get; set; }
                public class CustomerAggregationType
                {
                    public string Name { get; set; }
                    public string Code { get; set; }
                }
                [JsonProperty("ComplianceWatchList")]
                public List<ComplianceWatchList> complianceWatchList { get; set; }
                public class ComplianceWatchList
                {
                    public string Name { get; set; }
                    public string Code { get; set; }
                }
                public string BusinessPartyIdentifier { get; set; }
                public string AccountName { get; set; }
                public string AccountId { get; set; }

            }
            public string DuplicateAccountId { get; set; }
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
        public PrimaryAddress primaryAddress { get; set; }
        public ParentAccount parentAccount { get; set; }
        public MasteredBusinessPhysicalAddress masteredBusinessPhysicalAddress { get; set; }
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
    public class DuplicateRequest
    {
        public string TransactionId { get; set; }
        [JsonProperty("BusinessOrganization")]

        public BusinessOrganization businessOrganization { get; set;}

        [JsonProperty("Attributes")]
        public List<Attributes> attributes { get; set; }

        public class BusinessOrganization
        {
            public List<string> AccountId { get; set; }
        }
        public class Attributes
        {
            public string AttributeName { get; set; }
        }

    }

    public class DuplicateAccResponse
    {
        public string Status { get; set; }
        public string InternalTxnID { get; set; }
        public string ExecutionTime { get; set; }
        [JsonProperty("Data")]
        public List<Data> data { get; set; }       

        public class Data
        {
            [JsonProperty("ParentAccountInfomation")]
            public ParentAccountInfomation parentAccountInfomation { get; set; }
            public string Id { get; set; }
            [JsonProperty("AccountMasteredDetails")]
            public AccountMasteredDetails accountMasteredDetails { get; set; }
            [JsonProperty("AccountInformation")]
            public AccountInformation accountInformation { get; set; }
            [JsonProperty("AccountComplianceDetails")]
            public List<AccountComplianceDetails> accountComplianceDetails { get; set; }
            [JsonProperty("AccountAddressInformation")]
            public List<AccountAddressInformation> accountAddressInformation { get; set; }
            public class ParentAccountInfomation { 

                public string BusinessPartyIdentifier { get; set; }
                public string AcocuntId { get; set; }
                public string AccountName { get; set; }

            }                      
            public class AccountMasteredDetails
            {

                public string SimplifiedAccountName { get; set; }
                public string BusinessPartyIdentifier { get; set; }
                [JsonProperty("Address")]
                public Address address { get; set; }
                public class Address
                {
                    public string CountryName { get; set; }
                    public string CountryCode { get; set; }

                }

            }
            

            public class AccountInformation
            {
                [JsonProperty("CustomerProcessEngagement")]
                public List<CustomerProcessEngagement> customerProcessEngagement { get; set; }
                [JsonProperty("CustomerAggregationType")]
                public CustomerAggregationType customerAggregationType { get; set; }
                public string BusinessPartyIdentifier { get; set; }
                public string AccountOwner { get; set; }
                public string AccountName { get; set; }
                public string AccountId { get; set; }
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
                               
            }

            public class AccountComplianceDetails
            {
               // public string Name { get; set; }
               // public string Code { get; set; }
            }           

            public class AccountAddressInformation
            {
                public string ZipCode { get; set; }
                public string Street { get; set; }
                public string StateName { get; set; }
                public string StateCode { get; set; }
                public string CountryName { get; set; }
                public string Countrycode { get; set; }
                public string City { get; set; }
                public string AddressType { get; set; }

            }
        }
    }
    }
