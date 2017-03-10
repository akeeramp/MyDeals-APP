using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public class SecurityWrapper
    {
        public SecurityWrapper(List<OpRoleType> opRoleTypes, List<SecurityAttribute> securityAttributes, List<SecurityMask> securityMasks)
        {
            RoleTypes = opRoleTypes;
            SecurityAttributes = securityAttributes;
			SecurityMasks = securityMasks;
		}

        public List<OpRoleType> RoleTypes { get; set; }
        public List<SecurityAttribute> SecurityAttributes { get; set; }
        public List<SecurityMask> SecurityMasks { get; set; }


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
                                 where el.ATRB_CD.Trim() == atrbCd.Trim()
                                 select el).FirstOrDefault();

            if (sa == null)
            {
                securityActionCache[secBaseKey] = false;
                return false;
            }


            IEnumerable<string> localSecurityMasks =
                (from el in SecurityMasks
                 where (el.ACTN_NM == actionCd || el.ACTN_NM == null)
                       && (el.OBJ_SET_TYPE_CD == opDataElementType.ToString() || el.OBJ_SET_TYPE_CD == null)
                       && (el.ROLE_NM == opRoleType.RoleTypeCd || el.ROLE_NM == null)
                       && (el.WFSTG_NM == wfStage || el.WFSTG_NM == null)
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
                    where (el.ACTN_NM == null || el.ACTN_NM == "0" || el.ACTN_NM.Trim() == actionCd)
                        // TODO: Ask db guys to add OBJ_TYPE_CD into the PR_GET_SECUR_MASK SP. I think Andrew was having trouble with this the other day.   
						//&& (el.OBJ_TYPE_CD == null || el.OBJ_TYPE_CD == "0" || el.OBJ_TYPE_CD == opDataElementType.ToString())
                          && (el.OBJ_SET_TYPE_CD == null || el.OBJ_SET_TYPE_CD == "0" || el.OBJ_SET_TYPE_CD == opDataElementSetType.ToString())
                          && (el.ROLE_NM == null || el.ROLE_NM == "0" || el.ROLE_NM == roleTypeCd)
                          && (el.WFSTG_NM == wfStage || el.WFSTG_NM == null || el.WFSTG_NM == "0")
                    select el.PERMISSION_MASK).Any();
        }
    }
}
