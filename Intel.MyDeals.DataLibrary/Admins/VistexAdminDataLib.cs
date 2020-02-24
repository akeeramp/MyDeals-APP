using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using System.Linq;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexAdminDataLib
    {
        public List<Vistex> GetVistex(bool isBodyRequired)
        {
            List<Vistex> lstVistex = new List<Vistex>();
            for (int i = 1; i <= 50; i++)
                lstVistex.Add(new Vistex
                {
                    Id = i,
                    CreatedOn = DateTime.Now,
                    DataBody = isBodyRequired ? GetVistexBody(i) : null,
                    DealId = i + 10000,
                    Message = "NA",
                    Mode = VistexMode.Deals,
                    ProcessedOn = DateTime.Now,
                    SendToPoOn = DateTime.Now,
                    Status = VistexStage.PO_Staging,
                    TransanctionId = i + 12
                });

            //If needed
            lstVistex.ForEach(x =>
            {
                x.ModeLabel = x.Mode.ToString("g");
                x.StatusLabel = x.Status.ToString("g");
            });
            return lstVistex;
        }

        Dictionary<VistexAttribute, string> GetVistexBody(int id)
        {
            Dictionary<VistexAttribute, string> dicAttr = new Dictionary<VistexAttribute, string>();
            dicAttr.Add(VistexAttribute.CUST_DIV_NM, "CD " + id);
            dicAttr.Add(VistexAttribute.CUST_NM, "CN " + id);
            dicAttr.Add(VistexAttribute.DEAL_PRD_NM, "PN " + id);
            dicAttr.Add(VistexAttribute.END_CUSTOMER_RETAIL, "EC " + id);
            dicAttr.Add(VistexAttribute.MTRL_ID, "MT " + id);
            dicAttr.Add(VistexAttribute.PAYOUT_BASED_ON, "PB " + id);
            dicAttr.Add(VistexAttribute.PRODUCT_FILTER, "PF " + id);
            dicAttr.Add(VistexAttribute.SOLD_TO_ID, "ST " + id);
            dicAttr.Add(VistexAttribute.VOLUME, "VOL " + id);
            return dicAttr;
        }

        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            return (from result in GetVistexBody(id)
                    select new VistexAttributes
                    {
                        VistexAttribute = result.Key.ToString("g"),
                        Value = result.Value
                    }).ToList();
        }
    }
}