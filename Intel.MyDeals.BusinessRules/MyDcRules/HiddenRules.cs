using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetHiddenRules()
        {
			return new List<MyOpRule>
			{
				new MyOpRule
				{
					Title="Sync Hidden",
					ActionRule = MyDcActions.SyncHiddenItems,
					Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
				},

                new MyOpRule
                {
                    Title="Show Expire YCS2 if frontend deal is active",
                    ActionRule = MyDcActions.ShowExpireYCS2,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },

    //            new MyOpRule
				//{
				//	Title="Hidden if NOT Consumption",
				//	ActionRule = MyDcActions.ExecuteActions,
				//	Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
				//	InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
				//	AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() != "Consumption").Any(),
				//	OpRuleActions = new List<OpRuleAction<IOpDataElement>>
				//	{
				//		new OpRuleAction<IOpDataElement>
				//		{
				//			Action = BusinessLogicDeActions.SetHidden,
				//			Target = new[] {AttributeCodes.CONSUMPTION_REASON, AttributeCodes.CONSUMPTION_REASON_CMNT }
				//		}
				//	}
				//},
				//new MyOpRule
				//{
				//	Title="Read-only Retail Cycle if not correct market segment",
				//	ActionRule = MyDcActions.ExecuteActions,
				//	Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
				//	InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
				//	// TODO: These hard-coded AtrbValue should be replaced with nicer non-harded values :<
				//	AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MRKT_SEG) && de.AtrbValue != null && !(de.AtrbValue.ToString() == "All Direct Market Segments" || de.AtrbValue.ToString().Contains("Consumer Retail Pull"))).Any(),
				//	OpRuleActions = new List<OpRuleAction<IOpDataElement>>
				//	{
				//		new OpRuleAction<IOpDataElement>
				//		{
				//			Action = BusinessLogicDeActions.SetHidden,
				//			Target = new[] {AttributeCodes.RETAIL_CYCLE }
				//		}
				//	}
				//},
                new MyOpRule
                {
                    Title="Hidden BECAUSE REMOVED FROM WIP GRID",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetHidden,
                            Target = new[]
                            {
                                AttributeCodes.RETAIL_CYCLE,
                                AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE,
                                AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE_REASON,
                                AttributeCodes.MEETCOMP_TEST_RESULT,
                                AttributeCodes.COST_TEST_FAIL_OVERRIDE,
                                AttributeCodes.COST_TEST_FAIL_OVERRIDE_REASON,
                                AttributeCodes.COST_TEST_OVERRIDE,
                                AttributeCodes.COST_TEST_RESULT,
                                AttributeCodes.COST_TYPE_USED,
                                AttributeCodes.IA_BENCH,
                                AttributeCodes.CUST_MBR_SID,
                                AttributeCodes.ECAP_FLR,
                                AttributeCodes.YCS2_OVERLAP_OVERRIDE,
                                AttributeCodes.COST_TYPE_USED
                            }
                        }
                    }
                },				
				//new MyOpRule
				//{
				//	Title="Hidden Retail Pull $ Comments if not correct role (DA)",
				//	ActionRule = MyDcActions.ExecuteActions,
				//	Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
				//	InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
				//	// TODO: These hard-coded AtrbValue should be replaced with nicer non-harded values :<
				//	AtrbCondIf = dc => dc.GetDataElementsWhere(de => (OpUserStack.MyOpUserToken.Role.RoleTypeCd != RoleTypes.DA)).Any(),
				//	OpRuleActions = new List<OpRuleAction<IOpDataElement>>
				//	{
				//		new OpRuleAction<IOpDataElement>
				//		{
				//			Action = BusinessLogicDeActions.SetHidden,
				//			Target = new[] {AttributeCodes.RETAIL_PULL_USR_DEF, AttributeCodes.RETAIL_PULL_USR_DEF_CMNT }
				//		}
				//	}
				//}
			};
        }
    }

}
