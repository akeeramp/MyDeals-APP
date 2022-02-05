using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Intel.MyDeals.UCDService
{
    class Program
    {
        
        static void Main(string[] args)
        {
            string UCDURI = ConfigurationManager.AppSettings["UcdUri"];
            string queueName = ConfigurationManager.AppSettings["QueueName"];
            string userName = ConfigurationManager.AppSettings["UserName"];
            string password = ConfigurationManager.AppSettings["Password"];

            new Consumer().Run(UCDURI, userName, password, queueName);

            new Consumer().RetryRequest();
            
            //Console.ReadLine();
        }

       
    }
}
