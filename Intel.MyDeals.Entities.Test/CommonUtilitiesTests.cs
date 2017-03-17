using NUnit.Framework;

namespace Intel.MyDeals.Entities.Test
{
    [TestFixture]
    class CommonUtilitiesTests
    {

        [TestCase("Test$", "Test_")]
        [TestCase("Test$%&^#", "Test_____")]
        [TestCase("Test", "Test")]
        public void TestEscapeStrings(string input, string output)
        {
            Assert.IsTrue(OpCommonTools.CSharpIfyName(input) == output);
        }

    }
}
