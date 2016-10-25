using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class PocTests
    {

        public PocTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void GetPocEmp()
        {
            IEnumerable<PocEmp> results = new PocDataLib().GetPocEmp();

            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void SetDelPocEmp()
        {
            PocEmp pocEmp = new PocEmp
            {
                emp_sid = 0,
                first_nm = "Unit",
                last_nm = "Tester"
            };
            new PocDataLib().SetPocEmp(pocEmp);

            IEnumerable<PocEmp> results = new PocDataLib().GetPocEmp();

            Assert.IsTrue(results.Any(p => p.first_nm == "Unit" && p.last_nm == "Tester"));

            foreach (PocEmp emp in results)
            {
                new PocDataLib().DelPocEmp(emp.emp_sid ?? 0);
            }

            results = new PocDataLib().GetPocEmp();

            Assert.IsFalse(results.Any(p => p.first_nm == "Unit" && p.last_nm == "Tester"));
        }
    }
}