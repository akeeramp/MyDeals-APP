using Intel.MyDeals.DataLibrary;
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Vistex;

namespace Intel.MyDeals.VistexService
{
    class Program
    {
        static int iMaximumAttempts = Convert.ToInt32(ConfigurationManager.AppSettings["MaximumAttempts"]);
        static void Main(string[] args)
        {
            int iAttempts = 1;
            Console.WriteLine("Please wait while requesting service..");
            ResponseType responseType = ResponseType.None;
            do
            {
                if (iAttempts > 1)
                {
                    Console.WriteLine("Retrying..");
                    responseType = ResponseType.None;
                }
                using (VistexHttpService vistexHttpService = new VistexHttpService())
                {
                    responseType = vistexHttpService.VistexCustomer();
                }
                Console.WriteLine(VistexHttpService.GetResposnseMessage(responseType));
                iAttempts++;
            } while (responseType != ResponseType.Success && iAttempts <= iMaximumAttempts);

            if (responseType != ResponseType.Success && iAttempts >= iMaximumAttempts)
            {
                Console.WriteLine("Sending alert mail..");
                using (VistexAdminDataLib vistexAdminDataLib = new VistexAdminDataLib())
                {
                    vistexAdminDataLib.SendFailureMessage(responseType);
                }
            }

            //string strFilePath = ConfigurationManager.AppSettings["ExportPath"];
            //using (VistexAdminDataLib vistexAdminDataLib = new VistexAdminDataLib())
            //{
            //    Console.WriteLine("Please enter deal ids (Use comma for multiple deals) :");
            //    string strDealIds = Console.ReadLine();
            //    if (strDealIds.Trim() != string.Empty)
            //    {
            //        List<int> lstDealIds = strDealIds.Trim().Split(',').Select(x => Convert.ToInt32(x.Trim())).ToList();
            //        vistexAdminDataLib.AddData(lstDealIds);
            //    }
            //    Console.WriteLine("Reading Data..");
            //    vistexAdminDataLib.GetData();

            //    Console.WriteLine("Please press the status number from below to update..");
            //    Console.WriteLine(string.Join("\n", vistexAdminDataLib.GetStatuses()));
            //    VistexStage vistexStage = (VistexStage)Convert.ToInt32(Console.ReadKey().Key.ToString().Remove(0, 1));
            //    Console.WriteLine("\nPlease enter the transanction id to update the status..");
            //    Guid batchId = Guid.Parse(Console.ReadLine());
            //    Console.WriteLine("Please enter the error message the status (optional)..");
            //    string strErrorMessage = Console.ReadLine();
            //    vistexAdminDataLib.UpdateStatus(batchId, vistexStage, strErrorMessage);
            //    Console.WriteLine("Status has been updated...");

            //    //Console.WriteLine("Exporting...");
            //    //vistexAdminDataLib.ExportToExcel(strFilePath);
            //}
            ////Console.WriteLine("File is available in the path " + strFilePath);


            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
