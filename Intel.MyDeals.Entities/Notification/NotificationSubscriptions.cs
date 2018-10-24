using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class NotificationSubscriptions
    {
        public int NOTIF_ID { get; set; }

        public bool EMAIL_IND { get; set; }

        public bool IN_TOOL_IND { get; set; }
    }

    public enum NotificationEvents
    {
        SubmittedToApproved = 1,
        CapUpdateToDeal = 2,
        CostUpdateToDeal = 3,
        DealModifiedByOtherUser = 4,
        PSInPendingStage = 5,
        ContractPendingStage = 6,
        TenderSubmittedToOffer = 7
    }

    public class NotificationLog
    {
        public int CONTRACT_SID { get; set; }

        public int NOTIF_ID { get; set; }

        public int OBJ_SID { get; set; }

        public int OBJ_TYPE_SID { get; set; }
    }
}