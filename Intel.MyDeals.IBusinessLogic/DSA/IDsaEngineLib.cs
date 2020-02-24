using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDsaEngineLib
    {
        List<Vistex> GetVistex();
        List<VistexAttributes> GetVistexAttrCollection(int id);
    }
}
