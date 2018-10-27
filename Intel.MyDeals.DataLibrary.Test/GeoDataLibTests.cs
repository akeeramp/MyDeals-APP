using System;
using NUnit.Framework;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class GeoDataLibTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started GeoData Lib tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed GeoData Lib tests.");
        }


        [TestCase]
        public void GeosGetAll()
        {
            IEnumerable<GeoDimension> results = new GeoDataLib().GetGeoDimensions();
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void GetSoldTos() // Added for coverage, but expected result is empty list.  If ever altered, must change assert
        {
            IEnumerable<DcsSoldTo> results = new GeoDataLib().GetSoldTos();
            Assert.IsFalse(results.Any()); // Currently, this function returns an empty list.  Maybe some day it will return something...  Set to false
        }

    }
}
