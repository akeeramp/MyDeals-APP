using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Newtonsoft.Json;

namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {
        private static async Task SendDataToSapPo(string runMode)
        {
            VistexDFDataResponseObject dataRecord = new VistexDFDataResponseObject();
            dataRecord = await DataAccessLayer.GetVistexDFStageData(runMode);
            
            if (dataRecord.BatchId == "0")
            {
                Console.WriteLine("There is no outbound data to push..");
            }
            else if(dataRecord.BatchStatus.ToLower() == "processed")
            {
                Console.WriteLine("Outbound data pushed to SAP successfully..");
            }

        }
        
        private static async Task<bool> SendVerticalsToSapPo()
        {
            // Step 1: Gather Verticals Data from MyDeals - DB call
            List<VistexDFDataResponseObject> records = new List<VistexDFDataResponseObject>();
            records = await DataAccessLayer.GetVistexDataOutBound("PROD_VERT_RULES");
            //for(int i = 0; )
            if (records.Count == 0)
            {
                Console.WriteLine("There is no outbound data to push..");
                return true;
            }
            else
            {
                foreach(VistexDFDataResponseObject r in records)
                {
                    Console.WriteLine("Batch Id: " + r.BatchId + "  " + "Status: " + r.BatchStatus + " " + "Message: " + r.BatchMessage);
                }
            }
            return true;

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
