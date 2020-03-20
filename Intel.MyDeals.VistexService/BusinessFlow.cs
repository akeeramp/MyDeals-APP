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

        private static async Task SendCustomersToSapPo()
        {
            Console.WriteLine("SendCustomersToSapPo - Not Implemented Yet...");
            // Step 1: Gather Customer Data from MyDeals - DB call
            // Package it here as per JSON template from Saurav (TO DO)  Trash data for now
            string jsonData = "{" +
                              "\"Customer\": {" +
                              "\"GDM_SLD_TO_ID\": \"23234\"," +
                              "\"SLS_ORG_CD\": \"234\"," +
                              "\"DSTRB_CHNL_CD\": \"34\"," +
                              "\"REBATE_SOLD_TO_CUSTOMER\": \"34\"," +
                              "\"REBATE_CUSTOMER_DIVISION\": \"\"," +
                              "\"GDM_HOSTED_GEO_NM\": \"\"," +
                              "\"NGRP_REV_CUST_NM\": \"\"," +
                              "\"NGRP_REV_SUBCUST_NM\": \"\"" +
                              "}" +
                              "}";
            // Step 2: Post Data to SAP PO API
            Dictionary<string, string> sendResponse = DataAccessLayer.PublishCustomersToSapPo_Local(jsonData);

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Customers: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    return;
                }

                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Send_Completed"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful for Customers");
                //Update Status
            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Customers");
                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }
        }

        private static async Task SendProductsToSapPo()
        {
            Console.WriteLine("SendProductsToSapPo - Not Implemented Yet...");
            // Step 1: Gather Products Data from MyDeals - DB call
            // Package it here as per JSON template from Saurav (TO DO)  Trash data for now
            string jsonData = "{" +
                              "\"Products\": {" +
                              "\"MTRL_ID\": \"000000000500020337\"," +
                              "\"VALID_FROM\": \"20200202\"," +
                              "\"VALID_TO\": \"99991231\"," +
                              "\"GDM_PRD_TYPE_NM\": \"testing interface9\"," +
                              "\"GDM_VRT_NM\": \"testing interface9\"," +
                              "\"GDM_BRND_NM\": \"testing interface9\"," +
                              "\"GDM_FMLY_NM\": \"testing interface9\"," +
                              "\"CPU_PROCESSOR_NUMBER\": \"testing interface9\"," +
                              "\"FRCST_ALTR_ID\": \"testing interface9\"," +
                              "\"KIT_NM\": \"testing interface9\"," +
                              "\"OPR_BUSNS_UN_CD\": \"testing interface9\"," +
                              "\"DIV_SHRT_NM\": \"testing interface9\"," +
                              "\"CPU_MM_MEDIA\": \"testing interface9\"," +
                              "\"NAND_FAMILY\": \"testing interface9\"," +
                              "\"NAND_DENSITY\": \"testing interface9\"," +
                              "\"NAND_FORM_FACTOR\": \"testing interface9\"" +
                              "}" +
                              "}";
            // Step 2: Post Data to SAP PO API
            Dictionary<string, string> sendResponse = DataAccessLayer.PublishProductsToSapPo_Local(jsonData);

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Products: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    return;
                }

                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Send_Completed"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful for Products");
                //Update Status
            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Products");
                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }
        }

        private static async Task SendVerticalsToSapPo()
        {
            Console.WriteLine("SendVerticalsToSapPo - Not Implemented Yet...");
            // Step 1: Gather Verticals Data from MyDeals - DB call



            ResponseType responseType = ResponseType.None;
            List<VistexDealOutBound> records = new List<VistexDealOutBound>();
            // Might want to put re-trys into below call since it only returns data
            records = await DataAccessLayer.GetVistexDealOutBoundData("PROD_VERT_RULES");
            if (records.Count == 0)
            {
                Console.WriteLine("There is no outbound data to push..");
                return;
            }

            string btchId = records[1].TransanctionId.ToString(); // Safe assumption since above we looked for no records






            // Package it here as per JSON template from Saurav (TO DO)  Trash data for now
            string jsonData = "{" +
                              "\"ProductVertical\": [" +
                              "{" +
                              "\"GDM_PRD_TYPE_NM\": \"Product1\"," +
                              "\"GDM_VRT_NM\": \"54556\"," +
                              "\"OPR_BUSNS_UN_CD\": \"5556\"," +
                              "\"VALID_TO\": \"20200304\"," +
                              "\"DIV_SHRT_NM\": \"5556\"," +
                              "\"DEAL_PRD_TYPE_NM\": \"859\"," +
                              "\"DEAL_VRT_NM\": \"88\"," +
                              "\"ACTIVE_IND\": \"1\"" +
                              "}," +
                              "{" +
                              "\"GDM_PRD_TYPE_NM\": \"Product3\"," +
                              "\"GDM_VRT_NM\": \"54556\"," +
                              "\"OPR_BUSNS_UN_CD\": \"5556\"," +
                              "\"VALID_TO\": \"20200304\"," +
                              "\"DIV_SHRT_NM\": \"5556\"," +
                              "\"DEAL_PRD_TYPE_NM\": \"859\"," +
                              "\"DEAL_VRT_NM\": \"88\"," +
                              "\"ACTIVE_IND\": \"0\"" +
                              "}" +
                              "]" +
                              "}";
            // Step 2: Post Data to SAP PO API
            Dictionary<string, string> sendResponse = DataAccessLayer.PublishVerticalsToSapPo_Local(jsonData);

            // Step 3: Update Queue Table based on SAP PO API Response
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO for Verticals: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    return;
                }

                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Send_Completed"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful for Verticals");
                //Update Status
            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back for Verticals");
                //await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }
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
