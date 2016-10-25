using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class CustomerDetailWrapper
    {
        public CustomerBaseDetails CustBaseDetails { get; set; }
        public List<CustomerDivisionData> CustDivisionData { get; set; }
        public List<CustomerDealTypesData> CustDealTypesData { get; set; }
        public List<CustomerIndustryKeyCodes> CustIndustryKeyCodes { get; set; }
        public List<CustomerCCPGroupCodes> CustCCPGroupCodes { get; set; }
        public List<CustomerSalesOrgPerDivision> CustomerSalesOrgPerDivisionData { get; set; }
        public List<CustomerDistinctSalesOrgCodes> CustSalesOrgCodes { get; set; }
        public List<CustomerCategoryDropdown> CustCategoryDropdownCodes { get; set; }
        public List<CustomerC2AAccounts> CustC2ACodes { get; set; }
        public List<CustomerGeosDropdown> CustGeosDropdownData { get; set; }
            
    }
}
