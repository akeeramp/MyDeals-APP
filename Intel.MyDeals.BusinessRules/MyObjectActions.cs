using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessRules
{
    class MyObjectActions
    {
        public static void AddSecurityToMeetCompData(params dynamic[] args)
        {
            MyObjectRuleCore r = new MyObjectRuleCore(args);
            if (!r.IsValid) return;

            List<string> stgReadOnly = new List<string> { "PENDING", "APPROVED", "HOLD" };
            List<string> stgEditableWhenDlDraft = new List<string> { "SUBMITTED" };
            List<string> stgReadOnlyWhenDlActive = new List<string> { "DRAFT", "REQUESTED", "SUBMITTED" };

            // For now... to show how this would apply to rules, we will make a logical condition.  
            // In the future, we can replace with security key where the stages are managed in the DB

            foreach (dynamic item in r.Data)
            {
                // Need to add PS_STATUS in the return from the proc.  For this example I will use WF_STG_CD
                string stg = item.WF_STG_CD.ToString();

                if (stgReadOnly.Contains(stg))
                {
                    item.MEET_COMP_UPD_FLG = "N";
                }
                else if (stgEditableWhenDlDraft.Contains(stg) && item.WIP_DL_STATUS == "DRAFT")
                {
                    item.MEET_COMP_UPD_FLG = "Y";
                }
                else if (stgReadOnlyWhenDlActive.Contains(stg) && item.WIP_DL_STATUS == "ACTIVE")
                {
                    item.MEET_COMP_UPD_FLG = "N";
                }
                else item.MEET_COMP_UPD_FLG = "N";

            }

        }
    }
}
