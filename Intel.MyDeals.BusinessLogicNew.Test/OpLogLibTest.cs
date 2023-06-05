using Intel.MyDeals.BusinessLogic;
using NUnit.Framework;
using System;
using System.IO;
using System.Linq;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class OpLogLibTest
    {        
        [Test,
            TestCase("filelog"), TestCase("FileLogPerf"), TestCase("FileLogPerf..")]
        public void GetDetailsOpaqueLog_ShouldReturnNotNull(string filename)
        {
            if (filename.Contains("FileLogPerf"))
            {
                //To run this TestCase, "FileLogPerf.txt" file needs to be created in system at location : C:\Windows\Temp
                string path = @"C:\Windows\Temp\FileLogPerf.txt";                
                using (StreamWriter sw = File.CreateText(path)) //The CreateText method returns a StreamWriter object
                {
                    sw.Write("test");
                }
                var res = new OpLogLib().GetDetailsOpaqueLog(filename);
                Assert.NotNull(res);
                Assert.AreEqual(res, "test");
            }
            else
            {
                var res = new OpLogLib().GetDetailsOpaqueLog(filename);
                Assert.NotNull(res);
                Assert.AreEqual(res, "Something went wrong");
            }
        }
    }
}