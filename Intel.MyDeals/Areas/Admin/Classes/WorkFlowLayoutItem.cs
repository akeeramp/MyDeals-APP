using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Intel.MyDeals.Areas.Admin.Classes
{
    public class WorkFlowLayoutItem
    {
        public WorkFlowLayoutItem()
        {
            nodeDataArray = new List<WorkFlowLayoutNodeItem>();
            linkDataArray = new List<WorkFlowLayoutDataItem>();
        }

        public string @class { get; set; }
        public string nodeKeyProperty { get; set; }
        public List<WorkFlowLayoutNodeItem> nodeDataArray { get; set; }
        public List<WorkFlowLayoutDataItem> linkDataArray { get; set; }

    }
}