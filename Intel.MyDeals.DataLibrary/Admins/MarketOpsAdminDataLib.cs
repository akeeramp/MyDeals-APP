using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class MarketOpsAdminDataLib
    {
        //#region MarketOps
        //public List<AdminMarketOps> GetAdminMarketOps()
        //{
        //    var ret = new List<AdminMarketOps>();

        //    var rdr =
        //        DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OPS()
        //        {
        //            idsid = Utils.ThreadUser,
        //            mode = "Select"
        //        });
        //    using (rdr)
        //    {
        //        int IDX_MrktOperId = DB.GetReaderOrdinal(rdr, "MRKTOP_MBR_SID");
        //        int IDX_MrktOperCode = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD");
        //        int IDX_MrktOperCodeId = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD_SID");
        //        int IDX_DivisionName = DB.GetReaderOrdinal(rdr, "DIV_NM");
        //        int IDX_DivisionId = DB.GetReaderOrdinal(rdr, "DIV_NM_SID");
        //        int IDX_OperationCd = DB.GetReaderOrdinal(rdr, "OP_CD");
        //        int IDX_OperationId = DB.GetReaderOrdinal(rdr, "OP_CD_SID");
        //        int IDX_GdmVerticalName = DB.GetReaderOrdinal(rdr, "GDM_VRT_NM");
        //        int IDX_PrdCategoryName = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
        //        int IDX_PrdCategoryNameId = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
        //        int IDX_BnbStatus = DB.GetReaderOrdinal(rdr, "USE_BNB_STS");
        //        int IDX_Active = DB.GetReaderOrdinal(rdr, "ACTV_IND");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOps
        //            {
        //                MRKTOP_MBR_SID = rdr.IsDBNull(IDX_MrktOperId) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MrktOperId),
        //                MRKT_OPER_CD = rdr.IsDBNull(IDX_MrktOperCode) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_MrktOperCode),
        //                MRKT_OPER_CD_SID = rdr.IsDBNull(IDX_MrktOperCodeId) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MrktOperCodeId),
        //                DIV_NM = rdr.IsDBNull(IDX_DivisionName) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DivisionName),
        //                DIV_NM_SID = rdr.IsDBNull(IDX_DivisionId) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DivisionId),
        //                OP_CD = rdr.IsDBNull(IDX_OperationCd) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_OperationCd),
        //                OP_CD_SID = rdr.IsDBNull(IDX_OperationId) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OperationId),
        //                GDM_VRT_NM = rdr.IsDBNull(IDX_GdmVerticalName) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_GdmVerticalName),
        //                PRD_CATGRY_NM = rdr.IsDBNull(IDX_PrdCategoryName) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_PrdCategoryName),
        //                PRD_CATGRY_NM_SID = rdr.IsDBNull(IDX_PrdCategoryNameId) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PrdCategoryNameId),
        //                USE_BNB_STS = rdr.IsDBNull(IDX_BnbStatus) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_BnbStatus),
        //                ACTV_IND = rdr.IsDBNull(IDX_Active) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_Active)
        //            });
        //        } // while
        //    }  // using

        //    return ret;
        //}

        //public AdminMarketOps SetAdminMarketOps(string mode, AdminMarketOps adminValues)
        //{
        //    var ret = new List<AdminMarketOps>();

        //    var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OPS()
        //    {
        //        idsid = Utils.ThreadUser,
        //        mode = mode,
        //        MrktOperId = adminValues.MRKTOP_MBR_SID,
        //        MrktOperCodeId = adminValues.MRKT_OPER_CD_SID,
        //        MrktOperCode = adminValues.MRKT_OPER_CD,
        //        DivisionId = adminValues.DIV_NM_SID,
        //        OperationCd = adminValues.OP_CD,
        //        OperationId = adminValues.OP_CD_SID,
        //        GdmVerticalName = adminValues.GDM_VRT_NM,
        //        ProductVerticalName = adminValues.PRD_CATGRY_NM,
        //        BnbStatus = adminValues.USE_BNB_STS == "1",
        //        Active = adminValues.ACTV_IND
        //    });

        //    using (rdr)
        //    {
        //        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        //        int IDX_DIV_NM = DB.GetReaderOrdinal(rdr, "DIV_NM");
        //        int IDX_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "DIV_NM_SID");
        //        int IDX_GDM_VRT_NM = DB.GetReaderOrdinal(rdr, "GDM_VRT_NM");
        //        int IDX_MRKT_OPER_CD = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD");
        //        int IDX_MRKT_OPER_CD_SID = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD_SID");
        //        int IDX_MRKTOP_MBR_SID = DB.GetReaderOrdinal(rdr, "MRKTOP_MBR_SID");
        //        int IDX_OP_CD = DB.GetReaderOrdinal(rdr, "OP_CD");
        //        int IDX_OP_CD_SID = DB.GetReaderOrdinal(rdr, "OP_CD_SID");
        //        int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
        //        int IDX_PRD_CATGRY_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
        //        int IDX_USE_BNB_STS = DB.GetReaderOrdinal(rdr, "USE_BNB_STS");
        //        int IDX_USED_IN_DEAL = DB.GetReaderOrdinal(rdr, "USED_IN_DEAL");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOps
        //            {
        //                ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        //                DIV_NM = (IDX_DIV_NM < 0 || rdr.IsDBNull(IDX_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIV_NM),
        //                DIV_NM_SID = (IDX_DIV_NM_SID < 0 || rdr.IsDBNull(IDX_DIV_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DIV_NM_SID),
        //                GDM_VRT_NM = (IDX_GDM_VRT_NM < 0 || rdr.IsDBNull(IDX_GDM_VRT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_VRT_NM),
        //                MRKT_OPER_CD = (IDX_MRKT_OPER_CD < 0 || rdr.IsDBNull(IDX_MRKT_OPER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MRKT_OPER_CD),
        //                MRKT_OPER_CD_SID = (IDX_MRKT_OPER_CD_SID < 0 || rdr.IsDBNull(IDX_MRKT_OPER_CD_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MRKT_OPER_CD_SID),
        //                MRKTOP_MBR_SID = (IDX_MRKTOP_MBR_SID < 0 || rdr.IsDBNull(IDX_MRKTOP_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MRKTOP_MBR_SID),
        //                OP_CD = (IDX_OP_CD < 0 || rdr.IsDBNull(IDX_OP_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OP_CD),
        //                OP_CD_SID = (IDX_OP_CD_SID < 0 || rdr.IsDBNull(IDX_OP_CD_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OP_CD_SID),
        //                PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
        //                PRD_CATGRY_NM_SID = (IDX_PRD_CATGRY_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CATGRY_NM_SID),
        //                USE_BNB_STS = (IDX_USE_BNB_STS < 0 || rdr.IsDBNull(IDX_USE_BNB_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USE_BNB_STS),
        //                USED_IN_DEAL = (IDX_USED_IN_DEAL < 0 || rdr.IsDBNull(IDX_USED_IN_DEAL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_USED_IN_DEAL)
        //            });
        //        } // while
        //    }  // using

        //    return ret.FirstOrDefault();
        //}
        //#endregion

        //#region MarketOpCodes
        //public List<AdminMarketOpCodes> GetAdminMarketOpCodes()
        //{
        //    var ret = new List<AdminMarketOpCodes>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OP_CODES() { idsid = Utils.ThreadUser, mode = "Select" }))
        //    {
        //        int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        //        int IDX_mrkt_op_sid = DB.GetReaderOrdinal(rdr, "MRKTOP_MBR_SID");
        //        int IDX_mrkt_op_cd = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOpCodes
        //            {
        //                ACTV_IND = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
        //                MRKTOP_MBR_SID = rdr.IsDBNull(IDX_mrkt_op_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_mrkt_op_sid),
        //                MRKT_OPER_CD = rdr.IsDBNull(IDX_mrkt_op_cd) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_mrkt_op_cd)
        //            });
        //        } // while
        //    }

        //    return ret;
        //}

        //public AdminMarketOpCodes SetAdminMarketOpCodes(string mode, AdminMarketOpCodes adminValues)
        //{
        //    var ret = new List<AdminMarketOpCodes>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OP_CODES()
        //    {
        //        idsid = Utils.ThreadUser,
        //        mode = mode,
        //        actv_ind = adminValues.ACTV_IND,
        //        mrkt_op_sid = adminValues.MRKTOP_MBR_SID,
        //        mrkt_op_cd = adminValues.MRKT_OPER_CD
        //    }))
        //    {
        //        int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        //        int IDX_mrkt_op_sid = DB.GetReaderOrdinal(rdr, "MRKTOP_MBR_SID");
        //        int IDX_mrkt_op_cd = DB.GetReaderOrdinal(rdr, "MRKT_OPER_CD");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOpCodes
        //            {
        //                ACTV_IND = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
        //                MRKTOP_MBR_SID = rdr.IsDBNull(IDX_mrkt_op_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_mrkt_op_sid),
        //                MRKT_OPER_CD = rdr.IsDBNull(IDX_mrkt_op_cd) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_mrkt_op_cd)
        //            });
        //        } // while
        //    }

        //    return ret.FirstOrDefault();
        //}
        //#endregion

        //#region MarketOpVerticals
        //public List<AdminMarketOpVerticals> GetAdminMarketOpVerticals()
        //{
        //    var ret = new List<AdminMarketOpVerticals>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OP_VERTICALS() { idsid = Utils.ThreadUser, mode = "Select" }))
        //    {
        //        int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        //        int IDX_prd_mbr_sid = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
        //        int IDX_prd_catgry_nm = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOpVerticals
        //            {

        //                ACTV_IND = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
        //                PRD_MBR_SID = rdr.IsDBNull(IDX_prd_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_prd_mbr_sid),
        //                PRD_CATGRY_NM = rdr.IsDBNull(IDX_prd_catgry_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_prd_catgry_nm)
        //            });
        //        } // while
        //    }

        //    return ret;
        //}

        //public AdminMarketOpVerticals SetAdminMarketOpVerticals(string mode, AdminMarketOpVerticals adminValues)
        //{
        //    var ret = new List<AdminMarketOpVerticals>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_MARKET_OP_VERTICALS()
        //    {
        //        idsid = Utils.ThreadUser,
        //        mode = mode,
        //        actv_ind = adminValues.ACTV_IND,
        //        prd_mbr_sid = adminValues.PRD_MBR_SID,
        //        prd_catgry_nm = adminValues.PRD_CATGRY_NM
        //    }))
        //    {
        //        int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        //        int IDX_prd_mbr_sid = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
        //        int IDX_prd_catgry_nm = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminMarketOpVerticals
        //            {
        //                ACTV_IND = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
        //                PRD_MBR_SID = rdr.IsDBNull(IDX_prd_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_prd_mbr_sid),
        //                PRD_CATGRY_NM = rdr.IsDBNull(IDX_prd_catgry_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_prd_catgry_nm)
        //            });
        //        } // while
        //    }

        //    return ret.FirstOrDefault();
        //}
        //#endregion
    }
}
