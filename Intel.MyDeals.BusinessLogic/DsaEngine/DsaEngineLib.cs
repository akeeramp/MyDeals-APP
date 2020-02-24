using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;

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

        public List<VistexAttributes> GetVistexAttrCollection(int id)
        {
            return new VistexAdminDataLib().GetVistexAttrCollection(id);
        }
    }
}
