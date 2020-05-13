using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IVistexCustomerMappingLib
    {
        
        List<VistexCustomerMappingWrapper> GetVistexCustomerMapping(bool getCachedResult = true);

        List<VistexCustomerMappingWrapper> SetVistexCustomerMapping(CrudModes mode, VistexCustomerMapping data);
    }
}
