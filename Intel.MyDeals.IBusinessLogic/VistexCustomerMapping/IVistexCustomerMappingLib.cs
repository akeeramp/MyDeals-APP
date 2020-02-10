using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IVistexCustomerMappingLib
    {
        List<VistexCustomerMapping> GetVistexCustomerMappings();

        List<VistexCustomerMapping> GetVistexCustomerMapping(bool getCachedResult = true);
    }
}
