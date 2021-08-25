using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IBusinessLogic
{
    public interface IConsumptionCountryLib
    {
        List<ConsumptionCountry> GetConsumptionCountry();
        ConsumptionCountry ManageConsumptionCountry(ConsumptionCountry CompCtry, CrudModes type);

    }
}

