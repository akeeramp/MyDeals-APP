using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IOverlapChecksDataLib
    {
        List<OverlappingTenders> CheckForOverlappingTenders(int dealId, DateTime startDate, DateTime endDate, string projectName, string endCustomerName, int customerId, int productId);
    }
}