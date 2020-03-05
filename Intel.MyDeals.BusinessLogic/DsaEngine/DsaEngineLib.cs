using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Newtonsoft.Json;
using System.Linq;
using System;

namespace Intel.MyDeals.BusinessLogic
{
    public class DsaEngineLib : IDsaEngineLib
    {
        public DsaEngineLib()
        {

        }

        public List<Vistex> GetVistex()
        {
            return new VistexAdminDataLib().GetVistex(false);
        }

        public List<string> GetVistexStatuses()
        {
            return new VistexAdminDataLib().GetStatuses();
        }

        public List<Vistex> AddVistexData(List<int> lstDealIds)
        {
            return new VistexAdminDataLib().AddVistexData(lstDealIds);
        }

        public List<Vistex> GetVistexOutBoundData()
        {
            return new VistexAdminDataLib().GetVistexOutBoundData();
        }

        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            List<VistexAttributes> lstRtn = new List<VistexAttributes>();
            string strJson = new VistexAdminDataLib().GetVistexBody(id);
            try
            {
                if (strJson.Contains("DEAL_ID"))
                {
                    Dictionary<VistexAttribute, string> dicRtn = JsonConvert.DeserializeObject<Dictionary<VistexAttribute, string>>(strJson);
                    lstRtn = (from result in dicRtn
                              select new VistexAttributes
                              {
                                  VistexAttribute = result.Key.ToString("g"),
                                  Value = result.Value
                              }).ToList();
                }
                else
                {
                    lstRtn.Add(new VistexAttributes { VistexAttribute = "Illegal Json", Value = strJson });
                }

            }
            catch (Exception ex)
            {
                lstRtn.Add(new VistexAttributes { VistexAttribute = "Illegal Attribute", Value = strJson });
            }
            return lstRtn;
        }

        public Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int dealId, string strErrorMessage)
        {
            return new VistexAdminDataLib().UpdateStatus(batchId, vistexStage, dealId, strErrorMessage);
        }
    }
}
