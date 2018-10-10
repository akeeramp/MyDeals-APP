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
        DealModifiedByOtherUser = 2,
        TenderSubmittedToOffer = 3
    }
}