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

        [TestCase("Test$", "Test$")]
        [TestCase("Test$%&^#", "Test$%&amp;^#")]
        [TestCase("Test<me>aga'in", "Test&lt;me&gt;aga&#39;in")]
        public void Test(string input, string output)
        {
            Assert.IsTrue(OpCommonTools.HtmlSafeString(input) == output);
        }

    }
}
