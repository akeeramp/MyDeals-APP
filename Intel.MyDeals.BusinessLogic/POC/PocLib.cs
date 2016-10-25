using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class PocLib
    {

        public IEnumerable<PocEmp> GetPocEmp()
        {
            return new PocDataLib().GetPocEmp();
        }

        public void SetPocEmp(PocEmp pocEmp)
        {
            new PocDataLib().SetPocEmp(pocEmp);
        }

        public void DelPocEmp(int empSid)
        {
            new PocDataLib().DelPocEmp(empSid);
        }

    }
}
