using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IPrimeCustomersDataLib
    {
        List<PrimeCustomers> GetPrimeCustomerDetails();

        PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data);

        List<Countires> GetCountries();

        List<PrimeCustomers> GetPrimeCustomers();

        List<UnPrimeDeals> GetUnPrimeDeals();

        List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry);

        bool UpdateUnPrimeDeals(int dealId, string primeCustomerName, string primeCustomerCountry);

        void sendMail(string primeCustomerName, string primeCustomerCountry, string primeCustID, int dealId);

        EndCustomerObject FetchEndCustomerMap(string endCustName, string endCustCountry);

        List<EndCustomer> ValidateEndCustomer(string endCustObj);

        List<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals);

        List<DealsUnificationValidationSummary> ValidateBulkUnifyDeals(List<UnifyDeal> unifyDeals);

        List<UnPrimedDealLogs> UnPrimeDealsLogs(int dealId, string endCustData);

        List<UCDRetry> RetryUCDRequest(bool retryFlag, string endCustomer, string endCustomerCtry);

        List<DealIdEcJsonDetails> SaveUcdRequestData(string endCustomerName, string primeCustomerCountry, int dealId, string request, string response, string accId, string status);

        List<RplStatusCode> GetRplStatusCodes();
    }
}
