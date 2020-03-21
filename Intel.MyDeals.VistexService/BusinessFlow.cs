using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {
        private static async Task SendDataToSapPo()
        {
            // This is where you would put your "Business Flow" (steps to do this actions) into.  Re-trys, fail out, etc
            // Ganthi transplanted code - I am removing all of the please set # of retries and locking it down - change to def from app.config later

            // Step 1: Gather Deals Data from MyDeals
            int iAttempts = 1;
            Console.WriteLine("\nPlease wait while requesting service..");
            ResponseType responseType = ResponseType.None;
            List<VistexDealOutBound> records = new List<VistexDealOutBound>();
            // Might want to put re-trys into below call since it only returns data
            records = await DataAccessLayer.GetVistexDealOutBoundData();
            if (records.Count == 0)
            {
                Console.WriteLine("There is no outbound data to push..");
                return;
            }

            string btchId = records[1].TransanctionId.ToString(); // Safe assumption since above we looked for no records

            // Package it here as per JSON template from Saurav (TO DO)  Trash data for now
            string jsonData = "{" +
                              "\"Mydeals\": {" +
                              "\"Cust_no\": \"9666\"," +
                              "\"Deal_id\": \"54556\"," +
                              "\"END_DT\": \"5556\"," +
                              "\"GEO_COMBINED\": \"556\"," +
                              "\"MRKT_SEG\": \"5556\"," +
                              "\"OBJ_SET_TYPE_CD\": \"859\"," +
                              "\"PAYOUT_BASED_ON\": \"88\"," +
                              "\"PRODUCT_FILTER\": \"8559\"," +
                              "\"START_DT\": \"899\"," +
                              "\"VOLUME\": \"899\"" +
                              "}" +
                              "}";

            // Step 2: Post Data to SAP PO API
            //Dictionary<string, string> sendResponse = await DataAccessLayer.PublishDealsToSapPo();
            Dictionary<string, string> sendResponse = DataAccessLayer.PublishDealsToSapPo_Local(jsonData);

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Deals: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    return;
                }

                await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Send_Completed"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful for Deals");
                //Update Status

            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Deals");
                await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }
        }

        private static async Task SendDfDataToSapPo(string runMode)
        {
            VistexDFDataLoadObject dataRecord = new VistexDFDataLoadObject();
            dataRecord = await DataAccessLayer.GetVistexDFStageData(runMode);
            if (dataRecord.BatchId == 0)
            {
                Console.WriteLine("There is no outbound data to push..");
            }

            string jsonData = dataRecord.JsonData;

            // Step 2: Post Data to SAP PO API
            Dictionary<string, string> sendResponse = new Dictionary<string, string>();
            if (runMode == "P")
            {
                sendResponse = DataAccessLayer.PublishProductsToSapPo_Local(jsonData);
            }
            else //"C"
            {
                sendResponse = DataAccessLayer.PublishCustomersToSapPo_Local(jsonData);
            }

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Products: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    return;
                }

                VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
                responseObj.RunMode = runMode;
                responseObj.BatchId = dataRecord.BatchId;
                responseObj.BatchMessage = "Out of 100 records, 100 updated successfully, 0 failed.";
                responseObj.BatchName = "CUSTOMER_BRD";
                responseObj.BatchStatus = "PASS";

                await DataAccessLayer.UpdateVistexDFStageData(responseObj);
                Console.WriteLine("SAP PO Upload was Successful for Products");
            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Products");
            }
        }


        private static async Task<bool> SendVerticalsToSapPo()
        {
            // Step 1: Gather Verticals Data from MyDeals - DB call
            List<VistexQueueObject> records = new List<VistexQueueObject>();
            records = await DataAccessLayer.GetVistexDataOutBound("PROD_VERT_RULES");
            if (records.Count == 0)
            {
                Console.WriteLine("There is no outbound data to push..");
                return true;
            }

            string btchId = records[0].BatchId.ToString(); // Safe assumption since above we looked for no records
            string jsonData = records[0].RqstJsonData;

            // Step 2: Post Data to SAP PO API
            Dictionary < string, string > sendResponse = DataAccessLayer.PublishVerticalsToSapPo_Local(jsonData);
            //Dictionary<string, string> sendResponse = new Dictionary<string, string>();

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Verticals: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Processing_Complete"); // Is this something else?? REMOVE TEST
                    return false;
                }

                await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Processing_Complete"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful for Verticals");
                return false;
                //Update Status
            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Verticals");
                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }

            return false;
        }


        // Testing routine for comms
        private static async Task GetMaxGroupId()
        {
            var grp_jms_id_pairs = await DataAccessLayer.GetMaxGroupId();

            if (grp_jms_id_pairs != null && grp_jms_id_pairs.Any())
            {
                foreach (var pp in grp_jms_id_pairs)
                {
                    int x = 0;
                    //JmsQCommon.Log("Sending pricing records for Group {0}, JMS ID {1}.", pp.First, pp.Second);
                    //await SendPricingRecordsToQueue(pp.Second, pp.First, jobType);
                }
            }

        }


    }
}
