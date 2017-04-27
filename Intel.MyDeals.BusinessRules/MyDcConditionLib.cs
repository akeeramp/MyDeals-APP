using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.BusinessRules
{
    public static class MyDcConditionLib
    {
        /// <summary>
        /// Determine if the rule meets basic requirements.  
        /// This will allow use to filter rules out quickly before taking the more expensive lambda approach
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="ar">MyOpRule</param>
        /// <returns></returns>
        public static bool MeetsRuleCriteria(this OpDataCollector dc, MyOpRule ar)
        {
            if (dc == null || ar == null) return false;
            OpRoleType opRoleType = OpUserStack.MyOpUserToken.Role;

            string stage = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);

            // Tracker if enabled
            if (ar.WithTracker != null)
            {
                if (ar.WithTracker == true && !dc.HasTracker()) return false;
                if (ar.WithoutTracker == true && dc.HasTracker()) return false;
            }

            // Valid Roles if enabled
            if (ar.InRoles != null && ar.InRoles.Any())
            {
                if (!ar.InRoles.Contains(opRoleType.RoleTypeCd)) return false;
            }

            // InValid Roles if enabled
            if (ar.NotInRoles != null && ar.NotInRoles.Any())
            {
                if (ar.NotInRoles.Contains(opRoleType.RoleTypeCd)) return false;
            }

            // Valid Stages if enabled
            if (ar.InStages != null && ar.InStages.Any())
            {
                if (!ar.InStages.Contains(stage)) return false;
            }

            // InValid Stages if enabled
            if (ar.NotInStages != null && ar.NotInStages.Any())
            {
                if (ar.NotInStages.Contains(stage)) return false;
            }

            return true;
        }

        /// <summary>
        /// Checks if the rule's conditional statement passes.  If not condition, return true
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="ar">MyOpRule</param>
        /// <returns></returns>
        public static bool MeetsRuleCondition(this OpDataCollector dc, MyOpRule ar)
        {
            if (dc == null || ar == null) return false;
            return ar.AtrbCondIf == null || ar.AtrbCondIf(dc);
        }

        public static bool IsNegativeOrZero(this OpDataCollector dc, string atrbCd)
        {
            IOpDataElement de = dc.GetDataElement(atrbCd);
            if (de == null || de.AtrbValue.ToString() == string.Empty) return true;
            return OpConvertSafe.ToDouble(de.AtrbValue.ToString().Replace("$", "")) <= 0;
        }

    }
}
