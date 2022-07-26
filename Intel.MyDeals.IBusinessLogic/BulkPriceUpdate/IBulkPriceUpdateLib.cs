using System;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IBulkPriceUpdateLib
    {

        BulkPriceUpdateRecordsList TestMyGuid(BulkPriceUpdateRecordsList myList);

    }
}
