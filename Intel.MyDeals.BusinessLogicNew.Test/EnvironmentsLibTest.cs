using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;


namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class EnvironmentsLibTest
    {
        public Mock<IEnvironmentsDataLib> mockIEnvironmentsDataLib = new Mock<IEnvironmentsDataLib>();

        [Test] 
        public void GetEnvDetails_Returns_NotNull()
        {
            var mockEnvironmentData = GetEnvDetailsMockedData();
            mockIEnvironmentsDataLib.Setup(m => m.GetEnvDetails()).Returns(mockEnvironmentData);
            var result = new EnvironmentsLib(mockIEnvironmentsDataLib.Object,null,null).GetEnvDetails();
            Assert.IsNotNull(result);
        }

        public List<AdminEnvironments> GetEnvDetailsMockedData()
        {
            var objAdminEnvironments = new List<AdminEnvironments>();
            objAdminEnvironments.Add(new AdminEnvironments
            {
                ENVT_SID = 0,
                ENVT_NM = "CIN",
                DB_ENVT_NM = "DEV",
                DB_VANITY_CONN_STR = "DEVMYDEALSDBAAS.intel.com,3181",
                DB_SRVR_DTL = "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                GRAFANA_DASHBOARD_LINK = "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                MANAGED_OWNERS = "My Deals Leads",
                WEBISTE_LINK = "https://mydeals-cin.intel.com/Dashboard#/portal",
                APP_SERVER = "{\"UI_SRVR\":{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                WIN_JOBS_HOSTED_MCHN = "{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"}",
                SSIS_SRVR_CONN_STR = "sql3309-fm1-in.amr.corp.intel.com,3180",
                SSIS_CATALOGUE_FOLDER = "MyDeals_Dev",
                SSIS_CATALOGUE_SRVR_DTL = "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                ACTV_IND = Boolean.Parse("true"),
            }
            );
            objAdminEnvironments.Add(new AdminEnvironments
            {
                ENVT_SID = 0,
                ENVT_NM = "DEV",
                DB_ENVT_NM = "DEV",
                DB_VANITY_CONN_STR = "DEVMYDEALSDBAAS.intel.com,3181",
                DB_SRVR_DTL = "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                GRAFANA_DASHBOARD_LINK = "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                MANAGED_OWNERS = "My Deals Leads",
                WEBISTE_LINK = "https://mydeals-dev.intel.com/Dashboard#/portal",
                APP_SERVER = "{\"UI_SRVR\":{\"1\":\"HF2DEVMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                WIN_JOBS_HOSTED_MCHN = "{\"1\":\"HF2DEVMYDLW01.amr.corp.intel.com\"}",
                SSIS_SRVR_CONN_STR = "sql3309-fm1-in.amr.corp.intel.com,3180",
                SSIS_CATALOGUE_FOLDER = "MyDeals_Dev",
                SSIS_CATALOGUE_SRVR_DTL = "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                ACTV_IND = Boolean.Parse("true"),
            }
            );
            return objAdminEnvironments;
        }

        [Test]
        public void GetServerDetails_Returns_NotNull()
        {
            var mockEnvironmentData = GetServerDetailsMockedData();
            mockIEnvironmentsDataLib.Setup(m => m.GetServerDetails()).Returns(mockEnvironmentData);
            var result = new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).GetServerDetails();
            Assert.IsNotNull(result);
        }

        public List<AdminServerDetails> GetServerDetailsMockedData()
        {
            var objAdminServerDetails = new List<AdminServerDetails>();
            objAdminServerDetails.Add(new AdminServerDetails
            {
                LNKD_SRVR_NM = "dbUTT",
                ENVT = "ALL",
                LNKD_SRVR_CONN_DTL = "{\"Remote Connection\":\"sql3896-fm1-in.amr.corp.intel.com\",\"Port\":\"3181\",\"Remote DB\":\"MYDEALS\",\"Provider\":\"SQL Native\",\"Remote User\":\"chip_reader\"}",
                CHK_QUERY = "IF EXISTS (SELECT top 1 1 FROM dbUTT.mydeals.sys.tables) WAITFOR DELAY '00:00:00'",
                LST_CHCKD_DTM = System.Convert.ToDateTime("2025-02-24 22:15:21.590"),
                LS_ERR_TXT = "Demo LS_ERR_TXT",
                ACTV_IND = Boolean.Parse("true"),
            }
            );
            objAdminServerDetails.Add(new AdminServerDetails
            {
                LNKD_SRVR_NM = "DENODO_MYDL_LOCATION_PREPROD",
                ENVT = "PreProd",
                LNKD_SRVR_CONN_DTL = "{\"Remote Connection\":\"edvp-dev.intel.com\",\"Remote DB\":\"location\",\"Provider\":\"Denodo\",\"Remote User\":\"sys_myd_denodo\"}",
                CHK_QUERY = "IF EXISTS (SELECT top 1 1 FROM OPENQUERY (DENODO_MYDL_LOCATION_PROD, 'SELECT \"CountryCd\" FROM \"location\".\"CountryDetailV4\" WHERE \"CountryCd\"=''ZZ''')) WAITFOR DELAY '00:00:00'",
                LST_CHCKD_DTM = System.Convert.ToDateTime("2025-02-24 22:15:23.323"),
                LS_ERR_TXT = "Demo LS_ERR_TXT",
                ACTV_IND = Boolean.Parse("true"),
            }
           );
            return objAdminServerDetails;
        }


        private static readonly object[] DeleteServerDetailsParams =
        {
            new object[] { null },
            new object[] {
                new AdminServerDetails
                {
                    LNKD_SRVR_NM = "DENODO_MYDL_LOCATION_PREPROD"
                }
            }
        };

        [Test,TestCaseSource("DeleteServerDetailsParams")]
        public void DeleteServerDetails_isVoidMethod(AdminServerDetails data)
        {
            if (data != null)
            {
                mockIEnvironmentsDataLib.Setup(x => x.SetServerDetails(It.IsAny<CrudModes>(), It.IsAny<AdminServerDetails>())).Verifiable();
                new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null,null).DeleteServerDetails(data);
                mockIEnvironmentsDataLib.Verify();
            }
            else
            {
                new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).DeleteServerDetails(data);
            }
        }


        private static readonly object[] DeleteEnvDetailsParams =
        {
            new object[] { null },
            new object[] {
                new AdminEnvironments
                {
                    ENVT_SID = 1
                }
            }
        };

        [Test,TestCaseSource("DeleteEnvDetailsParams")]
        public void DeleteEnvDetails_isVoidMethod(AdminEnvironments data)
        {
            if (data != null)
            {
                mockIEnvironmentsDataLib.Setup(x => x.SetEnvDetails(It.IsAny<CrudModes>(), It.IsAny<AdminEnvironments>())).Verifiable();
                new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).DeleteEnvDetails(data);
                mockIEnvironmentsDataLib.Verify();
            }
            else
            {
                new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).DeleteEnvDetails(data);
            }
        }


        private static readonly object[] CreateEnvDetailsParams =
        {
            new object[] {
                new AdminEnvironments
                {
                    ENVT_SID = 0,
                    ENVT_NM = "CIN",
                    DB_ENVT_NM = "DEV",
                    DB_VANITY_CONN_STR = "DEVMYDEALSDBAAS.intel.com,3181",
                    DB_SRVR_DTL = "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                    GRAFANA_DASHBOARD_LINK = "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                    MANAGED_OWNERS = "My Deals Leads",
                    WEBISTE_LINK = "https://mydeals-cin.intel.com/Dashboard#/portal",
                    APP_SERVER = "{\"UI_SRVR\":{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                    WIN_JOBS_HOSTED_MCHN = "{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"}",
                    SSIS_SRVR_CONN_STR = "sql3309-fm1-in.amr.corp.intel.com,3180",
                    SSIS_CATALOGUE_FOLDER = "MyDeals_Dev",
                    SSIS_CATALOGUE_SRVR_DTL = "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                    ACTV_IND = Boolean.Parse("true"),
                }
            }
        };

        private AdminEnvironments CreateEnvDetailsMockData()
        {
            AdminEnvironments returnAdminEnvironments = new AdminEnvironments
            {
                ENVT_SID = 0,
                ENVT_NM = "CIN",
                DB_ENVT_NM = "DEV",
                DB_VANITY_CONN_STR = "DEVMYDEALSDBAAS.intel.com,3181",
                DB_SRVR_DTL = "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                GRAFANA_DASHBOARD_LINK = "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                MANAGED_OWNERS = "My Deals Leads",
                WEBISTE_LINK = "https://mydeals-cin.intel.com/Dashboard#/portal",
                APP_SERVER = "{\"UI_SRVR\":{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                WIN_JOBS_HOSTED_MCHN = "{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"}",
                SSIS_SRVR_CONN_STR = "sql3309-fm1-in.amr.corp.intel.com,3180",
                SSIS_CATALOGUE_FOLDER = "MyDeals_Dev",
                SSIS_CATALOGUE_SRVR_DTL = "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                ACTV_IND = Boolean.Parse("true"),
            };
            return returnAdminEnvironments;
        }

      
        [Test,TestCaseSource("CreateEnvDetailsParams")]
        public void CreateEnvDetails_ShouldReturnNotNull_ForNotNullInput(dynamic data)
        {
            var mockData = CreateEnvDetailsMockData();
            mockIEnvironmentsDataLib.Setup(x => x.SetEnvDetails(It.IsAny<CrudModes>(), It.IsAny<AdminEnvironments>())).Returns(mockData);
            var result = new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).CreateEnvDetails(data);
            Assert.IsNotNull(result);
        }



        private static readonly object[] CreateServerDetailsParams =
        {
            new object[] {
                new AdminServerDetails
                {
                    LNKD_SRVR_NM = "dbUTT",
                    ENVT = "ALL",
                    LNKD_SRVR_CONN_DTL = "{\"Remote Connection\":\"sql3896-fm1-in.amr.corp.intel.com\",\"Port\":\"3181\",\"Remote DB\":\"MYDEALS\",\"Provider\":\"SQL Native\",\"Remote User\":\"chip_reader\"}",
                    CHK_QUERY = "IF EXISTS (SELECT top 1 1 FROM dbUTT.mydeals.sys.tables) WAITFOR DELAY '00:00:00'",
                    LST_CHCKD_DTM = System.Convert.ToDateTime("2025-02-24 22:15:21.590"),
                    LS_ERR_TXT = "Demo LS_ERR_TXT",
                    ACTV_IND = Boolean.Parse("true")
                }
            }
        };


        private AdminServerDetails CreateServerDetailsMockData()
        {
            AdminServerDetails returnAdminServerDetails = new AdminServerDetails
            {
                LNKD_SRVR_NM = "dbUTT",
                ENVT = "ALL",
                LNKD_SRVR_CONN_DTL = "{\"Remote Connection\":\"sql3896-fm1-in.amr.corp.intel.com\",\"Port\":\"3181\",\"Remote DB\":\"MYDEALS\",\"Provider\":\"SQL Native\",\"Remote User\":\"chip_reader\"}",
                CHK_QUERY = "IF EXISTS (SELECT top 1 1 FROM dbUTT.mydeals.sys.tables) WAITFOR DELAY '00:00:00'",
                LST_CHCKD_DTM = System.Convert.ToDateTime("2025-02-24 22:15:21.590"),
                LS_ERR_TXT = "Demo LS_ERR_TXT",
                ACTV_IND = Boolean.Parse("true")
            };
            return returnAdminServerDetails;
        }


        [Test,TestCaseSource("CreateServerDetailsParams")]
        public void CreateServerDetails_ShouldReturnNotNull_ForNotNullInput(dynamic data)
        {
            var mockData = CreateServerDetailsMockData();
            mockIEnvironmentsDataLib.Setup(x => x.SetServerDetails(It.IsAny<CrudModes>(), It.IsAny<AdminServerDetails>())).Returns(mockData);
            var result = new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).CreateServerDetails(data);
            Assert.IsNotNull(result);
        }


        private AdminEnvironments UpdateEnvDetails_mockData()
        {
            AdminEnvironments returnAdminEnvironments = new AdminEnvironments
            {
                ENVT_SID = 0,
                ENVT_NM = "CIN",
                DB_ENVT_NM = "DEV",
                DB_VANITY_CONN_STR = "DEVMYDEALSDBAAS.intel.com,3181",
                DB_SRVR_DTL = "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                GRAFANA_DASHBOARD_LINK = "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                MANAGED_OWNERS = "My Deals Leads",
                WEBISTE_LINK = "https://mydeals-cin.intel.com/Dashboard#/portal",
                APP_SERVER = "{\"UI_SRVR\":{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                WIN_JOBS_HOSTED_MCHN = "{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"}",
                SSIS_SRVR_CONN_STR = "sql3309-fm1-in.amr.corp.intel.com,3180",
                SSIS_CATALOGUE_FOLDER = "MyDeals_Dev",
                SSIS_CATALOGUE_SRVR_DTL = "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                ACTV_IND = Boolean.Parse("true"),
            };
            return returnAdminEnvironments;
        }

        private static readonly object[] UpdateEnvDetails_param =
        {
            new object[]{
                1,
                "PROD",
                "PROD",
                "DEVMYDEALSDBAAS.intel.com,3181",
                "{\"CONN_STR\":\"sql3877-fm1-in.amr.corp.intel.com\",\"PORT\":\"3181\",\"SQL_Version\":\"SQL2022\",\"COMPATIBILITY LEVEL\":\"SQL Server 2019 (150)\",\"COLLATION\":\"Latin1_General_CI_AS\",\"NODES\":{\"1\":\"d1fm1sql676\\\\sql02\",\"2\":\"d2fm1sql676\\\\sql02\"},\"AG_GROUP\":\"AG02\",\"INSTANCE SHARING\":\"Shared (DEV, ITT, EUT, DAY1 & Other Application at AG01)\",\"RAM\":\"4 GB\",\"CPU\":\"4 Core\"}",
                "https://thanos.dbaas.intel.com/grafana/d/ms-sql-vip/ms-sql-vip?var-vip_name=sql3877-fm1-in&orgId=1",
                "My Deals Leads",
                "https://mydeals-cin.intel.com/Dashboard#/portal",
                "{\"UI_SRVR\":{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"},\"APP_SRVR\":{\"1\":\"NA\"}}",
                "{\"1\":\"HF2CINMYDLW01.amr.corp.intel.com\"}",
                "sql3309-fm1-in.amr.corp.intel.com,3180",
                "MyDeals_Dev",
                "{\"SQL Version\":\"SSIS19\",\"Compatibility Level\":\"SQL Server 2019 (150)\",\"Collation\":\"SQL_Latin1_General_CP1_CI_AS\",\"Instance Sharing\":\"Shared\"}",
                "false"
            } 
        };

        [Test,
            TestCaseSource("UpdateEnvDetails_param")]
        public void UpdateEnvDetails_ShouldReturnNotNull(dynamic data)
        {
            var mockData = UpdateEnvDetails_mockData();
            var inputData = new AdminEnvironments
            {
                ENVT_SID = data[0],
                ENVT_NM = data[1],
                DB_ENVT_NM = data[2],
                DB_VANITY_CONN_STR = data[3],
                DB_SRVR_DTL = data[4],
                GRAFANA_DASHBOARD_LINK = data[5],
                MANAGED_OWNERS = data[6],
                WEBISTE_LINK = data[7],
                APP_SERVER = data[8],
                WIN_JOBS_HOSTED_MCHN = data[9],
                SSIS_SRVR_CONN_STR = data[10],
                SSIS_CATALOGUE_FOLDER = data[11],
                SSIS_CATALOGUE_SRVR_DTL = data[12],
                ACTV_IND = Boolean.Parse(data[13])
            };
            mockIEnvironmentsDataLib.Setup(x => x.SetEnvDetails(It.IsAny<CrudModes>(), It.IsAny<AdminEnvironments>())).Returns(mockData);
            var res = new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).UpdateEnvDetails(inputData);
            Assert.IsNotNull(res);
        }


        private AdminServerDetails UpdateServerDetails_mockData()
        {
            AdminServerDetails returnAdminServerDetails = new AdminServerDetails
            {
                LNKD_SRVR_NM = "dbUTT",
                ENVT = "ALL",
                LNKD_SRVR_CONN_DTL = "{\"Remote Connection\":\"sql3896-fm1-in.amr.corp.intel.com\",\"Port\":\"3181\",\"Remote DB\":\"MYDEALS\",\"Provider\":\"SQL Native\",\"Remote User\":\"chip_reader\"}",
                CHK_QUERY = "IF EXISTS (SELECT top 1 1 FROM dbUTT.mydeals.sys.tables) WAITFOR DELAY '00:00:00'",
                LST_CHCKD_DTM = System.Convert.ToDateTime("2025-02-24 22:15:21.590"),
                LS_ERR_TXT = "Demo LS_ERR_TXT",
                ACTV_IND = Boolean.Parse("true"),
            };
            return returnAdminServerDetails;
        }

        private static readonly object[] UpdateServerDetails_param =
        {
            new object[]{
                "dbUTT",
                "ALL",
                "{\"Remote Connection\":\"sql3896-fm1-in.amr.corp.intel.com\",\"Port\":\"3181\",\"Remote DB\":\"MYDEALS\",\"Provider\":\"SQL Native\",\"Remote User\":\"chip_reader\"}",
                "IF EXISTS (SELECT top 1 1 FROM dbUTT.mydeals.sys.tables) WAITFOR DELAY '00:00:00'",
                "2025-02-24 22:15:21.590",
                "Demo LS_ERR_TXT",
                "false"
            }
        };

        [Test,
          TestCaseSource("UpdateServerDetails_param")]
        public void UpdateServerDetails_ShouldReturnNotNull(dynamic data)
        {
            var mockData = UpdateServerDetails_mockData();
            var inputData = new AdminServerDetails
            {
                LNKD_SRVR_NM = data[0],
                ENVT = data[1],
                LNKD_SRVR_CONN_DTL = data[2],
                CHK_QUERY = data[3],
                LST_CHCKD_DTM = System.Convert.ToDateTime(data[4]),
                LS_ERR_TXT = data[5],
                ACTV_IND = Boolean.Parse(data[6])
            };
            mockIEnvironmentsDataLib.Setup(x => x.SetServerDetails(It.IsAny<CrudModes>(), It.IsAny<AdminServerDetails>())).Returns(mockData);
            var res = new EnvironmentsLib(mockIEnvironmentsDataLib.Object, null, null).UpdateServerDetails(inputData);
            Assert.IsNotNull(res);
        }




    }
}
