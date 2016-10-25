using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public partial class DealPropertyWrapper
    {
        private List<string> RuleMessages = new List<string>();

        public void WriteRuleMessage(string msk, params object[] args)
        {
            if (args != null && args.Any())
            {
                RuleMessages.Add(String.Format(msk, args));
            }
            else
            {
                RuleMessages.Add(msk);
            }
        }
    }
}
