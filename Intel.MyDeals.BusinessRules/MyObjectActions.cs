using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessRules
{
    internal class MyObjectActions
    {
        public static void AddSecurityToMeetCompData(params dynamic[] args)
        {
            MyObjectRuleCore r = new MyObjectRuleCore(args);
            if (!r.IsValid) return;

            var role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;
            var isSuperSA = role == "SA" && OpUserStack.MyOpUserToken.IsSuper();

            // For now... to show how this would apply to rules, we will make a logical condition.
            // In the future, we can replace with security key where the stages are managed in the DB
            foreach (dynamic item in r.Data)
            {
                // FSE and GA can edit in Draft stage
                string stg = string.IsNullOrEmpty(item.PS_STATUS) ? "" : item.PS_STATUS.ToString().ToUpper();
                if (stg == "DRAFT" && (role == "FSE" || role == "GA"))
                {
                    item.MEET_COMP_UPD_FLG = "Y";
                }
                else
                {
                    item.MEET_COMP_UPD_FLG = "N";
                }

                // GA can edit in REQUESTED state
                if (stg == "REQUESTED" && role == "GA")
                {
                    item.MEET_COMP_UPD_FLG = "Y";
                }

                // DA can override in SUBMITTED stage
                if (stg == "SUBMITTED" && role == "DA")
                {
                    item.MEET_COMP_UPD_FLG = item.MEET_COMP_OVERRIDE_UPD_FLG = "Y";
                }
                else
                {
                    item.MEET_COMP_OVERRIDE_UPD_FLG = "N";
                }

                // TODO : Check if security mask is configured. Once done uncomment this, remove above code.
                // Add one more attribute C_EDIT_MEET_COMP_OVERRIDE, once done remove all role condition from UI
                // MEET_COMP_OVERRIDE_UPD_FLG, MEET_COMP_UPD_FLG will be replace by C_EDIT_MEET_COMP_OVERRIDE, C_EDIT_MEET_COMP respectively

                //item.MEET_COMP_UPD_FLG = DataCollections.GetSecurityWrapper()
                //.ChkDealRules(OpDataElementType.ALL_OBJ_TYPE, OpDataElementSetType.ALL_TYPES, item.PS_STATUS, SecurityActns.C_EDIT_MEET_COMP) ? "Y" : "N"

                if (string.IsNullOrEmpty(item.PS_STATUS))
                {
                    item.MEET_COMP_UPD_FLG = "Y"; // Product Line will always be editable TODO: Run it by Guru
                    item.MEET_COMP_OVERRIDE_UPD_FLG = "Y";
                }

                // Super SA can edit on any stage
                if (isSuperSA)
                {
                    item.MEET_COMP_UPD_FLG = "Y";
                    item.MEET_COMP_OVERRIDE_UPD_FLG = "Y";
                }

                // If deal status is Active or Hold Override all the previous condition and default it to "N"
                string dealStg = string.IsNullOrEmpty(item.DEAL_STATUS) ? "" : item.DEAL_STATUS.ToString().ToUpper();
                if (dealStg == "HOLD" || dealStg == "ACTIVE")
                {
                    item.MEET_COMP_UPD_FLG = "N";
                    item.MEET_COMP_OVERRIDE_UPD_FLG = "N";
                }
            }
        }
    }
}