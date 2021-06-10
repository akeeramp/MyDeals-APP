using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using System.Linq;
using System;

namespace Intel.MyDeals.BusinessLogic
{
    public class DsaEngineLib : IDsaEngineLib
    {
        public DsaEngineLib()
        {

        }

        public List<VistexLogsInfo> GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate)
        {
            return new VistexAdminDataLib().GetVistexLogs(vistexMode, StartDate, EndDate);
        }

        public List<string> GetVistexStatuses()
        {
            return new VistexAdminDataLib().GetStatuses();
        }

        public List<VistexLogsInfo> AddVistexData(List<int> lstDealIds)
        {
            return new VistexAdminDataLib().AddVistexData(lstDealIds);
        }

        public List<RequestDetails> GetRequestTypeList()
        {
            return new VistexAdminDataLib().GetRequestTypeList();
        }

        public List<VistexDealOutBound> GetVistexDealOutBoundData()
        {
            return new VistexAdminDataLib().GetVistexDealOutBoundData();
        }

        public List<ProductCategory> GetProductVerticalBody(int id)
        {
            return new VistexAdminDataLib().GetProductVerticalBody(id);
        }

        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            List<VistexAttributes> lstRtn = new List<VistexAttributes>();
            Dictionary<string, string> dicRtn = new VistexAdminDataLib().GetVistexBody(id);
            lstRtn = (from result in dicRtn
                      select new VistexAttributes
                      {
                          VistexAttribute = result.Key,
                          Value = result.Value
                      }).ToList();
            return lstRtn;
        }

        public Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int? dealId, string strErrorMessage)
        {
            return new VistexAdminDataLib().UpdateStatus(batchId, vistexStage, dealId, strErrorMessage);
        }

        public List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData()
        {
            return new VistexAdminDataLib().GetVistexProductVeticalsOutBoundData();
        }
        }
}
