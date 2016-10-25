using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class EmployeeFullData : EmployeeBasicData
    {
        public EmployeeFullData(EmployeeBasicData empBasicData)
        {
            IDSID = empBasicData.IDSID;
            EMP_WWID = empBasicData.EMP_WWID;
            FIRST_NAME = empBasicData.FIRST_NAME;
            MIDDLE_NAME = empBasicData.MIDDLE_NAME;
            LAST_NAME = empBasicData.LAST_NAME;
            EMAIL_ADDR = empBasicData.EMAIL_ADDR;
            PHONE_NUMBER = empBasicData.PHONE_NUMBER;
            ACTV_IND = empBasicData.ACTV_IND;

            EmpRole = new List<EmployeeRole>();
            EmpGeo = new List<EmployeeGeo>();
            EmpVertical = new List<EmployeeVertical>();
        }

        public EmployeeFullData()
        {
            //IDSID = empBasicData.IDSID;
            //EMP_WWID = empBasicData.EMP_WWID;
            //FIRST_NAME = empBasicData.FIRST_NAME;
            //MIDDLE_NAME = empBasicData.MIDDLE_NAME;
            //LAST_NAME = empBasicData.LAST_NAME;
            //EMAIL_ADDR = empBasicData.EMAIL_ADDR;
            //PHONE_NUMBER = empBasicData.PHONE_NUMBER;
            //ACTV_IND = empBasicData.ACTV_IND;

            EmpRole = new List<EmployeeRole>();
            EmpGeo = new List<EmployeeGeo>();
            EmpVertical = new List<EmployeeVertical>();
        }

        public List<EmployeeRole> EmpRole { get; set; }
        public List<EmployeeGeo> EmpGeo { get; set; }
        public List<EmployeeVertical> EmpVertical { get; set; }

        public string FullName
        {
            get { return LAST_NAME + ", " + FIRST_NAME + " " + MIDDLE_NAME; }
        }

        public List<ApplicationRoleLookup> EmpAppRoles { get; set; }
    }
}