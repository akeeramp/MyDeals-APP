using Intel.MyDeals.DataLibrary;
using System;
using System.Configuration;
using System.Linq;
using Intel.MyDeals.Entities;
using Vistex;
using System.Collections.Generic;

namespace Intel.MyDeals.VistexService
{
    class Program
    {
        static int iMaximumAttempts = Convert.ToInt32(ConfigurationManager.AppSettings["MaximumAttempts"]);
        static void Main(string[] args)
        {
            int iAttempts = 1;
            Console.WriteLine("Please select retry option:\n1.Auto Retry\n2.Manual Retry");
            string strRetryKey = Console.ReadKey().Key.ToString().Remove(0, 1);
            bool isAutoRetry = strRetryKey == "1";
            Console.WriteLine("\nPlease wait while requesting service..");
            ResponseType responseType = ResponseType.None;
            List<VistexLogs> lstTransId = new List<VistexLogs>();
            do
            {
                if (iAttempts > 1)
                {
                    if (!isAutoRetry)
                    {
                        Console.WriteLine("\nYou have selected manual retry. Please press any key for next try..");
                        Console.ReadKey();
                    }
                    responseType = ResponseType.None;
                }
                Console.WriteLine(string.Format("\n{0} to push below Batch IDs..", iAttempts > 1 ? "Retrying" : "Trying"));
                using (VistexAdminDataLib vistexAdminDataLib = new VistexAdminDataLib())
                {
                    lstTransId.AddRange((from result in vistexAdminDataLib.GetVistexDealOutBoundData()
                                         select new VistexLogs
                                         {
                                             DealId = result.DealId,
                                             TransanctionId = result.TransanctionId
                                         }).ToList());
                    if (lstTransId.Count() > 0)
                        Console.WriteLine(string.Join("\n", lstTransId.Select(x => x.TransanctionId).Distinct()));
                    else
                        Console.WriteLine("There is no outbound data to push..");
                }
                using (VistexHttpService vistexHttpService = new VistexHttpService())
                {
                    responseType = vistexHttpService.GetVistexOutBoundData();
                }
                Console.WriteLine(VistexHttpService.GetResposnseMessage(responseType));
                iAttempts++;
            } while (responseType != ResponseType.Success && iAttempts <= iMaximumAttempts);

            if (responseType != ResponseType.Success && iAttempts >= iMaximumAttempts)
            {
                using (VistexAdminDataLib vistexAdminDataLib = new VistexAdminDataLib())
                {
                    foreach (VistexLogs temp in lstTransId)
                    {
                        Console.WriteLine(string.Concat("Rolling back for transanction Id ", temp.TransanctionId, ", Deal Id: ", temp.DealId));
                        vistexAdminDataLib.UpdateStatus(temp.TransanctionId.Value, VistexStage.PO_Error_Rollback, temp.DealId, "Failure in service call..");
                    }
                    Console.WriteLine("\nSending alert mail..\nPlease enter Email Ids to receive alert mail:");
                    vistexAdminDataLib.SendFailureMessage(responseType, Console.ReadLine());
                }
                Console.WriteLine("Alert mail has been sent");
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
}
