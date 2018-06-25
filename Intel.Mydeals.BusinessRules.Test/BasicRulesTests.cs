using System;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Force.DeepCloner;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.Mydeals.BusinessRules.Test
{
    [TestFixture]
    public class BasicRulesTests
    {

        private OpUserToken PersonalizedOpUserToken { get; set; }

        private MyDealsData ComplexContract => _complexContract ?? (_complexContract = UnitTestHelpers.BuildSimpleContract());
        private MyDealsData _complexContract;

        private List<MyOpRule> Rules => _rules ?? (_rules = MyRulesConfiguration.AttrbRules);
        private List<MyOpRule> _rules;

        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started BasicRules Library Tests.");
            PersonalizedOpUserToken = new OpUserToken
            {
                Role = new OpRoleType
                {
                    RoleTypeCd = "GA"
                },
                Usr = new OpUser
                {
                    FirstName = "Philip",
                    LastName = "Eckenroth",
                    WWID = 10505693,
                    Idsid = "Pweckenr"
                }
            };
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed BasicRules Library Tests.");
        }

        #region helper functions

        private void RunRequiredBackdateRule(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, string startDate, string backRsn, string backRsnTxt, bool expectedResult)
        {
            dc.SetDataElement(Attributes.START_DT, startDate);
            dc.SetDataElement(Attributes.BACK_DATE_RSN, backRsn);
            dc.SetDataElement(Attributes.BACK_DATE_RSN_TXT, backRsnTxt);
            RunRule(myDealsData, dc, rule);
            if (expectedResult)
            {
                Assert.IsTrue(dc.GetDataElement(AttributeCodes.BACK_DATE_RSN).IsRequired);
            }
            else
            {
                Assert.IsFalse(dc.GetDataElement(AttributeCodes.BACK_DATE_RSN).IsRequired);
            }
            dc.GetDataElement(AttributeCodes.BACK_DATE_RSN).IsRequired = false;
        }

        private void RunRequiredRule(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, MyDealsAttribute atrb, bool expectedResult)
        {
            RunRule(myDealsData, dc, rule);
            IOpDataElement de = dc.GetDataElement(atrb.ATRB_COL_NM);
            if (expectedResult)
            {
                Assert.IsTrue(de.IsRequired);
            }
            else
            {
                Assert.IsFalse(de.IsRequired);
            }
            de.IsRequired = false;
        }

        private void RunReadOnlyRule(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, MyDealsAttribute atrb, bool expectedResult)
        {
            RunRule(myDealsData, dc, rule);
            IOpDataElement de = dc.GetDataElement(atrb.ATRB_COL_NM);
            if (expectedResult)
            {
                Assert.IsTrue(de.IsReadOnly);
            }
            else
            {
                Assert.IsFalse(de.IsReadOnly);
            }
            de.IsReadOnly = false;
        }

        private void RunReadOnlyRules(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, List<MyDealsAttribute> atrbs, bool expectedResult)
        {
            foreach (MyDealsAttribute myAtrb in atrbs)
            {
                RunReadOnlyRule(myDealsData, dc, rule, myAtrb, expectedResult);
            }
        }

        private List<MyDealsAttribute> GetMyDealsAttributes(OpDataCollector dc, IEnumerable<string> atrbs)
        {
            List<MyDealsAttribute> readOnlyAtrbs = new List<MyDealsAttribute>();
            foreach (string atrb in atrbs)
            {
                FieldInfo fieldInfo = typeof(Attributes).GetField(atrb);
                if (fieldInfo == null) continue;
                MyDealsAttribute myAtrb = (MyDealsAttribute)fieldInfo.GetValue(null);
                readOnlyAtrbs.Add(myAtrb);
                dc.SetDataElement(myAtrb, "Some Value");
            }

            return readOnlyAtrbs;
        }

        private static bool RunRule(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            bool dataHasValidationErrors = false;
            dc.Message.Clear();
            dc.ClearValidationMessages();

            OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.RunAction(dc, rule, securityActionCache, args);
            myDealsData.RollupValidationMessages(dc, new List<OpDataElementType>(), ref dataHasValidationErrors);

            return !dc.Message.IsAlerts;
        }

        private static bool RunRuleKeepValidationMsgs(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            bool dataHasValidationErrors = false;

            OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.RunAction(dc, rule, securityActionCache, args);
            myDealsData.RollupValidationMessages(dc, new List<OpDataElementType>(), ref dataHasValidationErrors);

            return !dc.Message.IsAlerts;
        }

        private void SetupStageAndRole(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, string roleType, string psInitStage, string wipInitStage, string psStage, string wipStage, MyDealsAttribute atrb, object initVal, object targetVal)
        {
            PersonalizedOpUserToken.Role.RoleTypeCd = roleType;
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);

            dc.SetDataElement(Attributes.PS_WF_STG_CD, psInitStage);
            dc.SetDataElement(Attributes.WF_STG_CD, wipInitStage);
            dc.SetDataElement(atrb, initVal);

            // ensure not change triggers are set
            foreach (OpDataElement de in dc.DataElements)
            {
                de.PrevAtrbValue = de.OrigAtrbValue = de.AtrbValue;
                de.State = OpDataElementState.Unchanged;
            }

            dc.SetDataElement(atrb, targetVal);

            RunRule(myDealsData, dc, rule, null, myDealsData);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.PS_WF_STG_CD) == psStage);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.WF_STG_CD) == wipStage);
        }

        private void RunRequiredRebtTypeProdCat(MyDealsData myDealsData, OpDataCollector dc, MyOpRule rule, string rebtType, string prdCat, string hasL1, bool expectedResult)
        {
            dc.SetDataElement(Attributes.REBATE_TYPE, rebtType);
            dc.SetDataElement(Attributes.PRODUCT_CATEGORIES, prdCat);
            dc.SetDataElement(Attributes.HAS_L1, hasL1);
            RunRequiredRule(myDealsData, dc, rule, Attributes.MEETCOMP_TEST_FAIL_OVERRIDE, expectedResult);
        }

        #endregion

        [TestCase]
        public void BasicRules_Positive_Volume()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Must have a positive value");

            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault();

            // Get orig so we can replace it at the end
            var origVal = dc.GetDataElement(AttributeCodes.FRCST_VOL);

            dc.SetDataElement(Attributes.VOLUME, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, origVal);


            dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            // Get orig so we can replace it at the end
            origVal = dc.GetDataElement(AttributeCodes.FRCST_VOL);

            dc.SetDataElement(Attributes.VOLUME, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.VOLUME, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, origVal);

        }

        [TestCase]
        public void BasicRules_Positive_Forecast_Volume()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Forecast Volume must have a positive or zero value");

            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault();

            // Get orig so we can replace it at the end
            var origVal = dc.GetDataElement(AttributeCodes.FRCST_VOL);

            dc.SetDataElement(Attributes.FRCST_VOL, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, origVal);


            dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            // Get orig so we can replace it at the end
            origVal = dc.GetDataElement(AttributeCodes.FRCST_VOL);

            dc.SetDataElement(Attributes.FRCST_VOL, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.FRCST_VOL, origVal);
        }

        [TestCase]
        public void BasicRules_Positive_or_Zero()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Value cannot be negative");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            // Get orig so we can replace it at the end
            var origVal = dc.GetDataElement(AttributeCodes.USER_AVG_RPU);

            dc.SetDataElement(Attributes.USER_AVG_RPU, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));
            
            dc.SetDataElement(Attributes.USER_AVG_RPU, 0);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.USER_AVG_RPU, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.USER_AVG_RPU, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.USER_AVG_RPU, origVal);

        }

        [TestCase]
        public void BasicRules_Clear_Sys_Comments()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Clear SYS_COMMENTS field upon load");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.SYS_COMMENTS, "Some Text");
            RunRule(myDealsData, dc, rule);
            string val = dc.GetDataElementValue(AttributeCodes.SYS_COMMENTS);
            Assert.IsTrue(string.IsNullOrEmpty(val));

        }

        [TestCase]
        public void BasicRules_Atrb_Changed_Timeline()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Check for Atrb Changes for TimeLine");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.SYS_COMMENTS, "");
            dc.SetDataElement(Attributes.NOTES, "");

            IOpDataElement de = dc.GetDataElement(AttributeCodes.NOTES);
            de.AtrbValue = de.PrevAtrbValue = de.OrigAtrbValue = "";
            de.State = OpDataElementState.Unchanged;
            de.AtrbValue = "";

            RunRule(myDealsData, dc, rule);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.SYS_COMMENTS) == "");

            de = dc.GetDataElement(AttributeCodes.WF_STG_CD);
            de.AtrbValue = de.PrevAtrbValue = de.OrigAtrbValue = "Requested";
            de.State = OpDataElementState.Unchanged;
            de.AtrbValue = "Submitted";

            RunRule(myDealsData, dc, rule);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.SYS_COMMENTS) != "");

        }

        [TestCase]
        public void BasicRules_Major_Change_Stages()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();
            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Check for Major Changes");
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            var origRole = PersonalizedOpUserToken.Role.RoleTypeCd;

            SetupStageAndRole(myDealsData, dc, rule, "FSE", "Accepted", "Active", "Draft", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Requested", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "DA", "Accepted", "Active", "Draft", "Draft", Attributes.VOLUME, 100, 101);

            SetupStageAndRole(myDealsData, dc, rule, "FSE", "Pending", "Active", "Draft", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Pending", "Active", "Requested", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "DA", "Pending", "Active", "Draft", "Draft", Attributes.VOLUME, 100, 101);

            SetupStageAndRole(myDealsData, dc, rule, "FSE", "Draft", "Draft", "Draft", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Requested", "Draft", "Requested", "Draft", Attributes.VOLUME, 100, 101);
            SetupStageAndRole(myDealsData, dc, rule, "DA", "Requested", "Draft", "Requested", "Draft", Attributes.VOLUME, 100, 101);

            PersonalizedOpUserToken.Role.RoleTypeCd = origRole;
        }

        [TestCase]
        public void BasicRules_Major_Change_Triggers()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();  // need to copy obj
            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Check for Major Changes");
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            var origRole = PersonalizedOpUserToken.Role.RoleTypeCd;
            
            // Increase
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Requested", "Draft", Attributes.VOLUME, 100, 101); // major
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Accepted", "Active", Attributes.START_DT, "8/2/2018", "8/3/2018"); // minor

            // Decrease
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Requested", "Draft", Attributes.START_DT, "8/2/2018", "8/1/2018"); // major
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Accepted", "Active", Attributes.VOLUME, 100, 99); // minor

            // Change
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Requested", "Draft", Attributes.ECAP_PRICE, "100", "90"); // major
            SetupStageAndRole(myDealsData, dc, rule, "GA", "Accepted", "Active", "Accepted", "Active", Attributes.NOTES, "Hello World", "Hi"); // minor

            PersonalizedOpUserToken.Role.RoleTypeCd = origRole;
        }

        [TestCase]
        public void BasicRules_Ecap_Price()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Validate ECAP Price");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<object> badVals = new List<object> { "", "abc", 0, -10 };
            List<object> goodVals = new List<object> { 1, 100, 10.50 };

            foreach (object val in badVals)
            {
                dc.SetDataElement(Attributes.ECAP_PRICE, val);
                Assert.IsFalse(RunRule(myDealsData, dc, rule));
            }

            foreach (object val in goodVals)
            {
                dc.SetDataElement(Attributes.ECAP_PRICE, val);
                Assert.IsTrue(RunRule(myDealsData, dc, rule));
            }

            dc.SetDataElement(Attributes.ECAP_PRICE, 100);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_TYPE, "SEED");
            dc.SetDataElement(Attributes.ECAP_PRICE, 0);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_TYPE, "SEED");
            dc.SetDataElement(Attributes.ECAP_PRICE, -10);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_TYPE, "MCP");
            dc.SetDataElement(Attributes.ECAP_PRICE, -10);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_TYPE, "MCP");
            dc.SetDataElement(Attributes.ECAP_PRICE, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));


        }

        [TestCase]
        public void BasicRules_Overarching()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Overarching Validation");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.REBATE_DEAL_ID, "12345");

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "101");
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "100");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "");
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "abc");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "101.50");
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "10g1");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            //negative value test
            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "-100");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "-101");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            //if user adds an overarching deal id, then one but not both overarching max values are required
            dc.SetDataElement(Attributes.REBATE_DEAL_ID, "12345");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "100");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "101");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_DEAL_ID, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "101");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_DEAL_ID, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "100");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.REBATE_DEAL_ID, "12345");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_VOL, "");
            dc.SetDataElement(Attributes.REBATE_OA_MAX_AMT, "");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Backdating()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Required if Backdate Needed");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            string pastDate = DateTime.Now.AddDays(-1).ToString("MM/dd/yyyy");
            string futureDate = DateTime.Now.AddDays(+1).ToString("MM/dd/yyyy");

            RunRequiredBackdateRule(myDealsData, dc, rule, futureDate, "", "", false);
            RunRequiredBackdateRule(myDealsData, dc, rule, pastDate, "", "", false);
            RunRequiredBackdateRule(myDealsData, dc, rule, pastDate, "", "Because", true);
            RunRequiredBackdateRule(myDealsData, dc, rule, pastDate, "Because", "", true);
        }

        [TestCase]
        public void BasicRules_Forecast_Volume()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Forecast Volume required if L1");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.FRCST_VOL, "");
            dc.SetDataElement(Attributes.HAS_L1, "1");
            RunRequiredRule(myDealsData, dc, rule, Attributes.FRCST_VOL, true);

            dc.SetDataElement(Attributes.FRCST_VOL, "");
            dc.SetDataElement(Attributes.HAS_L1, "0");
            RunRequiredRule(myDealsData, dc, rule, Attributes.FRCST_VOL, false);

        }

        [TestCase]
        public void BasicRules_If_User_Defined_RPU()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Required if User Defined RPU");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.USER_MAX_RPU, "");
            dc.SetDataElement(Attributes.USER_AVG_RPU, "");
            dc.SetDataElement(Attributes.RPU_OVERRIDE_CMNT, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.RPU_OVERRIDE_CMNT, false);

            dc.SetDataElement(Attributes.USER_MAX_RPU, 100);
            dc.SetDataElement(Attributes.USER_AVG_RPU, "");
            dc.SetDataElement(Attributes.RPU_OVERRIDE_CMNT, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.RPU_OVERRIDE_CMNT, true);

            dc.SetDataElement(Attributes.USER_MAX_RPU, "");
            dc.SetDataElement(Attributes.USER_AVG_RPU, 100);
            dc.SetDataElement(Attributes.RPU_OVERRIDE_CMNT, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.RPU_OVERRIDE_CMNT, true);

            dc.SetDataElement(Attributes.USER_MAX_RPU, 100);
            dc.SetDataElement(Attributes.USER_AVG_RPU, 100);
            dc.SetDataElement(Attributes.RPU_OVERRIDE_CMNT, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.RPU_OVERRIDE_CMNT, true);

        }

        [TestCase]
        public void BasicRules_Ecap_Adj()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Required if ECAP Adjustment");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.REBATE_TYPE, "ECAP ADJ");
            dc.SetDataElement(Attributes.ORIG_ECAP_TRKR_NBR, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.ORIG_ECAP_TRKR_NBR, true);

            dc.SetDataElement(Attributes.REBATE_TYPE, "TENDER");
            dc.SetDataElement(Attributes.ORIG_ECAP_TRKR_NBR, "");
            RunRequiredRule(myDealsData, dc, rule, Attributes.ORIG_ECAP_TRKR_NBR, false);

        }

        [TestCase]
        public void BasicRules_MCP_Or_Pullin_CPU_Or_CS()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Required if MCP or PullIn and CPU ior CS");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();
            dc.SetDataElement(Attributes.MEETCOMP_TEST_FAIL_OVERRIDE, "Has Value");

            OpUserStack.Delete();
            OpUserStack.EmulateUnitTester(new OpUserToken
            {
                Role = new OpRoleType
                {
                    RoleTypeCd = "FSE"
                },
                Usr = new OpUser
                {
                    FirstName = "Philip",
                    LastName = "Eckenroth",
                    WWID = 10505693,
                    Idsid = "Pweckenr"
                }
            });

            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "MCP", "CPU", "1", true);
            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "PULL-IN MCP", "CPU", "1", true);
            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "MCP", "CS", "1", true);
            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "PULL-IN MCP", "CS", "1", true);

            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "NOT MCP", "CPU", "1", false);
            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "MCP", "NOT CPU", "1", false);


            OpUserStack.Delete();
            OpUserStack.EmulateUnitTester(new OpUserToken
            {
                Role = new OpRoleType
                {
                    RoleTypeCd = "GA"
                },
                Usr = new OpUser
                {
                    FirstName = "Philip",
                    LastName = "Eckenroth",
                    WWID = 10505693,
                    Idsid = "Pweckenr"
                }
            });

            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "MCP", "CPU", "0", false);
            RunRequiredRebtTypeProdCat(myDealsData, dc, rule, "PULL-IN MCP", "CPU", "0", false);
            
        }

        [TestCase]
        public void BasicRules_Positive_Rate()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Rate must have a positive value");

            int dcId = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "VOL_TIER")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, "3"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 0, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.STRT_VOL, 101, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 4, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.STRT_VOL, 201, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.END_VOL, 300, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.RATE, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3)))
            });
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.RATE, -5, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
            });
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 10, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 0, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
            });
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Positive_Start_Vol()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Must be greater than 0 Start Vol");

            int dcId = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "VOL_TIER")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, "3"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.STRT_VOL, 101, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 4, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.STRT_VOL, 201, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.END_VOL, 300, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.RATE, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3)))
            });
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.STRT_VOL, 0, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.STRT_VOL, -5, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Positive_End_Vol()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Must be greater than 0 End Vol");

            int dcId = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "VOL_TIER")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, "3"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.STRT_VOL, 101, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 4, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.STRT_VOL, 201, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.END_VOL, 300, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.RATE, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3)))
            });
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.END_VOL, 0, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.END_VOL, -5, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Rollup_Error_Message()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Rollup Error Message");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            Assert.IsTrue(dc.Message.HighestMessageType == "");

            dc.SetDataElement(Attributes.VOLUME, -100);
            IOpDataElement de = dc.GetDataElement(AttributeCodes.VOLUME);
            de.AddMessage("Volume must be positive");

            RunRuleKeepValidationMsgs(myDealsData, dc, rule);

            Assert.IsFalse(dc.Message.HighestMessageType == "");
            Assert.IsTrue(dc.Message.HighestMessageType == "Warning");
        }

        [TestCase]
        public void BasicRules_Positive_Num_Tiers()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Must have a positive Num Tiers value");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            var origVal = dc.GetDataElement(AttributeCodes.NUM_OF_TIERS);

            dc.SetDataElement(Attributes.NUM_OF_TIERS, 5);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.NUM_OF_TIERS, 0);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.NUM_OF_TIERS, -5);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Enforce_Required()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Enforce Required Fields");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            IOpDataElement de = dc.GetDataElement(AttributeCodes.START_DT);
            de.IsRequired = true;

            dc.SetDataElement(Attributes.START_DT, "1/1/2018");
            RunRule(myDealsData, dc, rule);
            Assert.IsFalse(de.ValidationMessage == "Start Date is required\n");

            dc.SetDataElement(Attributes.START_DT, "");
            RunRule(myDealsData, dc, rule);
            Assert.IsTrue(de.ValidationMessage == "Start Date is required\n");

        }

        [TestCase]
        public void BasicRules_Qty_Positive()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Quantity must be greater than 0");

            int dcId = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "KIT")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, 3),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.QTY, 1, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.QTY, 1, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(20,2))),
                new OpDeTestItem(Attributes.QTY, 2, new OpAtrbMapCollection(new OpAtrbMap(20,2)))
            });

            dc.SetDataElement(Attributes.QTY, 5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.QTY, 0, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.QTY, -5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Qty_Whole_Nbr()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Qty must be a whole number");

            int dcId = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "KIT")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, 3),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.QTY, 1, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.QTY, 1, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(20,2))),
                new OpDeTestItem(Attributes.QTY, 2, new OpAtrbMapCollection(new OpAtrbMap(20,2)))
            });

            dc.SetDataElement(Attributes.QTY, 5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.QTY, "abc", new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.QTY, 5.5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Tiered_ECAP()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Tiered ECAP value check");

            int dcId = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "KIT")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, 3),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.ECAP_PRICE, 100, new OpAtrbMapCollection(new OpAtrbMap(20,0))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.ECAP_PRICE, 90, new OpAtrbMapCollection(new OpAtrbMap(20,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(20,2))),
                new OpDeTestItem(Attributes.ECAP_PRICE, 80, new OpAtrbMapCollection(new OpAtrbMap(20,2)))
            });

            dc.SetDataElement(Attributes.ECAP_PRICE, 5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.ECAP_PRICE, 0, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.ECAP_PRICE, -5, new OpAtrbMapCollection(new OpAtrbMap(20, 1)));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_End_Vol_Greater_Than_Start_Vol()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "End Vol must be greater than start vol");

            int dcId = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && d.AtrbValue.ToString() == "VOL_TIER")
                .Select(d => d.DcID).FirstOrDefault();
            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault(d => d.DcID == dcId);

            // define 3 tiers
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, "3"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.STRT_VOL, 101, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 4, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.STRT_VOL, 201, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.END_VOL, 300, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.RATE, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3)))
            });
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.STRT_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            dc.SetDataElement(new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.STRT_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            dc.SetDataElement(new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(new OpDeTestItem(Attributes.STRT_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            dc.SetDataElement(new OpDeTestItem(Attributes.END_VOL, 50, new OpAtrbMapCollection(new OpAtrbMap(10, 1))));
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Check_For_Expire_Flag()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Check for Expire Flag");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            string pastDate = DateTime.Now.AddDays(-1).ToString("MM/dd/yyyy");
            string futureDate = DateTime.Now.AddDays(+1).ToString("MM/dd/yyyy");

            dc.SetDataElement(Attributes.END_DT, futureDate);
            dc.SetDataElement(Attributes.EXPIRE_FLG, "0");
            RunRule(myDealsData, dc, rule);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.EXPIRE_FLG) == "0");

            dc.SetDataElement(Attributes.END_DT, pastDate);
            dc.SetDataElement(Attributes.EXPIRE_FLG, "0");
            RunRule(myDealsData, dc, rule);
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.EXPIRE_FLG) == "1");

        }

        [TestCase]
        public void BasicRules_Exceed_Max_Limit()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Does not exceed max character limit");

            OpDataCollector dc = myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.FirstOrDefault();

            dc.SetDataElement(Attributes.TITLE, "Short Title");
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.TITLE, "Long Title... I mean a really long titile that should not be allowed to save because it is just way too long!!!");
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_End_Date_Later_Start_Date()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Make sure End Date is later than Start Date");

            OpDataCollector dc = myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.FirstOrDefault();

            string pastDate = DateTime.Now.AddDays(-1).ToString("MM/dd/yyyy");
            string futureDate = DateTime.Now.AddDays(+1).ToString("MM/dd/yyyy");

            dc.SetDataElement(Attributes.START_DT, pastDate);
            dc.SetDataElement(Attributes.END_DT, futureDate);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.START_DT, pastDate);
            dc.SetDataElement(Attributes.END_DT, pastDate);
            Assert.IsTrue(RunRule(myDealsData, dc, rule));

            dc.SetDataElement(Attributes.START_DT, futureDate);
            dc.SetDataElement(Attributes.END_DT, pastDate);
            Assert.IsFalse(RunRule(myDealsData, dc, rule));

        }

        [TestCase]
        public void BasicRules_Readonly_If_Tracker()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Tracker Exists");
            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Tracker_Tbl_Row()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Tracker Exists Table Row Only");
            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Frontend_Tracker()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly for Frontend With Tracker");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();
            dc.SetDataElement(Attributes.DEAL_DESC, "Some Value");

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.DEAL_DESC, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.DEAL_DESC, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.DEAL_DESC, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.DEAL_DESC, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Frontend_No_Tracker()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly for Frontend With No Tracker (Expire YCS2 Flag)");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();
            dc.SetDataElement(Attributes.EXPIRE_YCS2, "Some Value");

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.EXPIRE_YCS2, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.EXPIRE_YCS2, false);

            dc.SetDataElement(Attributes.HAS_TRACKER, "0");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.EXPIRE_YCS2, true);

            dc.SetDataElement(Attributes.HAS_TRACKER, "1");
            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.EXPIRE_YCS2, false);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Cancelled()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Cancelled");
            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.IS_CANCELLED, "0");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.IS_CANCELLED, "1");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Not_Tender()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if not TENDER");
            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.REBATE_TYPE, "TENDER");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.REBATE_TYPE, "MCP");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Not_SvrWS()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Server Deal Type Read Only if Product is not SvrWS");

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();
            dc.SetDataElement(Attributes.SERVER_DEAL_TYPE, "Some Value");

            dc.SetDataElement(Attributes.PRODUCT_CATEGORIES, "DT,SvrWS");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.SERVER_DEAL_TYPE, false);

            dc.SetDataElement(Attributes.PRODUCT_CATEGORIES, "DT,MBL");
            RunReadOnlyRule(myDealsData, dc, rule, Attributes.SERVER_DEAL_TYPE, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Backend_Deal()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Backend Deal");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Frontend_Deal()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Frontend Deal");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Expire_Flag_Yes()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Expire YCS2 flag is Yes");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.EXPIRE_YCS2, "No");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.EXPIRE_YCS2, "Yes");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_No_CS()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if no chipset");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.PRODUCT_CATEGORIES, "CS, CPU");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.PRODUCT_CATEGORIES, "CPU, Dt");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_Wip_Always()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly WIP/Deal ALWAYS");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_Always()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly ALWAYS");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_Ptr_Always()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly PTR ALWAYS");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_Backdate()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly backdate if in the past");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            string pastDate = DateTime.Now.AddDays(-1).ToString("MM/dd/yyyy");
            string futureDate = DateTime.Now.AddDays(+1).ToString("MM/dd/yyyy");

            dc.SetDataElement(Attributes.START_DT, pastDate);
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.START_DT, futureDate);
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Not_Consumption()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Not Consumption");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.PAYOUT_BASED_ON, "Consumption");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.PAYOUT_BASED_ON, "Billings");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

        }

        [TestCase]
        public void BasicRules_Readonly_If_Not_Backend_Deal()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if Not Backend");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Backend");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.PROGRAM_PAYMENT, "Frontend YCS2");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);
        }

        [TestCase]
        public void BasicRules_Readonly_If_Geo_WW()
        {
            MyDealsData myDealsData = ComplexContract.DeepClone();

            MyOpRule rule = Rules.FirstOrDefault(r => r.Title == "Readonly if geo is WW");

            string[] atrbs = rule.OpRuleActions[0].Target;

            OpDataCollector dc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault();

            List<MyDealsAttribute> readOnlyAtrbs = GetMyDealsAttributes(dc, atrbs);

            dc.SetDataElement(Attributes.GEO_COMBINED, "ASMO,APAC");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, false);

            dc.SetDataElement(Attributes.GEO_COMBINED, "WW");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);

            dc.SetDataElement(Attributes.GEO_COMBINED, "WorldWide");
            RunReadOnlyRules(myDealsData, dc, rule, readOnlyAtrbs, true);
        }

    }
}
