using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.IO;
using System;
using System.Linq;
using System.Web.Configuration;

namespace Intel.MyDeals.BusinessLogic
{
    public class OpLogLib : IOpLogLib
    {
        string fileExtention = ".txt";
        string opLogPath = WebConfigurationManager.AppSettings["opLogPath"];
        public OpLogLib()
        {
            //_dataCollectionsDataLib = new DataCollectionsDataLib();
        }

         /// <summary>
         /// Return all the Log Captured by Opaque
        /// </summary>
        /// <returns></returns>
        public List<logFileObject> GetOpaqueLog(DateTime startDate, DateTime endDate)
        {           
            DirectoryInfo directory = new DirectoryInfo(opLogPath);//Assuming Temp is your Folder
            FileInfo[] Files = directory.GetFiles().Where(file => file.LastWriteTime >= startDate && file.LastWriteTime <= endDate && file.FullName.Contains(fileExtention)).ToArray();
            
            List<logFileObject> fileLog = new List<logFileObject>();
            foreach (FileInfo file in Files)
            {
                logFileObject o = new logFileObject();
                o.fileName = file.Name;
                o.creationDate = file.CreationTime;
                o.modifiedDate = file.LastWriteTime;

                fileLog.Add(o);

            }
            return fileLog;
        }

        /// <summary>
        /// Fetch Log Details
        /// </summary>
        /// <returns></returns>
        public string GetDetailsOpaqueLog(string fileName)
        {
            return System.IO.File.ReadAllText(@"C:\Windows\Temp\"+ fileName + fileExtention);            
        }

       
    }
}