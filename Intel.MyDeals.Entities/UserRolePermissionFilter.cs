using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class UserRolePermissionFilter
    {
        public int Skip { get; set; } = 0;
        public int Take { get; set; } = 25;
        public string DatabaseUserName { get; set; } = "";
        public string StartDate { get; set; } = "" ;
        public string EndDate { get; set; } = "";
        public bool IsFetchLatest { get; set; } = false;
        public string Sort { get; set; } = "";
        public string Filter { get; set; } = "";
        public bool PageChange { get; set; } = false;

    }
}
