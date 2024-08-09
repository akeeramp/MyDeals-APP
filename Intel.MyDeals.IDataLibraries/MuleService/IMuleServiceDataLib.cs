using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IMuleServiceDataLib
    {
        List<VistexQueueObject> GetVistexDealOutBoundData(string packetType, string runMode);

        Dictionary<string, string> PublishToVistexViaMule(string jsonData, string mode, VistexDFDataResponseObject responseObject);

        void SetVistexDealOutBoundStageV(Guid btchId, string rqstStatus, string BatchMessage);

        void SetVistexDealOutBoundStageD(Guid btchId, string rqstStatus, List<VistexQueueObject> dataRecords);
    }
}
