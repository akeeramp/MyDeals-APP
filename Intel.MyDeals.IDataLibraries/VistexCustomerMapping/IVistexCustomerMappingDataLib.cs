using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IDataLibrary
{
    public interface IVistexCustomerMappingDataLib
    {
        List<VistexCustomerMapping> GetVistexCustomerMappings();
    }
}
