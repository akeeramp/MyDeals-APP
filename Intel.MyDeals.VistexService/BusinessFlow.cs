using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {
        private static async Task SendDFDataToSapPo(string runMode) //VTX_OBJ: CUSTOMERS, PRODUCTS
        {
            List<VistexDFDataResponseObject> dataRecord = new List<VistexDFDataResponseObject>();
            dataRecord = await DataAccessLayer.GetVistexDFStageData(runMode);
            foreach(VistexDFDataResponseObject r in dataRecord)
            {
                if (r.BatchId == "0")
                {
                    Console.WriteLine("There is no outbound data to push..");
                }
                else
                {
                    if (r.BatchStatus.ToLower() == "processed")
                    {
                        Console.WriteLine("Outbound data pushed to SAP completed successfully..");
                    }
                    else
                    {
                        Console.WriteLine("Data pushed to SAP Completed, Status: " + r.BatchStatus + " - " + r.BatchMessage);
                    }
                }
            }
        }

        private static async Task SendDealsDataToSapPo(string runMode) //VTX_OBJ: DEALS
        {
            VistexDFDataResponseObject dataRecord = new VistexDFDataResponseObject();
            dataRecord = await DataAccessLayer.GetVistexDataOutBound("VISTEX_DEALS", runMode);

            if (dataRecord.BatchId == "0")
            {
                Console.WriteLine("There is no outbound data to push..");
            }
            else if (dataRecord.BatchStatus.ToLower() == "processed")
            {
                Console.WriteLine("Outbound data pushed to SAP successfully..");
            }
        }

        private static async Task<bool> SendVerticalsToSapPo() //VTX_OBJ: VERTICALS
        {
            VistexDFDataResponseObject records = new VistexDFDataResponseObject();
            while (true)
            {
                records = await DataAccessLayer.GetVistexVerticalStageData("PROD_VERT_RULES");

                if (records.BatchId == "0" || records.BatchStatus == "ERROR")
                {
                    Console.WriteLine("There is no outbound data to push..");
                    break;
                }
                else{
                    Console.WriteLine("Batch Id: " + records.BatchId + "  " + "Status: " + records.BatchStatus + " " + "Message: " + records.BatchMessage);
                }
            }
            return true;
        }


    }
}
