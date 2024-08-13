using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IMuleServiceLib
    {
        VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode, VistexDFDataResponseObject responseObj);

        VistexDFDataResponseObject GetVistexStageData(string runMode, VistexDFDataResponseObject responseObj);
    }
}
