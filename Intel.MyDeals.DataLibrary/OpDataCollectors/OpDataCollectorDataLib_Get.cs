using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;
using System.Data;
using System;

namespace Intel.MyDeals.DataLibrary
{
    public partial class OpDataCollectorDataLib
    {
        public List<PriceRuleData> GetPriceRuleData()
        {
            List<PriceRuleData> lstPriceRuleData = new List<PriceRuleData>();
            var cmd = new PR_MYDL_GET_PRC_RULE_DATA { };
            using (var rdr = DataAccess.ExecuteDataSet(cmd))
            {
                if (rdr.Tables.Count > 0)
                {
                    lstPriceRuleData = (from result in rdr.Tables[0].AsEnumerable()
                                        select new PriceRuleData
                                        {
                                            ContractId = (int)result["CNTRCT_OBJ_SID"],
                                            DealId = (int)result["DC_ID"],
                                            PricingStrategyId = (int)result["PRC_ST_OBJ_SID"]
                                        }).ToList();
                }
            }
            return lstPriceRuleData;
        }

        public List<PriceRuleCriteria> GetPriceRuleCriteriaById(int id, PriceRuleAction priceRuleAction)
        {
            List<PriceRuleCriteria> lstPriceRuleCriteria = new List<PriceRuleCriteria>();
            var cmd = new PR_MYDL_GET_PRC_RULE { actn_nm = priceRuleAction.ToString("g"), id = id, usr_id = OpUserStack.MyOpUserToken.Usr.WWID };
            using (var rdr = DataAccess.ExecuteDataSet(cmd))
            {
                return GetPriceRuleCriteria(rdr);
            }
        }


        List<PriceRuleCriteria> GetPriceRuleCriteria(DataSet dtPriceRuleCriteria)
        {
            List<PriceRuleCriteria> lstPriceRuleCriteria = new List<PriceRuleCriteria>();
            if (dtPriceRuleCriteria.Tables.Count > 0)
            {
                lstPriceRuleCriteria = (from result in dtPriceRuleCriteria.Tables[0].AsEnumerable()
                                        select new PriceRuleCriteria
                                        {
                                            Id = (int)result["RULE_ID"],
                                            RuleTypeId = (int)result["RULE_TYPE_ID"],
                                            Name = Convert.ToString(result["RULE_NAME"]),
                                            CriteriaJson = Convert.ToString(result["RULE_CRITERIA"]),
                                            ProductCriteriaJson = Convert.ToString(result["PRODUCT_CRITERIA"]),
                                            IsActive = Convert.ToBoolean(result["IS_ACTV"]),
                                            RuleStatus = Convert.ToBoolean(result["IS_APPROVED"]),
                                            StartDate = Convert.ToDateTime(result["EFF_FRM_DT"]),
                                            EndDate = Convert.ToDateTime(result["EFF_TO_DT"]),
                                            ChangedBy = Convert.ToString(result["CHG_BY"]),
                                            ChangeDateTime = Convert.ToDateTime(result["CHG_DTM"])
                                        }).ToList();
            }
            return lstPriceRuleCriteria;
        }

        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            List<string> lstRtn = new List<string>();
            var cmd = new PR_MYDL_GET_RULE_SUGG
            {
                category = strCategory,
                key = strSearchKey
            };
            using (var rdr = DataAccess.ExecuteDataSet(cmd))
            {
                if (rdr.Tables.Count > 0)
                {
                    lstRtn = (from result in rdr.Tables[0].AsEnumerable()
                              select result["result"].ToString()).ToList();
                }
            }
            return lstRtn;
        }

        public List<DropDowns> GetRuleTypes()
        {
            List<DropDowns> lstRtn = new List<DropDowns>();
            var cmd = new PR_MYDL_GET_RULE_TYPES { };
            using (var rdr = DataAccess.ExecuteDataSet(cmd))
            {
                if (rdr.Tables.Count > 0)
                {
                    lstRtn = (from result in rdr.Tables[0].AsEnumerable()
                              select new DropDowns
                              {
                                  Value = Convert.ToString(result["RULE_TYPE_ID"]),
                                  Text = Convert.ToString(result["TITLE"])
                              }).ToList();
                }
            }
            return lstRtn;
        }

        public RuleConfig GetPriceRulesConfig(int iRuleTypeId)
        {
            RuleConfig ruleConfig = new RuleConfig();
            ruleConfig.PriceRuleCriteria = GetPriceRuleCriteriaById(iRuleTypeId, PriceRuleAction.GET_BY_RULE_TYPE_ID);
            ruleConfig.AttributeSettings = new List<AttributeSettings>();
            ruleConfig.operatorSettings = new operatorSettings();
            var cmd = new PR_MYDL_GET_PRC_RULE_CONFIG
            {
                RULE_TYPE_ID = iRuleTypeId
            };
            using (var rdr = DataAccess.ExecuteDataSet(cmd))
            {
                if (rdr.Tables.Count > 0)
                {
                    ruleConfig.operatorSettings.operators = (from result in rdr.Tables[0].AsEnumerable()
                                                             select new operators
                                                             {
                                                                 id = (int)result["OPERATOR_ID"],
                                                                 label = Convert.ToString(result["OPERATOR_TITLE"]),
                                                                 @operator = Convert.ToString(result["OPERATOR_SYMBOL"]),
                                                                 operCode = Convert.ToString(result["OPERATOR_CD"])
                                                             }).ToList();

                    ruleConfig.operatorSettings.types = (from result in rdr.Tables[1].AsEnumerable()
                                                         select new types
                                                         {
                                                             id = (int)result["UI_TYPE_ID"],
                                                             type = Convert.ToString(result["UI_DATA_TYPE"]),
                                                             uiType = Convert.ToString(result["UI_NAME"])
                                                         }).ToList();

                    Dictionary<int, List<int>> dicOperatorsMap = rdr.Tables[2].AsEnumerable().GroupBy(x => (int)x["UI_TYPE_ID"]).ToDictionary(x => x.Key, y => y.Select(z => (int)z["OPERATOR_ID"]).ToList());
                    ruleConfig.operatorSettings.types2operator = (from result in dicOperatorsMap
                                                                  select new types2operator
                                                                  {
                                                                      @operator = ruleConfig.operatorSettings.operators.Where(x => result.Value.Contains(x.id)).Select(x => x.@operator).ToList(),
                                                                      type = ruleConfig.operatorSettings.types.Where(x => x.id == result.Key).First().type
                                                                  }).ToList();

                    ruleConfig.AttributeSettings = (from result in rdr.Tables[3].AsEnumerable()
                                                    select new AttributeSettings
                                                    {
                                                        field = Convert.ToString(result["ATTR_CODE"]),
                                                        title = Convert.ToString(result["TITLE"]),
                                                        width = Convert.ToDouble(result["WIDTH"]),
                                                        dimKey = result["DIM_KEY"] == DBNull.Value ? 0 : (int)result["DIM_KEY"],
                                                        type = ruleConfig.operatorSettings.types.Where(x => x.id == (int)result["UI_TYPE_ID"]).First().type,
                                                        lookupText = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_TEXT_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Text" : Convert.ToString(result["LKUP_TEXT_KEY"])),
                                                        lookupValue = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_VALUE_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Value" : Convert.ToString(result["LKUP_VALUE_KEY"])),
                                                        lookups = result["LKUP_TYPE_ID"] == DBNull.Value ? new List<DropDowns>() : ((LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? GetLookUps((LookupType)result["LKUP_TYPE_ID"], Convert.ToString(result["LKUP_DATA"])) : new List<DropDowns>()),
                                                        lookupUrl = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : ((LookupType)result["LKUP_TYPE_ID"] == LookupType.URL ? Convert.ToString(result["LKUP_DATA"]) : string.Empty)
                                                    }).ToList();

                    ruleConfig.AttributeSettings.Where(x => x.type == "money").ToList().ForEach(x =>
                    {
                        x.format = "{0:c}";
                        x.filterable = "moneyObjFilter";
                        x.template = "#= gridUtils.tierDim(data, 'RATE', 'c') #";
                    });
                }
            }
            return ruleConfig;
        }

        List<DropDowns> GetLookUps(LookupType lookupType, string strData)
        {
            List<DropDowns> rtn = new List<DropDowns>();
            switch (lookupType)
            {
                case LookupType.COMMA_SEPARATED_DATA:
                    {
                        rtn = (from result in strData.Split(',')
                               select new DropDowns
                               {
                                   Text = result.ToString(),
                                   Value = result.ToString(),
                               }).ToList();
                    }
                    break;
            }
            return rtn;
        }

        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="includeSecondaryTypes"></param>
        /// <param name="atrbs">Attributes that need to be brought in as well.</param>
        /// <returns></returns>
        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<int> atrbs)
        {
            // Load Data Cycle: Point 3

            string strInc = "*";
            //string searchGroup = opDataElementType.ToString();

            if (includeTypes != null && includeTypes.Any())
            {
                strInc = string.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToAlias).Distinct());
            }

            var cmd = new PR_MYDL_GET_OBJS_BY_SIDS
            {
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                in_obj_type = opDataElementType.ToAlias(),
                in_include_groups = strInc,
                in_obj_sids = new type_int_list(ids.ToArray()),
                in_atrbs_list = new type_int_list(atrbs.ToArray())
            };


            MyDealsData odcs;
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                odcs = new OpDataCollectorDataLib().ReaderToDataCollectors(rdr, true);
            }

            // Add in the negative IDs now
            if (odcs == null) odcs = new MyDealsData(); // We might have to initialize other things in odcs

            foreach (int id in ids.Where(c => c < 0))
            {
                // We have a negative number, so stub in a new contract for that number...
                if (!odcs.ContainsKey(opDataElementType))
                {
                    odcs[opDataElementType] = new OpDataPacket<OpDataElementType>
                    {
                        PacketType = opDataElementType,
                        GroupID = id
                    };
                }

                // Populate this according to the template
                odcs[opDataElementType].Data[id] = GetDataCollectorFromTemplate(opDataElementType, id, 0);
            }

            foreach (OpDataElementType oType in includeTypes)
            {
                if (!odcs.ContainsKey(oType)) odcs[oType] = new OpDataPacket<OpDataElementType> { PacketType = oType };
            }

            return odcs;
        }


        /// <summary>
        /// Pull out a specific template from the templates collection and build a collector out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <param name="id">The ID to tag to it.</param>
        /// <param name="parentId">The ParentId to tag to it as well.</param>
        /// <returns></returns>
        public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        {
            return GetOpDataElementUiTemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        }


        /// <summary>
        /// Pull out a specific template from the templates collection and build a UI template object out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <returns></returns>
        public static OpDataElementAtrbTemplate GetOpDataElementUiTemplate(OpDataElementType opDataElementType)
        {
            OpDataElementAtrbTemplates ourTemplates = DataCollections.GetOpDataElementUiTemplates();
            string key = opDataElementType.ToString();

            return ourTemplates.ContainsKey(key)
                ? ourTemplates[key]
                : new OpDataElementAtrbTemplate();
        }

    }
}
