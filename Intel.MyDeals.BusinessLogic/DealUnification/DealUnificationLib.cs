using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinessLogic
{
    public class DealUnificationLib : IDealUnificationLib
    {
        private readonly IDealUnificationDataLib _dealUnificationDataLib;

        public DealUnificationLib(IDealUnificationDataLib dealUnificationDataLib)
        {
            _dealUnificationDataLib = dealUnificationDataLib;
        }

        public List<UnificationReconciliationReport> GetDealUnificationReport()
        {
            return _dealUnificationDataLib.GetDealUnificationReport();
        }
    }
}
