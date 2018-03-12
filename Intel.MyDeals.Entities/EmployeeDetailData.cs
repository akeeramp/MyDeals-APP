using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class EmployeeDetailData
    {
        public List<EmployeeBasicData> EmpBasicData { get; set; }
        public List<EmployeeRole> EmpRole { get; set; }
        public List<EmployeeGeo> EmpGeo { get; set; }
        public List<EmployeeVertical> EmpVertical { get; set; }
    }

    public class EmployeeCustomers
    {
        public int empWWID { get; set; }
        public List<int> custIds { get; set; }
    }

}
