using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Intel.RulesEngine;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class RuleEngineDataLib : IRuleEngineDataLib
    {
        /// <summary>
        /// Get All RuleSets
        /// </summary>
        /// <returns>list of all rule set data</returns>
        public List<RuleSet> GetRuleSets()
        {
            var ret = new List<RuleSet>();
            //var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                //using (var rdr = DataAccess.ExecuteReader(cmd))
                //{
                //    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

                //    while (rdr.Read())
                //    {
                //        ret.Add(new RuleSet     //TODO: the data returned my SP may not be a ruleset and will need to be converted once retrieved.
                //        {
                //            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                //        });
                //    }
                //}
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            //DELETE ME once implemented above
            int i = 20;
            while (i > 0)
            {
                RuleSet rs = new RuleSet();
                rs.Id = i;
                rs.Name = "RuleSet " + i + ": ";
                rs.Description = "This is one of many hardcoded example rule sets";
                rs.Category = "DEAL";
                
                rs.RuleId = i;
                rs.Order = i;

                if (i % 2 == 0)
                {
                    rs.SubCategory = "ECAP";
                    rs.Name += "ECAP ";
                }
                else
                {
                    rs.SubCategory = "VOLTIER";
                    rs.Name += "VOLTIER ";
                }

                if (i % 3 == 0)
                {
                    rs.Trigger = "SAVE";
                    rs.Name += "SAVE ";
                } else if (i %3 == 1)
                {
                    rs.Trigger = "DELETE";
                    rs.Name += "DEL ";
                } else
                {
                    rs.Trigger = "LOAD";
                    rs.Name += "LOAD ";
                }

                ret.Add(rs);
                i--;
            }

            return ret;
        }

        /// <summary>
        /// Get All Rule Items
        /// </summary>
        /// <returns>list of rule item data</returns>
        public List<RuleItem> GetRuleItems()
        {
            var ret = new List<RuleItem>();
            //var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                //using (var rdr = DataAccess.ExecuteReader(cmd))
                //{
                //    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

                //    while (rdr.Read())
                //    {
                //        ret.Add(new RuleSet     //TODO: the data returned my SP may not be a ruleset and will need to be converted once retrieved.
                //        {
                //            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                //        });
                //    }
                //}
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            //DELETE ME once implemented above
            int i = 20;
            while (i > 0)
            {
                RuleItem ri = new RuleItem();
                ri.Id = i;
                //ri.Name = "RuleItem " + i;
                //ri.Description = "This is one of many rule items";
                //ri.ErrorMessage = "IsErrorMsgNecessary?";
                ri.Tier = "C#";
                ri.RuleConditionId = i;
                ri.RulePassedTaskIds = new List<int>() { i, i+20 }; ;
                ri.RuleFailedTaskIds = new List<int>() { i+40 };

                ret.Add(ri);
                i--;
            }

            return ret;
        }

        /// <summary>
        /// Get All Rule Conditions
        /// </summary>
        /// <returns>list of rule condition data</returns>
        public List<RuleCondition> GetRuleConditions()
        {
            var ret = new List<RuleCondition>();
            //var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                //using (var rdr = DataAccess.ExecuteReader(cmd))
                //{
                //    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

                //    while (rdr.Read())
                //    {
                //        ret.Add(new RuleSet     //TODO: the data returned my SP may not be a ruleset and will need to be converted once retrieved.
                //        {
                //            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                //        });
                //    }
                //}
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            //DELETE ME once implemented above
            int i = 20;
            int j = 20;
            while (i > 0)
            {
                RuleCondition ri = new RuleCondition();
                ri.Id = i;
                ri.ConditionType = "AND";
                ri.Operator = "";
                ri.LeftExpressionType = "";
                ri.LeftExpressionValue = "";
                ri.RightExpressionType = "";
                ri.RightExpressionValue = "";
                ri.RuleId = i;

                RuleCondition ri2 = new RuleCondition();
                ri2.Id = ri.Id + j;
                ri2.ConditionType = "CONDITION";
                ri2.Operator = ">";
                ri2.LeftExpressionType = "Product";
                ri2.LeftExpressionValue = "Start Date";
                ri2.RightExpressionType = "User Defined";
                ri2.RightExpressionValue = "January " + i + " 1999";
                ri2.RuleId = i;

                RuleCondition ri3 = new RuleCondition();
                ri3.Id = ri2.Id + j;
                ri3.ConditionType = "OR";
                ri3.Operator = "";
                ri3.LeftExpressionType = "";
                ri3.LeftExpressionValue = "";
                ri3.RightExpressionType = "";
                ri3.RightExpressionValue = "";
                ri3.RuleId = i;

                RuleCondition ri4 = new RuleCondition();
                ri4.Id = ri3.Id + j;
                ri4.ConditionType = "CONDITION";
                ri4.Operator = "=";
                ri4.LeftExpressionType = "Defined";
                ri4.LeftExpressionValue = "TradeMark";
                ri4.RightExpressionType = "User Defined";
                ri4.RightExpressionValue = "PineApple Inc.";
                ri4.RuleId = i;

                RuleCondition ri5 = new RuleCondition();
                ri5.Id = ri4.Id + j;
                ri5.ConditionType = "CONDITION";
                ri5.Operator = "LIKE";
                ri5.LeftExpressionType = "Product";
                ri5.LeftExpressionValue = "Intel Super Secret Item";
                ri5.RightExpressionType = "User Defined";
                ri5.RightExpressionValue = "i13 1234k";
                ri5.RuleId = i;

                //different versions of hardcoded condition tree hierarchy for demo/testing
                if (i%3 == 0)
                {
                    ri.ParentConditionId = 0;
                    List<int> riList = new List<int>();
                    riList.Add(ri2.Id);
                    riList.Add(ri3.Id);
                    ri.ChildConditionIds = riList;
                    ri2.ParentConditionId = ri.Id;
                    ri2.ChildConditionIds = null;
                    List<int> ri3List = new List<int>();
                    ri3List.Add(ri4.Id);
                    ri3List.Add(ri5.Id);
                    ri3.ParentConditionId = ri.Id;
                    ri3.ChildConditionIds = ri3List;
                    ri4.ChildConditionIds = null;
                    ri4.ParentConditionId = ri3.Id;
                    ri5.ChildConditionIds = null;
                    ri5.ParentConditionId = ri3.Id;
                } else if (i%3 == 1)
                {
                    ri.ParentConditionId = 0;
                    List<int> riList = new List<int>();
                    riList.Add(ri2.Id);
                    riList.Add(ri3.Id);
                    riList.Add(ri4.Id);
                    riList.Add(ri5.Id);
                    ri.ChildConditionIds = riList;
                    ri2.ParentConditionId = ri.Id;
                    ri2.ChildConditionIds = null;
                    ri3.ParentConditionId = ri.Id;
                    ri3.ChildConditionIds = null;
                    ri4.ChildConditionIds = null;
                    ri4.ParentConditionId = ri.Id;
                    ri5.ChildConditionIds = null;
                    ri5.ParentConditionId = ri.Id;
                } else
                {
                    ri.ParentConditionId = 0;
                    List<int> riList = new List<int>();
                    riList.Add(ri3.Id);
                    riList.Add(ri2.Id);
                    riList.Add(ri4.Id);
                    ri.ChildConditionIds = riList;
                    ri2.ParentConditionId = ri.Id;
                    ri2.ChildConditionIds = null;
                    List<int> ri3List = new List<int>();
                    ri3List.Add(ri5.Id);
                    ri3.ParentConditionId = ri.Id;
                    ri3.ChildConditionIds = ri3List;
                    ri4.ChildConditionIds = null;
                    ri4.ParentConditionId = ri.Id;
                    ri5.ChildConditionIds = null;
                    ri5.ParentConditionId = ri3.Id;
                }
                

                ret.Add(ri);
                ret.Add(ri2);
                ret.Add(ri3);
                ret.Add(ri4);
                ret.Add(ri5);

                i--;
            }

            return ret;
        }

        /// <summary>
        /// Get All Rule Conditions
        /// </summary>
        /// <returns>list of rule condition data</returns>
        public List<RuleTask> GetRuleTasks()
        {
            var ret = new List<RuleTask>();
            //var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                //using (var rdr = DataAccess.ExecuteReader(cmd))
                //{
                //    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

                //    while (rdr.Read())
                //    {
                //        ret.Add(new RuleSet     //TODO: the data returned my SP may not be a ruleset and will need to be converted once retrieved.
                //        {
                //            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                //        });
                //    }
                //}
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            //DELETE ME once implemented above
            int i = 20;
            while (i > 0)
            {
                Random rand = new Random();

                RuleTask rt = new RuleTask();
                rt.Id = i;
                rt.Function = "SetValue";
                rt.Params = "TEST " + i;
                rt.RuleId = i;
                rt.Order = 1;
                rt.SuccessType = true;

                ret.Add(rt);

                RuleTask rt2 = new RuleTask();
                rt2.Id = i+20;
                rt2.Function = "ComplexFunction";
                rt2.Params = "TEST" + i;
                rt2.RuleId = i;
                rt2.Order = 2;
                rt2.SuccessType = true;

                ret.Add(rt2);

                RuleTask rt3 = new RuleTask();
                rt3.Id = i + 40;
                rt3.Function = "DoNothing";
                rt3.Params = "TEST" + i;
                rt3.RuleId = i;
                rt3.Order = 1;
                rt3.SuccessType = false;

                ret.Add(rt3);

                i--;
            }

            return ret;
        }
    }
}