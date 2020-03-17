using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexServiceLib : IVistexServiceLib
    {
        private readonly IVistexServiceDataLib _vistexServiceDataLib;

        public VistexServiceLib(IVistexServiceDataLib vistexServiceDataLib)
        {
            _vistexServiceDataLib = vistexServiceDataLib;
        }

        // Start actual functions here

        public List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType)
        {
            return _vistexServiceDataLib.GetVistexDealOutBoundData(packetType);
        }

        public void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus)
        {
            _vistexServiceDataLib.SetVistexDealOutBoundStage(btchId, rqstStatus);
        }
        
        public Dictionary<string, string> PublishSapPo(string url, string jsonData)
        {
            return _vistexServiceDataLib.PublishSapPo(url, jsonData);
        }

        // Testing helpers

        public Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName) // used to have password in it
        {
            return _vistexServiceDataLib.TestConnection(noSAP, brokerURI, userName, queueName);
        }

        public string GetMaxGroupId()
        {
            return _vistexServiceDataLib.GetMaxGroupId();
        }


    }
}
