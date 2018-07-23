//using System.Reflection;
//using Newtonsoft.Json;

//namespace Intel.MyDeals.Entities
//{
//    public class Funfact
//    {
//        //TODO: DELETE ME - DO NOT CHECK IN - TEMP PLACEHOLDER CLASS USED TO GET PRELIMINARY CODE TO COMPILE
//        //[JsonProperty(TypeNameHandling = TypeNameHandling.Objects)]
//        //public Funfact[] items { get; set; }

//        //[JsonProperty(TypeNameHandling = TypeNameHandling.Objects)]
//        //public bool expanded { get; set; }      //determines whether this particular hierarchy node is expanded by default
//        //OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD< 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
//        //                OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID< 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
//        //                OBJ_TYPE = (IDX_OBJ_TYPE< 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE),
//        //                OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID< 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
//        //                ROLE_TIER_NM = (IDX_ROLE_TIER_NM< 0 || rdr.IsDBNull(IDX_ROLE_TIER_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_NM),
//        //                TRKR_NBR_UPD = (IDX_TRKR_NBR_UPD >= 0 && !rdr.IsDBNull(IDX_TRKR_NBR_UPD)) && ((bool)rdr[IDX_TRKR_NBR_UPD]),
//        //                WF_NM = (IDX_WF_NM< 0 || rdr.IsDBNull(IDX_WF_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_NM),
//        //                WF_SID = (IDX_WF_SID< 0 || rdr.IsDBNull(IDX_WF_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
//        //                WFSTG_ACTN_NM = (IDX_WFSTG_ACTN_NM< 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_NM),
//        //                WFSTG_ACTN_SID = (IDX_WFSTG_ACTN_SID< 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ACTN_SID),
//        //                WFSTG_CD_DEST = (IDX_WFSTG_CD_DEST< 0 || rdr.IsDBNull(IDX_WFSTG_CD_DEST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_DEST),
//        //                WFSTG_CD_SRC = (IDX_WFSTG_CD_SRC< 0 || rdr.IsDBNull(IDX_WFSTG_CD_SRC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_SRC),
//        //                WFSTG_DEST_MBR_SID = (IDX_WFSTG_DEST_MBR_SID< 0 || rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
//        //                WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID< 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID)

//        public string OBJ_SET_TYPE_CD { get; set; }
//        public int OBJ_SET_TYPE_SID { get; set; }
//        public string OBJ_TYPE { get; set; }
//        public int OBJ_TYPE_SID { get; set; }
//        public string ROLE_TIER_NM { get; set; }
//        public bool TRKR_NBR_UPD { get; set; }
//        public string WF_NM { get; set; }
//        public int WF_SID { get; set; }
//        public string WFSTG_ACTN_NM { get; set; }
//        public int WFSTG_ACTN_SID { get; set; }
//        public string WFSTG_CD_DEST { get; set; }
//        public string WFSTG_CD_SRC { get; set; }
//        public int WFSTG_DEST_MBR_SID { get; set; }
//        public int WFSTG_MBR_SID { get; set; }


//        public Funfact() {
//            this.OBJ_SET_TYPE_CD = null;
//        }

//        //public Funfact(BasicDropdown bd)
//        //{
//        //    this.items = null;
//        //    this.expanded = false;
//        //    PropertyInfo[] properties = typeof(BasicDropdown).GetProperties();
//        //    foreach (PropertyInfo property in properties)
//        //    {
//        //        property.SetValue(this, property.GetValue(bd));
//        //    }
//        //}
//    }


//}