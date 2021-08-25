using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IDataLibrary
{
    public interface IConsumptionCountryDataLib
    {
        List<ConsumptionCountry> GetConsumptionCountry();

        ConsumptionCountry ManageConsumptionCountry(ConsumptionCountry CompCtry, CrudModes type);



    }
}

