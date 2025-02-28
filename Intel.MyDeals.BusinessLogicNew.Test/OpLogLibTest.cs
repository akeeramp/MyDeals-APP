using Intel.MyDeals.BusinessLogic;
using NUnit.Framework;
using System.IO;
using System.Text;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class OpLogLibTest
    {
        private string testFilePath;

        [SetUp]
        public void Setup()
        {
            // Set up the test file path
            testFilePath = @"C:\Windows\Temp\FileLogPerf.txt";
        }

        [TearDown]
        public void Teardown()
        {
            // Clean up the test file
            if (File.Exists(testFilePath))
            {
                File.Delete(testFilePath);
            }
        }

        [Test,
            TestCase("filelog"), TestCase("FileLogPerf"), TestCase("FileLogPerf..")]
        public void GetDetailsOpaqueLog_ShouldReturnNotNull(string filename)
        {
            // Create an instance of OpLogLib
            var opLogLib = new OpLogLib();

            // Use reflection to set the private opLogPath field to the test directory
            var originalOpLogPath = typeof(OpLogLib).GetField("opLogPath", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            originalOpLogPath.SetValue(opLogLib, @"C:\Windows\Temp");

            if (filename.Contains("FileLogPerf"))
            {
                // Create a test file with content
                File.WriteAllText(testFilePath, "test", Encoding.UTF8);

                // Call the method and assert
                var res = opLogLib.GetDetailsOpaqueLog(filename);
                Assert.NotNull(res);
                Assert.AreEqual("test", res);
            }
            else
            {
                // Call the method and assert
                var res = opLogLib.GetDetailsOpaqueLog(filename);
                Assert.NotNull(res);
                Assert.AreEqual("Something went wrong", res);
            }
        }
    }
}