using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class HealthCheckLibTest
    {
        public Mock<IHealthCheckDataLib> mockHealthCheckDataLib = new Mock<IHealthCheckDataLib>();

        [Test]
        public void GetDbHealthCheckStatus_Returns_NotNull()
        {
            var mockData = new List<HealthCheckData>();
            mockHealthCheckDataLib.Setup(x => x.GetDbHealthCheckStatus()).Returns(mockData);
            var res = new HealthCheckLib(mockHealthCheckDataLib.Object).GetDbHealthCheckStatus();
            Assert.IsNotNull(res);
        }
    }
}