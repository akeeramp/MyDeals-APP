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

            //Dictionary<string, string> sendResponse = await DataAccessLayer.PublishDealsToSapPo();
            Dictionary<string, string> sendResponse = DataAccessLayer.PublishSapPo();
            if (sendResponse.Count > 0)
            {
                if (!(sendResponse["Status"] == "Ok" || sendResponse["Status"] == "Accepted"))
                {
                    Console.WriteLine("There was an error in SAP PO: " + sendResponse["Status"]);
                    Console.WriteLine("Rolling the transaction back");
                    await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
                    return;
                }

                await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Send_Completed"); // Is this something else??
                Console.WriteLine("SAP PO Upload was Successful");
                //Update Status

            }
            else
            {
                Console.WriteLine("Something died hard, rolling the transaction back");
                await DataAccessLayer.SetVistexDealOutBoundStage(btchId, "PO_Error_Rollback");
            }
        }


        // Testing routine for comms
        private static async Task GetMaxGroupId()
        {
            int b = 0;
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
