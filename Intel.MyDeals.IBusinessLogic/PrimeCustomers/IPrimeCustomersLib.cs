using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPrimeCustomersLib
    {
        List<PrimeCustomers> GetPrimeCustomerDetails();

        PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data);

        List<Countires> GetCountries();

        List<PrimeCustomers> GetPrimeCustomers();

        List<UnPrimeDeals> GetUnPrimeDeals();

        List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry);

        bool UpdateUnPrimeDeals(int dealId, UnPrimeAtrbs endCustData);

        List<EndCustomer> ValidateEndCustomer(string endCustObj);

        List<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals);

        List<DealsUnificationValidationSummary> ValidateBulkUnifyDeals(List<UnifyDeal> unifyDeals);

        string UnPrimeDealsLogs(int dealId, string endCustData,bool isRetry=false);
        bool RetryUCDRequest();

        void saveAMQResponse(string amqResponse);
    }
}
