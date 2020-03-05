using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDsaEngineLib
    {
        List<Vistex> GetVistex();
        List<VistexAttributes> GetVistexAttrCollection(int id);
        List<string> GetVistexStatuses();
        Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int DealId, string strErrorMessage);
        List<Vistex> AddVistexData(List<int> lstDealIds);
        List<Vistex> GetVistexOutBoundData();
    }
}
