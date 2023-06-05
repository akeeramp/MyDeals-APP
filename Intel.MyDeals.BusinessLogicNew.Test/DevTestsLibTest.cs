using Intel.MyDeals.BusinessLogic;
using NUnit.Framework;
using System;
using Assert = NUnit.Framework.Assert;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class DevTestsLibTest
    {
        [Test]
        public void CSharpException_ShouldReturnException()
        {
            var ex = Assert.Throws<System.Exception>(() => new DevTestsLib().CSharpException());
            Assert.That(ex.Message, Is.EqualTo("Example Uncaught Detailed Exception"));
        }
    }
}
