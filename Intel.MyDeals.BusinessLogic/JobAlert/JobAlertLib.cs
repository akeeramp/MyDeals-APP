using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibraries;

namespace Intel.MyDeals.BusinessLogic
{
    public class JobAlertLib : IJobAlertLib
    {
        private readonly IJobAlertDataLib _iJobAlertDataLib;

        public JobAlertLib(IJobAlertDataLib iJobAlertDataLib)
        {
            _iJobAlertDataLib = iJobAlertDataLib;
        }
        public string SendJobAlerts()
        {
            return _iJobAlertDataLib.SendJobAlerts();
        }
    }
}
