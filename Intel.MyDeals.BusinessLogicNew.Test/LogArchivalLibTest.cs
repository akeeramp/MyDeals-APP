using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.deal;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class LogArchivalLibTest
    {
        private List<LogArchival> _updateLogArchival_Params = new List<LogArchival>
        {
            new LogArchival
            {
                SRT_ORDR = 900,
                DB_NAME = "MYDEALS",
                SCHEMA = "DBO",
                LOG_TBL_NM = "UI_DBTEST_123",
                IS_PURGE = true,
                IS_ARCHV = false,
                JSON_COND = "{\"PURGE_DTL\": {\"PURGE_IN_DAYS\": 180, \"DATE_FILTER\":\"LOG_DTM\", \"COLUMN_FILTER\": \"MODE = 'UI'\"}}",
                ACTV_IND = false,
                LOG_ARCHVL_PRG_TBL_DTL_SID = -1
            }
        };

        [Test]
        public void GetLogArchivalDetails_ReturnsNotNull()
        {
            var mockMyDealsLogArchDataLib = new Mock<ILogArchivalDataLib>();
            var data = GetLogArchival_mockData();
            mockMyDealsLogArchDataLib.Setup(x => x.GetLogArchivalDetails()).Returns(data);

            var res = new LogArchivalLib(mockMyDealsLogArchDataLib.Object).GetLogArchivalDetails();
            Assert.IsNotNull(res);
            Assert.Greater(res.Count, 0);
        }

        [Test]
        public void UpdateLogArchival_ReturnsIsNotNull()
        {
            var mockMyDealsLogArchDataLib = new Mock<ILogArchivalDataLib>();
            var data = UpdateLogArchival_mockData();

            data[0].LOG_ARCHVL_PRG_TBL_DTL_SID = 123;
            mockMyDealsLogArchDataLib.Setup(x => x.SetLogArchival("update", data)).Returns(data);

            var res = new LogArchivalLib(mockMyDealsLogArchDataLib.Object).UpdateLogArchival("update", data);
            Assert.IsNotNull(res);
        }

        private List<LogArchivalDetails> GetLogArchival_mockData()
        {
            return new List<LogArchivalDetails>
            {
                new LogArchivalDetails
                {
                    SRT_ORDR = 900,
                    DB_NAME = "MYDEALS",
                    SCHEMA = "DBO",
                    LOG_TBL_NM = "UI_DBTEST_123",
                    IS_PURGE = true,
                    IS_ARCHV = false,
                    JSON_COND = "{\"PURGE_DTL\": {\"PURGE_IN_DAYS\": 180, \"DATE_FILTER\":\"LOG_DTM\", \"COLUMN_FILTER\": \"MODE = 'UI'\"}}",
                    ACTV_IND = false,
                    LOG_ARCHVL_PRG_TBL_DTL_SID = -1
                },
                new LogArchivalDetails
                {
                    SRT_ORDR = 900,
                    DB_NAME = "MYDEALS",
                    SCHEMA = "DBO",
                    LOG_TBL_NM = "UI_DBTEST_123",
                    IS_PURGE = true,
                    IS_ARCHV = false,
                    JSON_COND = "{\"PURGE_DTL\": {\"PURGE_IN_DAYS\": 180, \"DATE_FILTER\":\"LOG_DTM\", \"COLUMN_FILTER\": \"MODE = 'UI'\"}}",
                    ACTV_IND = false,
                    LOG_ARCHVL_PRG_TBL_DTL_SID = -1
                }
            };
        }

        private List<LogArchival> UpdateLogArchival_mockData()
        {
            return new List<LogArchival>
            {
                new LogArchival
                {
                    SRT_ORDR = 900,
                    DB_NAME = "MYDEALS",
                    SCHEMA = "DBO",
                    LOG_TBL_NM = "UI_DBTEST_123",
                    IS_PURGE = true,
                    IS_ARCHV = false,
                    JSON_COND = "{\"PURGE_DTL\": {\"PURGE_IN_DAYS\": 180, \"DATE_FILTER\":\"LOG_DTM\", \"COLUMN_FILTER\": \"MODE = 'UI'\"}}",
                    ACTV_IND = false,
                    LOG_ARCHVL_PRG_TBL_DTL_SID = -1
                }
            };
        }
    }
}