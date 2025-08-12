using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPrimeCustomersLib
    {
        List<PrimeCustomers> GetPrimeCustomerDetails();
        PrimeCustomersDetails GetPrimeCustomerDetails(string filter, string sort, int take, int skip);

        PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data);

        List<Countires> GetCountries();

        List<PrimeCustomers> GetPrimeCustomers();
        [Obsolete("GetUnPrimeDeals() method doesn't have pagination feature, please use GetUnPrimeDeals(UnPrimeDealsFilter data) method instead.", false)]
        List<UnPrimeDeals> GetUnPrimeDeals();

        UnPrimeDealDetails GetUnPrimeDeals(UnPrimeDealsFilter data);

        List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry);

        bool UpdateUnPrimeDeals(int dealId, UnPrimeAtrbs endCustData, bool isUnificationMailRequired=true);

        List<EndCustomer> ValidateEndCustomer(string endCustObj);

        List<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals);

        List<DealsUnificationValidationSummary> ValidateBulkUnifyDeals(List<UnifyDeal> unifyDeals);
        
        string UnPrimeDealsLogs(string dealId, string endCustData,bool isRetry=false);
        
        bool RetryUCDRequest();

        void saveAMQResponse(string amqResponse);

        List<RplStatusCode> GetRplStatusCodes();

        List<DealReconInvalidRecords> updateDealRecon(List<DealRecon> lstDealRecon);

        string ResubmissionDeals(string dealId, string endCustomerData);

        string ReprocessUCD(string objReprocessUCD_OBJ);

        List<string> GetPrimeCustData(string fieldName);

    }
}
