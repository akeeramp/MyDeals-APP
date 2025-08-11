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

        public List<string> GetVistexFilterData(VistexMode vistexMode, DateTime StartDate, DateTime EndDate, string DealId, string filterName)
        {
            return new VistexAdminDataLib().GetVistexFilterData(vistexMode,StartDate,EndDate,DealId, filterName);
        }
        public VistexLogDetails GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate, string DealId, string filter, string sort, int take, int skip)
        {
            return new VistexAdminDataLib().GetVistexLogs(vistexMode, StartDate, EndDate, DealId, filter, sort, take, skip);
        }
        public List<string> GetVistexStatuses()
        {
            return new VistexAdminDataLib().GetStatuses();
        }
        /*
        public VistexLogDetails AddVistexData(List<int> lstDealIds, string filter)
        {
            return new VistexAdminDataLib().AddVistexData(lstDealIds, filter);
        }
        */
        
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

        public Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int? dealId, string strErrorMessage, int RQST_SID)
        {
            return new VistexAdminDataLib().UpdateStatus(batchId, vistexStage, dealId, strErrorMessage, RQST_SID);
        }

        public Guid UpdateArchived(Guid batchId, VistexStage vistexStage, int? dealId, string strErrorMessage, int RQST_SID)
        {
            return new VistexAdminDataLib().ArchivedToLog(batchId, vistexStage, dealId, strErrorMessage, RQST_SID);
        }

        public List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData()
        {
            return new VistexAdminDataLib().GetVistexProductVeticalsOutBoundData();
        }
        }
}
