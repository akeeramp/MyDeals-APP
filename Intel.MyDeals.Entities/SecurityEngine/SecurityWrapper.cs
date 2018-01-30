using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

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


        public string DefineBaseKey(OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType, OpRoleType opRoleType, string wfStage, string actionCd, string atrbCd)
        {
            const string delim = "_";
            return string.Format("{1}{0}{2}{0}{3}{0}{4}{0}{5}{0}{6}", delim, opDataElementType, opDataElementSetType, opRoleType.RoleTypeCd, wfStage, actionCd, atrbCd);
        }

        public bool ChkAtrbRules(OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType, string wfStage, string actionCd, string atrbCd, Dictionary<string, bool> securityActionCache = null)
        {
            if (string.IsNullOrEmpty(atrbCd)) return false;

            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            // Function returns the true or false value from the security mask - breakpoint here if you want to verify values in code.

            if (securityActionCache == null) securityActionCache = new Dictionary<string, bool>();

            // Look for cache first
            string secBaseKey = DefineBaseKey(opDataElementType, opDataElementSetType, opUserToken.Role, wfStage, actionCd, atrbCd);
            if (securityActionCache.ContainsKey(secBaseKey)) return securityActionCache[secBaseKey];

            SecurityAttribute sa = (from el in SecurityAttributes
                                 where el.ATRB_CD.Trim() == atrbCd.Trim()
                                 select el).FirstOrDefault();

            if (sa == null)
            {
                securityActionCache[secBaseKey] = false;
                return false;
            }

            int opDataElementTypeId = opDataElementType.ToId();
            int opDataElementSetTypeId = opDataElementSetType.ToId();


            // TODO Why isn't OBJ_SET_TYPE_ID being set... we should be using that instead of CD
            IEnumerable<string> localSecurityMasks =
			(from el in SecurityMasks
						where (el.ACTN_NM == null || el.ACTN_NM == "0" || el.ACTN_NM.Trim() == actionCd)
							  && (el.OBJ_TYPE_SID == 0 || el.OBJ_TYPE_SID == opDataElementTypeId)
							  && (el.OBJ_SET_TYPE_CD == "ALL_TYPES" || el.OBJ_SET_TYPE_CD == opDataElementSetType.ToString())
							  && (el.ROLE_SID == 0 || el.ROLE_NM == opUserToken.Role.RoleTypeCd)
							  && (el.WFSTG_MBR_SID == 0 || el.WFSTG_NM == wfStage)
							select el.PERMISSION_MASK
			);

			if (!localSecurityMasks.Any())
            {
                securityActionCache[secBaseKey] = false;
				return false;
            }
						
			bool result = BitShiftCheck(localSecurityMasks, sa);
			
			securityActionCache[secBaseKey] = result;
            return result;
        }

        public bool ChkDealRules(OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType, string wfStage, string actionCd)
        {
            IEnumerable<string> localSecurityMasks = from el in SecurityMasks
                where (el.ACTN_NM == null || el.SECUR_ACTN_SID == 0 || el.ACTN_NM.Trim() == actionCd)
                      && (el.OBJ_TYPE_SID == 0 || el.OBJ_TYPE_SID == (int) opDataElementType)
                      && (el.OBJ_SET_TYPE_SID == 0 || el.OBJ_SET_TYPE_SID == (int) opDataElementSetType)
                      && (el.ROLE_SID == 0 || el.ROLE_SID == OpUserStack.MyOpUserToken.Role.RoleTypeId)
                      && (el.WFSTG_MBR_SID == 0 || el.WFSTG_NM == wfStage)
                select el.PERMISSION_MASK;

            return localSecurityMasks.Any();
        }

        private bool BitShiftCheck(IEnumerable<string> localSecurityMasks, SecurityAttribute sa)
        {
            return (
                from s in localSecurityMasks
                select s.Split('.').Reverse().ToArray()
                into aPermissionMask

                select aPermissionMask[sa.ATRB_MAGNITUDE]
                into hexVal

                select Convert.ToString(Convert.ToInt32(hexVal, 16), 2)
                into binVal

                let revBinVal = binVal.ToCharArray().Reverse().ToArray()
                where revBinVal.Length > sa.ATRB_BIT

                select binVal
                )
                .Any(binVal => binVal.ToCharArray().Reverse().ElementAt((int)sa.ATRB_BIT) == '1');
        }
    }

    public class SecurityItems
    {
        public List<SecurityAttribute> SecurityAttributes { get; set; }
        public List<SecurityMask> SecurityMasks { get; set; }

    }
}
