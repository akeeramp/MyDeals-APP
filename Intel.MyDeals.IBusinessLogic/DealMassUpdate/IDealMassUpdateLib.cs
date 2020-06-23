using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDealMassUpdateLib
    {
        List<DealMassUpdateResults> UpdateMassDealAttributes(DealMassUpdateData data);
    }
}
