using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IValidateVistexR3ChecksDataLib
    {
        ValidateVistexR3Wrapper ValidateVistexR3Check(List<int> dealIds, int action, string custName);
    }
}