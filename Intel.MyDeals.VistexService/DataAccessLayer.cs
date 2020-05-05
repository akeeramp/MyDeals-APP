using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.VistexService
{
    public class DataAccessLayer
    {
        private static string vistexAPIbaseUrl = GetAppSetting("MyDealsService");
        private static string vistexController = "/api/VistexService/";

        #region Common Settings
        public static Dictionary<string, string> conDict = new Dictionary<string, string>()
        {
            {"D", "https://sappodev.intel.com:8215/RESTAdapter/MyDeals"},
            {"C", "http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer"},
            {"P", "http://sappodev.intel.com:8415/RESTAdapter/ProductMain"},
            {"V", "https://sappodev.intel.com:8215/RESTAdapter/ProductVertical"},
        };

        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler()
                {
                    Credentials = CredentialCache.DefaultNetworkCredentials
                };
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(vistexAPIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        public static string GetAppSetting(string appSettingName)
        {
            if (String.IsNullOrEmpty(ConfigurationManager.AppSettings[appSettingName]))
            {
                throw new Exception(appSettingName + " is missing!");
            }
            return ConfigurationManager.AppSettings[appSettingName];
        }
        #endregion


        #region MyDeals Data Fetch Calls
        public static async Task<VistexDFDataResponseObject> GetVistexDataOutBound(string dataType, string runMode) //VTX_OBJ: DEALS
        {
            VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDataOutBound - Initiated");
            VistexDFDataResponseObject records = new VistexDFDataResponseObject();
            VistexDFDataResponseObject blah = new VistexDFDataResponseObject();
            var xmlRecords = string.Empty;
            try
            {
                //JmsQCommon.Log("GetPricingRecordsXml");

                var dealsRecordsXmlUrl = vistexController + "GetVistexDealOutBoundData/" + dataType + "/" + runMode;
                HttpResponseMessage response = await MyDealsClient.GetAsync(dealsRecordsXmlUrl);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                    VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDataOutBound - Success");
                }
                
                blah = JsonConvert.DeserializeObject<VistexDFDataResponseObject>(xmlRecords);                
            }
            catch (Exception ex)
            {
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: GetVistexDataOutBound - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDataOutBound - Completed");
            }

            return blah;
        }


        public static async Task<VistexDFDataResponseObject> GetVistexVerticalStageData(string runMode) //VTX_OBJ: Vertical
        {
            VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexVerticalStageData - Initiated");
            VistexDFDataResponseObject retRecord = new VistexDFDataResponseObject();
            var xmlRecords = string.Empty;
            try
            {
                var fetchVistexDFData = vistexController + "GetVistexDFStageData/" + runMode;
                HttpResponseMessage response = await MyDealsClient.GetAsync(fetchVistexDFData);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                    VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexVerticalStageData - Success");
                }
                
                retRecord = JsonConvert.DeserializeObject<VistexDFDataResponseObject>(xmlRecords);
            }
            catch (Exception ex)
            {
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: GetVistexVerticalStageData - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexVerticalStageData - Completed");
            }

            return retRecord;
        }


        public static async Task<VistexDFDataResponseObject> GetVistexDFStageData(string runMode) //VTX_OBJ: CUSTOMER, PRODUCTS
        {
            VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDFStageData - Initiated");
            VistexDFDataResponseObject retRecord = new VistexDFDataResponseObject();
            var xmlRecords = string.Empty;
            try
            {
                var fetchVistexDFData = vistexController + "GetVistexDFStageData/" + runMode;
                HttpResponseMessage response = await MyDealsClient.GetAsync(fetchVistexDFData);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                    VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDFStageData - Success");
                }
                
                retRecord = JsonConvert.DeserializeObject<VistexDFDataResponseObject>(xmlRecords);
            }
            catch (Exception ex)
            {
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: GetVistexDFStageData - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Data Access Layer - GetVistexDFStageData - Completed");
            }

            return retRecord;
        }
        #endregion MyDeals Data Fetch Calls


    }
}