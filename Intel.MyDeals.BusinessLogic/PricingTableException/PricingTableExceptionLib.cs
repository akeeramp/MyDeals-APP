using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic.PricingTableException;
using Intel.MyDeals.IDataLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingTableExceptionLib : IPricingTableExceptionLib
    {
        private readonly IPricingTableExceptionDataLib _pricingTableExceptionDataLib;

        public PricingTableExceptionLib(IPricingTableExceptionDataLib pricingTableExceptionDataLib)
        {
            _pricingTableExceptionDataLib = pricingTableExceptionDataLib;
        }

        public List<PctException> GetPctExceptions(int startYearQuarter, int endYearQuarter)
        {
            return _pricingTableExceptionDataLib.GetPctExceptions(startYearQuarter, endYearQuarter);
        }
    }
}