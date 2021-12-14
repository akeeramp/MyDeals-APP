using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using System;
using Newtonsoft.Json;
using Intel.Opaque;
using System.Configuration;
using System.IO;

namespace Intel.MyDeals.BusinessLogic
{
    public class PrimeCustomersLib : IPrimeCustomersLib
    {
        private readonly IPrimeCustomersDataLib _primeCustomersDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        private readonly IIntegrationLib _integrationLib;

        private readonly IJmsDataLib _jmsDataLib;

        public PrimeCustomersLib()
        {
            _primeCustomersDataLib = new PrimeCustomersDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public PrimeCustomersLib(IPrimeCustomersDataLib primeCustomersDataLib, IDataCollectionsDataLib dataCollectionsDataLib, IIntegrationLib integrationLib, IJmsDataLib jmsDataLib)
        {
            _primeCustomersDataLib = primeCustomersDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
            _integrationLib = integrationLib;
            _jmsDataLib = jmsDataLib;
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

        public bool UpdateUnPrimeDeals(int dealId , UnPrimeAtrbs endCustData)
        {
            if (!string.IsNullOrEmpty(endCustData.PRIMED_CUST_NM) && !string.IsNullOrEmpty(endCustData.PRIMED_CUST_CNTRY))
            {
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

                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_PRIMED_CUST).AtrbValue = endCustData.IS_PRIMED_CUST;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_RPL).AtrbValue = endCustData.IS_RPL;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_NM).AtrbValue = endCustData.PRIMED_CUST_NM;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_ID).AtrbValue = endCustData.PRIMED_CUST_ID;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY).AtrbValue = endCustData.PRIMED_CUST_CNTRY;
                mydealsdata[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_CUST_OBJ).AtrbValue = endCustData.END_CUST_OBJ;

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

                if (saveResponse != null && endCustData.IS_PRIMED_CUST == "1")
                {
                    _primeCustomersDataLib.sendMail(endCustData.PRIMED_CUST_NM, endCustData.PRIMED_CUST_CNTRY, endCustData.PRIMED_CUST_ID, dealId);
                    bool salesForceCheck = mydealsdata[OpDataElementType.CNTRCT].Data[CntrctId].GetDataElementValue(AttributeCodes.SALESFORCE_ID) != "" ? true : false;
                    if (salesForceCheck)
                    {
                        string saleForceId = mydealsdata[OpDataElementType.CNTRCT].Data[CntrctId].GetDataElementValue(AttributeCodes.SALESFORCE_ID);
                        _integrationLib.UpdateUnifiedEndCustomer(CntrctId, saleForceId, endCustData.PRIMED_CUST_NM, endCustData.PRIMED_CUST_CNTRY);

                    }
                }


                return true;
            }
            else
            {
                return false;
            }
        }

        public List<EndCustomer> ValidateEndCustomer(string endCustObj)
        {
            return _primeCustomersDataLib.ValidateEndCustomer(endCustObj);
        }

        public List<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals)
        {
            return _primeCustomersDataLib.UploadBulkUnifyDeals(unifyDeals);
        }

        public List<DealsUnificationValidationSummary> ValidateBulkUnifyDeals(List<UnifyDeal> unifyDeals)
        {
            return _primeCustomersDataLib.ValidateBulkUnifyDeals(unifyDeals);
        }


        public bool RetryUCDRequest()
        {
            var res = false;
            //call to get the API_processing_Error records in UCD log table
            List<UCDRetry> response = _primeCustomersDataLib.RetryUCDRequest(false,null,null);
            if (response.Count > 0)
            {
                foreach (UCDRetry data in response)
                {
                    if(data.end_cust_obj!="" && data.obj_sid != 0)
                    {
                        UnPrimeDealsLogs(data.obj_sid, data.end_cust_obj,true);
                        res = true;
                    }
                }
            }
            return res;
        }
        public string UnPrimeDealsLogs(int dealId, string endCustData,bool isRetry=false)
        {
            string success = "false";
            string isEndCustRecordUnified = "No";
            int responseCount = 0;
            int requestCount = 0;
            List<UCDResponse> ucdResponse = new List<UCDResponse>();
            List<UnPrimedDealLogs> result = new List<UnPrimedDealLogs>();
            int batchSize = int.Parse(ConfigurationManager.AppSettings["acmBatchSize"]);
            try
            {


                result = _primeCustomersDataLib.UnPrimeDealsLogs(dealId, endCustData);
                requestCount = result.Count;
                while (result.Any())
                {
                    var batch = result.Take(batchSize);
                    result = result.Skip(batchSize).ToList();

                    var UCDReqDataList = new UCDRequest
                    {
                        accountRequests = new List<UCDRequest.AccountRequests>()
                    };


                    foreach (UnPrimedDealLogs Customer in batch)
                    {
                        var UCDReqData = new UCDRequest.AccountRequests
                        {
                            addresses = new List<UCDRequest.AccountRequests.Addresses>()
                        };
                        List<string> County = new List<string>();
                        County.Add(Customer.PRIMED_CUST_CNTRY);
                        UCDReqData.Name = Customer.END_CUSTOMER_RETAIL;
                        UCDReqData.CustomerAggregationTypeCode = "UNFD_CTRY_CUST";
                        UCDReqData.CustomerProcessEngagmentCode = "DIR_PRC_EXCPT";
                        UCDReqData.RequesterName = OpUserStack.MyOpUserToken.Usr.FullName;
                        UCDReqData.RequesterWWID = OpUserStack.MyOpUserToken.Usr.WWID.ToString();
                        UCDReqData.RequesterEmail = OpUserStack.MyOpUserToken.Usr.Email;
                        var newAddressess = new UCDRequest.AccountRequests.Addresses
                        {

                            CountryName = Customer.PRIMED_CUST_CNTRY
                        };

                        UCDReqData.addresses.Add(newAddressess);

                        UCDReqDataList.accountRequests.Add(UCDReqData);
                        String UCDJson = JsonConvert.SerializeObject(UCDReqData);

                        if ((Customer.END_CUSTOMER_RETAIL != null && Customer.END_CUSTOMER_RETAIL != "") &&
                            (Customer.PRIMED_CUST_CNTRY != null && Customer.PRIMED_CUST_CNTRY != "") && dealId != 0)
                        {
                            //In the case of Retry API request,below line of code is to update retry count for the re-tried End customer-country record
                            if (isRetry)
                            {
                                _primeCustomersDataLib.RetryUCDRequest(isRetry, Customer.END_CUSTOMER_RETAIL, Customer.PRIMED_CUST_CNTRY);
                            }
                            _primeCustomersDataLib.SaveUcdRequestData(Customer.END_CUSTOMER_RETAIL, Customer.PRIMED_CUST_CNTRY,
                               dealId, UCDJson, null, null, "API_Request_Sent");
                        }
                        else
                        {
                            OpLogPerf.Log("UCD - Error in saving AMQ request ");
                        }

                    }


                    String UCDReqJson = JsonConvert.SerializeObject(UCDReqDataList);
                    var tempFolder = ConfigurationManager.AppSettings["ucdLogPath"];
                    tempFolder = Path.Combine(tempFolder, "UCD Requests");
                    if (!Directory.Exists(tempFolder))
                    {
                        Directory.CreateDirectory(tempFolder);
                    }
                    FileStream objFilestream = new FileStream(string.Format("{0}\\{1}", tempFolder, "UCD Request_" + dealId + "_" + DateTime.Now.ToString("dd-MM-yyyy-HHmmssfff")), FileMode.Append, FileAccess.Write);
                    StreamWriter objStreamWriter = new StreamWriter((Stream)objFilestream);
                    objStreamWriter.WriteLine(UCDReqJson);
                    objStreamWriter.Close();
                    objFilestream.Close();

                    string[] files = Directory.GetFiles(tempFolder);

                    foreach (string file in files)
                    {
                        FileInfo fi = new FileInfo(file);
                        if (fi.CreationTime < DateTime.Now.AddMonths(-1))
                            fi.Delete();
                    }
                    ucdResponse = _jmsDataLib.SendRplUCDRequest(UCDReqJson);
                    responseCount = responseCount + ucdResponse.Count;
                    if (ucdResponse.Count >0 )
                    {
                        foreach (UCDResponse Response in ucdResponse)
                        {
                            string UCDJsonResponse = JsonConvert.SerializeObject(Response);
                            if (Response.status.ToLower() == "success")
                            {
                                if ((Response.data.Name != null && Response.data.Name != "") &&
                                  (Response.data.CountryName != null && Response.data.CountryName != "") && dealId != 0)
                                {
                                    _primeCustomersDataLib.SaveUcdRequestData(Response.data.Name, Response.data.CountryName,
                                dealId, null, UCDJsonResponse, Response.data.AccountId, "API_accountid_received");

                                }

                                else
                                {

                                    OpLogPerf.Log("UCD - Error in saving AMQ response");
                                }
                                OpLogPerf.Log("UCD - AMQ response success ");
                            }
                            else if (Response.errormessage.ToLower() == "duplicate account" && Response.data.DuplicateAccountRecordType.ToLower() == "requested account")
                            {
                                if ((Response.data.Name != null && Response.data.Name != "") &&
                                 (Response.data.CountryName != null && Response.data.CountryName != "") && dealId != 0)
                                {
                                    _primeCustomersDataLib.SaveUcdRequestData(Response.data.Name, Response.data.CountryName,
                                dealId, null, UCDJsonResponse, Response.data.DuplicateAccountId, "API_accountid_received");
                      
                                }


                            }
                            else if (Response.errormessage.ToLower() == "duplicate account" && Response.data.DuplicateAccountRecordType.ToLower() != "requested account" && Response.data.duplicateAccountInfo.parentAccount != null)
                            {
                                //call to process the duplicate account response, if the details are valid then record gets unified and inserted into prime master table and as a response we will receive a valid deal id and end cust obj
                                       var dealEndCustomerResponse= _primeCustomersDataLib.SaveUcdRequestData(Response.data.Name, Response.data.CountryName,
                                dealId, null, UCDJsonResponse, Response.data.DuplicateAccountId, "API_Response_received");
                                if (dealEndCustomerResponse!=null && dealEndCustomerResponse.Count() > 0)
                                {
                                    if(dealEndCustomerResponse[0].DEAL_ID > 0)
                                    {
                                        //sending this status back to UI to re-validate End customer again so that Unified atributes and END_CUST_OBJ gets updated for the newly unified record.
                                        isEndCustRecordUnified = "Yes";
                                    }
                                }
 
                            }
                            else
                            {

                                OpLogPerf.Log("UCD - Error in AMQ response: " + Response.errormessage);
                                _primeCustomersDataLib.SaveUcdRequestData(Response.data.Name, Response.data.CountryName,
                      dealId, null, UCDJsonResponse, null, "API_processing_Error");

                            }
                        }
                    }
                    else
                    {
                        OpLogPerf.Log("UCD - Publish to ACM ERROR ");
                        foreach (UnPrimedDealLogs Customer in batch)
                        {
                            //When no response received for API request sent to UCD,below call is to Update the record with API_processing_Error status in the UCD log table
                            _primeCustomersDataLib.SaveUcdRequestData(Customer.END_CUSTOMER_RETAIL, Customer.PRIMED_CUST_CNTRY,
                              dealId, null, null, null, "API_processing_Error");
                        }

                    }

                }
                if (isEndCustRecordUnified == "Yes")
                {
                    return isEndCustRecordUnified;
                }
                else if (requestCount == 0)
                {
                    success = "NA";
                }
                else if (responseCount == requestCount)

                {
                    success = "true";
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log("UCD - ERROR: " + ex);

            }

            return success;
        }

       
        public void saveDealEndCustomerAtrbs(int dealId, string endCustObjdata)
        {
            var endCustomer = _primeCustomersDataLib.ValidateEndCustomer(endCustObjdata);
            UnPrimeAtrbs data = new UnPrimeAtrbs();
            List<string> END_CUSTOMER_RETAIL = new List<string>();
            List<string> PRIMED_CUST_CNTRY = new List<string>();
            List<string> PRIMED_CUST_ID = new List<string>();
            List<string> PRIMED_CUST_NM = new List<string>();
            List<string> IS_RPL = new List<string>();
            List<string> IS_PRIMED_CUST = new List<string>();
            //List<string> IS_EXCLUDE = new List<string>();
            var primeNotApplicable = "n/a";
            for (var i = 0; i < endCustomer.Count; i++)
            {
                var endCustomerValue = endCustomer[i].END_CUSTOMER_RETAIL;
                var primeCustidvalue = endCustomer[i].PRIMED_CUST_ID;
                var primeCustNameValue = endCustomer[i].PRIMED_CUST_NM;
                if (endCustomerValue != "" || endCustomerValue != null)
                {
                    END_CUSTOMER_RETAIL.Add(endCustomerValue);
                    PRIMED_CUST_CNTRY.Add(endCustomer[i].PRIMED_CUST_CNTRY);
                    if (endCustomer[i].IS_PRIMED_CUST == "0")
                    {
                        PRIMED_CUST_ID.Add(primeNotApplicable);
                        PRIMED_CUST_NM.Add(primeNotApplicable);
                    }
                    else
                    {
                        if (endCustomerValue.ToUpper() != "ANY")
                        {
                            PRIMED_CUST_ID.Add(primeCustidvalue);
                        }
                        PRIMED_CUST_NM.Add(primeCustNameValue);
                    }
                    IS_RPL.Add(endCustomer[i].IS_RPL);
                    IS_PRIMED_CUST.Add(endCustomer[i].IS_PRIMED_CUST);
                }

            }
            data.END_CUSTOMER_RETAIL = string.Join(",", END_CUSTOMER_RETAIL);
            data.PRIMED_CUST_CNTRY = string.Join(",", PRIMED_CUST_CNTRY);
            data.PRIMED_CUST_ID = string.Join(",", PRIMED_CUST_ID);
            data.PRIMED_CUST_NM = string.Join(",", PRIMED_CUST_NM);
            data.IS_PRIMED_CUST = string.Join(",", IS_PRIMED_CUST);
            data.IS_RPL = string.Join(",", IS_RPL);
            data.END_CUST_OBJ = JsonConvert.SerializeObject(endCustomer);
            data.IS_PRIMED_CUST = data.IS_PRIMED_CUST.Contains("0") ? "0" : "1";
            data.IS_RPL = data.IS_RPL.Contains("1") ? "1" : "0";
            //calling this function to update the deal data(end customer data) once we receive AMQ response and data inserted to the UCD log table 
            UpdateUnPrimeDeals(dealId, data);
        }

        public void saveAMQResponse(string amqResponse)
        {
            //var acmjsonData = JsonConvert.DeserializeObject<dynamic>(amqResponse);
            AMCResponce res = new AMCResponce();
            res = JsonConvert.DeserializeObject<AMCResponce>(amqResponse);

            bool isValidAMQResponse = res.customerAggregationType.Code == "UNFD_CTRY_CUST" && res.customerProcessEngagement.Where(data => data.Code == "DIR_PRC_EXCPT").Count() > 0;
            if (isValidAMQResponse)
            {
                if (res != null && res.parentAccount != null && res.parentAccount.AccountName != null && res.primaryAddress != null && res.primaryAddress.CountryName != null && res.AccountId != null)
                {
                    //call to save the AMQ response into the log table
                    var response = _primeCustomersDataLib.SaveUcdRequestData(res.AccountName, res.primaryAddress.CountryName,
                                0, null, amqResponse, res.AccountId, "AMQ_Response_received");

                    if (response != null)
                    {
                        for (var j = 0; j < response.Count; j++)
                        {
                            if (response[j].DEAL_ID != 0 && (response[j].END_CUST_OBJ != "" || response[j].END_CUST_OBJ != null))
                            {
                                saveDealEndCustomerAtrbs(response[j].DEAL_ID, response[j].END_CUST_OBJ);
                            }

                        }
                    }

                }
                else if (res != null && (res.RequestedAccountRejectionReason != ""|| res.RequestedAccountRejectionReason!=null) && (res.RecordType!="" || res.RecordType != null))
                {
                    if (res.RecordType.ToLower() == "rejected account")
                    {
                        //Raise a Duplicate API Request,if AMQ response has Survivor AccountId
                        if (res.RequestedAccountRejectionReason.ToLower() == "duplicate" && res.SurvivorAccountId != null && res.SurvivorAccountId != "")
                        {
                            var DuplicateReqData = new DuplicateRequest
                            {
                                businessOrganization = new DuplicateRequest.BusinessOrganization
                                {
                                    AccountId = new List<string>()
                                },
                                attributes = new List<DuplicateRequest.Attributes>()

                            };
                            DuplicateReqData.TransactionId = Guid.NewGuid().ToString();

                            DuplicateReqData.businessOrganization.AccountId.Add(res.SurvivorAccountId);

                            var AccountInformation = new DuplicateRequest.Attributes
                            { AttributeName = "AccountInformation" };
                            DuplicateReqData.attributes.Add(AccountInformation);

                            var ParentAccountInfomation = new DuplicateRequest.Attributes
                            { AttributeName = "ParentAccountInfomation" };
                            DuplicateReqData.attributes.Add(ParentAccountInfomation);

                            var AccountMasteredDetails = new DuplicateRequest.Attributes
                            { AttributeName = "AccountMasteredDetails" };
                            DuplicateReqData.attributes.Add(AccountMasteredDetails);

                            var AccountAddressInformation = new DuplicateRequest.Attributes
                            { AttributeName = "AccountAddressInformation" };
                            DuplicateReqData.attributes.Add(AccountAddressInformation);

                            var AccountComplianceDetails = new DuplicateRequest.Attributes
                            { AttributeName = "AccountComplianceDetails" };
                            DuplicateReqData.attributes.Add(AccountComplianceDetails);

                            String UCDDuplicateReqJson = JsonConvert.SerializeObject(DuplicateReqData);
                            DuplicateAccResponse responseforSurvivorAccIDReq = _jmsDataLib.SendRplUCDDuplicateRequest(UCDDuplicateReqJson);

                            if (responseforSurvivorAccIDReq != null)
                            {
                                string UCDDupResponse = JsonConvert.SerializeObject(responseforSurvivorAccIDReq);
                                if (responseforSurvivorAccIDReq.data[0].parentAccountInfomation != null)
                                {
                                    var response = _primeCustomersDataLib.SaveUcdRequestData(res.AccountName, res.primaryAddress.CountryName,
                                            0, UCDDuplicateReqJson, UCDDupResponse, res.AccountId, "AMQ_SurvivorResponse_received");

                                    if (response.Count > 0)
                                    {
                                        for (var count = 0; count < response.Count; count++)
                                        {
                                            if (response[count].DEAL_ID != 0 && (response[count].END_CUST_OBJ != "" || response[count].END_CUST_OBJ != null))
                                            {
                                                saveDealEndCustomerAtrbs(response[count].DEAL_ID, response[count].END_CUST_OBJ);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    _primeCustomersDataLib.SaveUcdRequestData(res.AccountName, res.primaryAddress.CountryName,
                                         0, null, UCDDupResponse, res.SurvivorAccountId, "API_processing_Error");
                                }
                            }
                            else
                            {
                                _primeCustomersDataLib.SaveUcdRequestData(res.AccountName, res.primaryAddress.CountryName,
                                     0, null, null, res.SurvivorAccountId, "API_processing_Error");
                            }
                        }
                        else if (res.RequestedAccountRejectionReason!= null && res.RequestedAccountRejectionReason != "")
                        {
                            // call to log the AMQ response in the UCD log table for the Account Rejection Scenario
                            _primeCustomersDataLib.SaveUcdRequestData(res.AccountName, res.primaryAddress.CountryName,
                                0, null, amqResponse, res.AccountId, "AMQ_Rejected_Account");
                        }
                    }
                }

            }
        }

        public List<RplStatusCode> GetRplStatusCodes()
        {
            return _primeCustomersDataLib.GetRplStatusCodes();
        }
    }
}
