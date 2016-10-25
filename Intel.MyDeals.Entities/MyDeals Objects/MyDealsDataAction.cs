using System;
using System.Collections.Generic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public class MyDealsDataAction : OpDataAction
    {
        public const int DEFAULT_SORT = 0;

        public static readonly Dictionary<string, int> DEFAULT_ACTION_SORT_ORDER = new Dictionary<string, int>()
        {
            // Standard DEAL Save/Actions
              {DealSaveActionCodes.LAYER, 10}
            , {DealSaveActionCodes.SAVE, 20}
            , {DealSaveActionCodes.PREP2DEAL, 30}
            , {"SYNCDEAL", 30}
            , {"ACTION", 90}
            , {DealSaveActionCodes.DEAL_DELETE, 100}
            , {DealSaveActionCodes.DEAL_ROLLBACK_TO_ACTIVE, 200}
            , {DealSaveActionCodes.GEN_TRACKER, 300}
            , {DealSaveActionCodes.SNAPSHOT, 400}
            , {DealSaveActionCodes.QUEUE_QUOTE_LETTER, 500}
            , {DealSaveActionCodes.CALC_MSP, 1000}

            // Copy WB Actions
            , {DealSaveActionCodes.COPY_WB_FULL, 3100}
            , {DealSaveActionCodes.COPY_WB_HEADER, 3200}
            , {DealSaveActionCodes.COPY_WB_OVERLAP, 3300}
            , {DealSaveActionCodes.COPY_WB_PROD, 3400}

            // Response Actions
            , {DealSaveActionCodes.ID_CHANGE, 9100}
            , {DealSaveActionCodes.ATRB_DELETED, 9200}
            , {DealSaveActionCodes.DEAL_DELETED, 9300}
            , {DealSaveActionCodes.MESSAGE, 9400}

            // TODO: Add more actions here...
            // TODO: Move this list to the DB and get it from there...
        };

        public static int GetDefaultSortOrder(string action_cd)
        {
            int ret = 0;
            if(!DEFAULT_ACTION_SORT_ORDER.TryGetValue((action_cd??"").Trim().ToUpper(), out ret))
            {
                ret = 0;
                OpLogPerf.Log("Invalid action sort order for {0}.", action_cd);
            }
            return ret;
        }


        public OpActionType ActionType { get; set; }
        public String ActionSubType { get; set; }
        public OpTaskPhase TaskPhase { get; set; }
        public OpTaskLocation TaskLocation { get; set; }
        public OpMsgQueue Messages = new OpMsgQueue();

        public MyDealsDataAction() 
            : this(String.Empty, String.Empty, null)
        {
        }

        public MyDealsDataAction(string action) 
            : this(action, String.Empty, null)
        {
        }

        public MyDealsDataAction(string action, int sort)
            : this(action, String.Empty, null, sort)
        {
        }

        public MyDealsDataAction(string action, string subAction)
            : this(action, subAction, null)
        {
        }

        public MyDealsDataAction(string action, string subAction, int sort)
            : this(action, subAction, null, sort)
        {
        }


        public MyDealsDataAction(string action, List<int> targetDcIDs)
            : this(action, String.Empty, targetDcIDs)
        {
        }

        public MyDealsDataAction(string action, List<int> targetDcIDs, int sort)
            : this(action, String.Empty, targetDcIDs, sort)
        {
        }

        public MyDealsDataAction(string action, string subAction, List<int> targetDcIDs)
            : this(action, subAction, targetDcIDs, DEFAULT_SORT) { }
        
        public MyDealsDataAction(string action, string subAction, List<int> targetDcIDs, int sort)
            : base(action, targetDcIDs)
        {
            ActionSubType = subAction;

            // If no sort order was passed in, then guess what the best sort order should be
            if (sort == DEFAULT_SORT)
            {
                if (!DEFAULT_ACTION_SORT_ORDER.TryGetValue(base.Action, out sort)) // Using base.Action since it is formatted upper case to match dictionary values
                {
                    OpLogPerf.Log("WARNING! Unset Action Sort Order! Ensure action is in default sort dictionary. Action: {0}; Sub: {1};  Targets: {2}", 
                        action, 
                        subAction,
                        (targetDcIDs == null ? "" : String.Join(", ", targetDcIDs))
                        );
                }
            }

            base.Sort = sort;

        }

        
    }
}
