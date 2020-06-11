using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IDataLibrary
{
    public interface IDealMassUpdateDataLib
    {
        List<DealMassUpdateResults> UpdateMassDealAttributes(DealMassUpdateData data);
    }
}
