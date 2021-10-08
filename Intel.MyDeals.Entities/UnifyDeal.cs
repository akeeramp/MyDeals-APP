using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class UnifyDeal
    {
        public int DEAL_ID { get; set; }

        public int UCD_GLOBAL_ID { get; set; }

        public string UCD_GLOBAL_NAME { get; set; }

        public int UCD_COUNTRY_CUST_ID { get; set; }

        public string UCD_COUNTRY { get; set; }

        public string DEAL_END_CUSTOMER_RETAIL { get; set; }

        public string DEAL_END_CUSTOMER_COUNTRY { get; set; }
    }

    public class UnifyInvalidCombination
    {
        public int DEAL_ID { get; set; }

        public string DEAL_END_CUSTOMER_RETAIL { get; set; }

        public string DEAL_END_CUSTOMER_COUNTRY { get; set; }
    }

    public class UnifyDealValidation
    {
        public bool IsEmptyDealAvailable { get; set; }

        public bool IsEmptyCustIdAvailable { get; set; }

        public bool IsEmptyCustNameAvailable { get; set; }

        public bool IsEmptyCountryAvailable { get; set; }

        public bool IsEmptyCountryIdAvailable { get; set; }

        public List<UnifyDeal> ValidUnifyDeals { get; set; }

        public List<UnifyDeal> InValidUnifyDeals { get; set; }

        public List<string> InValidCountries { get; set; }

        public List<int> DuplicateDealCombination { get; set; }

        public List<int> DuplicateDealEntryCombination { get; set; }

        public List<int> DuplicateGlobalIds { get; set; }

        public List<string> DuplicateGlobalNames { get; set; }

        public bool IsDuplicateUcdCombinationavailable { get; set; }

        public List<UnifyInvalidCombination> UnifiedCombination { get; set; }

        public List<int> InvalidDeals { get; set; }

        public List<UnifyInvalidCombination> InValidCombination { get; set; }
    }
}
