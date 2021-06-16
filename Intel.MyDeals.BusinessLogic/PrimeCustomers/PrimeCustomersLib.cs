using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using System;

namespace Intel.MyDeals.BusinessLogic
{
    public class PrimeCustomersLib : IPrimeCustomersLib
    {
        private readonly IPrimeCustomersDataLib _primeCustomersDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        private readonly IIntegrationLib _integrationLib;

        public PrimeCustomersLib()
        {
            _primeCustomersDataLib = new PrimeCustomersDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public PrimeCustomersLib(IPrimeCustomersDataLib primeCustomersDataLib, IDataCollectionsDataLib dataCollectionsDataLib, IIntegrationLib integrationLib)
        {
            _primeCustomersDataLib = primeCustomersDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
            _integrationLib = integrationLib;           
        }

        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            return _primeCustomersDataLib.GetPrimeCustomerDetails();
        }

        public PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data)
        {
            return _primeCustomersDataLib.ManagePrimeCustomers(mode, data);
        }

        public List<Countires> GetCountries()
        {
            return _primeCustomersDataLib.GetCountries();
        }

        public List<PrimeCustomers> GetPrimeCustomers()
        {
            return _primeCustomersDataLib.GetPrimeCustomers();
        }

        public List<UnPrimeDeals> GetUnPrimeDeals()
        {
            return _primeCustomersDataLib.GetUnPrimeDeals();
        }

        public List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry)
        {
            return _primeCustomersDataLib.GetEndCustomerData(endCustomerName, endCustomerCountry);
        }

        public bool UpdateUnPrimeDeals(int dealId, string primeCustomerName, string primeCustId, string primeCustomerCountry)
        {
            if (!string.IsNullOrEmpty(primeCustomerName) && !string.IsNullOrEmpty(primeCustomerCountry) )
            {
                if(primeCustomerName.ToLower()=="any" && primeCustomerCountry == "null")
                {
                    primeCustomerCountry = "";
                }
                List<int> dealIdlist = new List<int>() { dealId };
                MyDealsData mydealsdata = OpDataElementType.WIP_DEAL.GetByIDs(dealIdlist,
                new List<OpDataElementType>
                 {
                    OpDataElementType.WIP_DEAL,
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.CNTRCT
                    }).FillInHolesFromAtrbTemplate();

                int CntrctId = mydealsdata[OpDataElementType.CNTRCT].Data.Keys.FirstOrDefault();
                int custId = Int32.Parse(mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));
                             
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_PRIMED_CUST).AtrbValue = "1";
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_NM).AtrbValue = primeCustomerName;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_ID).AtrbValue = primeCustId;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY).AtrbValue = primeCustomerCountry;

                ContractToken saveContractToken = new ContractToken("ContractToken Created - Save Deal Updates")
                {
                    CustId = custId,
                    ContractId = CntrctId
                };


                mydealsdata[OpDataElementType.WIP_DEAL].AddSaveActions();
                List<int> possibleIds = mydealsdata[OpDataElementType.WIP_DEAL].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                mydealsdata[OpDataElementType.WIP_DEAL].AddSyncActions(null, possibleIds, DataCollections.GetAttributeData());
                mydealsdata.EnsureBatchIDs();


                SavePacket savePacket = new SavePacket
                {
                    MyContractToken = saveContractToken,
                    ValidateIds = dealIdlist,
                    ForcePublish = true,
                    SourceEvent = "WIP_DEAL",
                    ResetValidationChild = false
                };
                bool hasErrors = false;
                hasErrors = mydealsdata.ValidationApplyRules(savePacket);

                MyDealsData saveResponse = mydealsdata.Save(saveContractToken);

                if (saveResponse != null)
                {
                    _primeCustomersDataLib.sendMail(primeCustomerName, primeCustomerCountry, Int32.Parse(primeCustId), dealId);          
                    bool salesForceCheck = mydealsdata[OpDataElementType.CNTRCT].Data[CntrctId].GetDataElementValue(AttributeCodes.SALESFORCE_ID) != "" ? true : false;
                    if (salesForceCheck)
                    {
                        string saleForceId = mydealsdata[OpDataElementType.CNTRCT].Data[CntrctId].GetDataElementValue(AttributeCodes.SALESFORCE_ID);
                        _integrationLib.UpdateUnifiedEndCustomer(CntrctId, saleForceId, primeCustomerName, primeCustomerCountry);

                    }
                }

                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
