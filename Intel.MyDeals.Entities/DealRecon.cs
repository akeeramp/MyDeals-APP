using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class DealRecon
    {
        public int Deal_ID { get; set; }
        public int Unified_Customer_ID { get; set; }
        public string Unified_Customer_Name { get; set; }
        public int Country_Region_Customer_ID { get; set; }
        public string Unified_Country_Region { get; set; }
        public int To_be_Unified_Customer_ID { get; set; }
        public string To_be_Unified_Customer_Name { get; set; }
        public int To_be_Country_Region_Customer_ID { get; set; }
        public string To_be_Unified_Country_Region { get; set; }
        public string Rpl_Status_Code { get; set; }
    }

    public class DealReconValidationSummary
    {
        public List<DealRecon> validRecords { get; set; }

        public List<DealRecon> inValidRecords { get; set; }

        public List<string> invalidCountries { get; set; }

        public List<string> toBeInvalidCountries { get; set; }

        public List<int> duplicateDealCombination { get; set; }

        public List<int> duplicateCustIds { get; set; }

        public List<string> duplicateCustNames { get; set; }

        public List<CustomerCountryDetail> duplicateCtryIds { get; set; }

        public List<CustomerCountryDetail> duplicateCtryNms { get; set; }

        public List<int> duplicateToBeCustIds { get; set; }

        public List<string> duplicateToBeCustNames { get; set; }

        public List<CustomerCountryDetail> duplicateToBeCtryIds { get; set; }

        public List<CustomerCountryDetail> duplicateToBeCtryNms { get; set; }

        public List<string> invalidRplStatusCodes { get; set; }
    }
    public class CustomerCountryDetail
    {
        public int cust_Id { get; set; }
        public string cust_Nm { get; set; }
        public int ctry_Id { get; set; }
        public string ctry_Nm { get; set; }
    }
}
