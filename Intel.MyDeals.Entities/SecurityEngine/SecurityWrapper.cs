using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public class SecurityWrapper
    {
        public SecurityWrapper(List<OpRoleType> opRoleTypes, List<SecurityAttribute> securityAttributes, List<SecurityMask> securityMasks, List<AdminDealType> adminDealType = null, List<AdminRoleType> adminRoleType = null)
        {
            RoleTypes = opRoleTypes;
            SecurityAttributes = securityAttributes;
			SecurityMasks = securityMasks;
			AdminDealType = adminDealType;
			AdminRoleType = adminRoleType;
		}

        public List<OpRoleType> RoleTypes { get; set; }
        public List<SecurityAttribute> SecurityAttributes { get; set; }
        public List<SecurityMask> SecurityMasks { get; set; }

		public List<AdminDealType> AdminDealType { get; set; }
		public List<AdminRoleType> AdminRoleType { get; set; }
		//public List<AdminStages> AdminStages { get; set; }


        public string DefineBaseKey(OpDataElementType opDataElementType, OpRoleType opRoleType, string wfStage, string actionCd, string atrbCd)
        {
            const string delim = "_";
            return string.Format("{1}{0}{2}{0}{3}{0}{4}{0}{5}", delim, opDataElementType, opRoleType.RoleTypeCd, wfStage, actionCd, atrbCd);
        }

        public bool ChkAtrbRules(OpDataElementType opDataElementType, OpRoleType opRoleType, string wfStage, string actionCd, string atrbCd, Dictionary<string, bool> securityActionCache = null)
        {
            if (string.IsNullOrEmpty(atrbCd)) return false;

            // Function returns the true or false value from the security mask - breakpoint here if you want to verify values in code.

            if (securityActionCache == null) securityActionCache = new Dictionary<string, bool>();

            // Look for cache first
            string secBaseKey = DefineBaseKey(opDataElementType, opRoleType, wfStage, actionCd, atrbCd);
            if (securityActionCache.ContainsKey(secBaseKey)) return securityActionCache[secBaseKey];

            SecurityAttribute sa = (from el in SecurityAttributes
                                 where el.FACT_ATRB_CD.Trim() == atrbCd.Trim()
                                 select el).FirstOrDefault();

            if (sa == null)
            {
                securityActionCache[secBaseKey] = false;
                return false;
            }


            IEnumerable<string> localSecurityMasks =
                (from el in SecurityMasks
                 where (el.ACTN_CD == actionCd || el.ACTN_CD == null)
                       && (el.OBJ_TYPE == opDataElementType.ToString() || el.OBJ_TYPE == null)
                       && (el.ROLE_TYPE_CD == opRoleType.RoleTypeCd || el.ROLE_TYPE_CD == null)
                       && (el.WFSTG_CD == wfStage || el.WFSTG_CD == null)
                 select el.PERMISSION_MASK);

            if (!localSecurityMasks.Any())
            {
                securityActionCache[secBaseKey] = false;
                return false;
            }

            bool result = (from s in localSecurityMasks
                           select s.Split('.').Reverse().ToArray()
                into aPermissionMask
                           select aPermissionMask[sa.ATRB_MAGNITUDE]
                into hexVal
                           select Convert.ToString(Convert.ToInt32(hexVal, 16), 2)
                into binVal
                           let revBinVal = binVal.ToCharArray().Reverse().ToArray()
                           where revBinVal.Length > sa.ATRB_BIT
                           select binVal).Any(binVal => binVal.ToCharArray().Reverse().ElementAt((int)sa.ATRB_BIT) == '1');

            securityActionCache[secBaseKey] = result;
            return result;
        }

        public bool ChkDealRules(OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType, string roleTypeCd, string wfStage, string actionCd)
        {
            // TODO add obj type nad obj set type to collection
            return (from el in SecurityMasks
                    where (el.ACTN_CD == null || el.ACTN_CD == "0" || el.ACTN_CD.Trim() == actionCd)
                          && (el.OBJ_TYPE == null || el.OBJ_TYPE == "0" || el.OBJ_TYPE == opDataElementType.ToString())
                          && (el.OBJ_TYPE == null || el.OBJ_TYPE == "0" || el.OBJ_TYPE == opDataElementSetType.ToString())
                          && (el.ROLE_TYPE_CD == null || el.ROLE_TYPE_CD == "0" || el.ROLE_TYPE_CD == roleTypeCd)
                          && (el.WFSTG_CD == wfStage || el.WFSTG_CD == null || el.WFSTG_CD == "0")
                    select el.PERMISSION_MASK).Any();
        }
    }
}
