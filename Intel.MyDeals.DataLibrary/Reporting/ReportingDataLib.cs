using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    public class ReportingDataLib : IReportingDataLib
    {
        public ReportMasterData GetReportDashboard()
        {
            ReportMasterData rmd = new ReportMasterData();

            var cmd = new Procs.dbo.PR_MYDL_GET_RPT_DSBD
            {
                CRE_EMP_IDSID = OpUserStack.MyOpUserToken.Usr.Idsid
            };
            List<ReportDashboardData> reportDashboardData  = new List<ReportDashboardData>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_AVG_TIME = DB.GetReaderOrdinal(rdr, "AVG_TIME");
                int IDX_CRE_EMP_IDSID = DB.GetReaderOrdinal(rdr, "CRE_EMP_IDSID");
                int IDX_MAX_TIME = DB.GetReaderOrdinal(rdr, "MAX_TIME");
                int IDX_MIN_TIME = DB.GetReaderOrdinal(rdr, "MIN_TIME");
                int IDX_RPT_COUNT = DB.GetReaderOrdinal(rdr, "RPT_COUNT");
                int IDX_RPT_NM = DB.GetReaderOrdinal(rdr, "RPT_NM");
                int IDX_TOTAL_REPORT_TIME = DB.GetReaderOrdinal(rdr, "TOTAL REPORT TIME");
                int IDX_TOTAL_TIME = DB.GetReaderOrdinal(rdr, "TOTAL_TIME");

                while (rdr.Read())
                {
                    reportDashboardData.Add(new ReportDashboardData
                    {
                        AVG_TIME = (IDX_AVG_TIME < 0 || rdr.IsDBNull(IDX_AVG_TIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_AVG_TIME),
                        CRE_EMP_IDSID = (IDX_CRE_EMP_IDSID < 0 || rdr.IsDBNull(IDX_CRE_EMP_IDSID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRE_EMP_IDSID),
                        MAX_TIME = (IDX_MAX_TIME < 0 || rdr.IsDBNull(IDX_MAX_TIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MAX_TIME),
                        MIN_TIME = (IDX_MIN_TIME < 0 || rdr.IsDBNull(IDX_MIN_TIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MIN_TIME),
                        RPT_COUNT = (IDX_RPT_COUNT < 0 || rdr.IsDBNull(IDX_RPT_COUNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPT_COUNT),
                        RPT_NM = (IDX_RPT_NM < 0 || rdr.IsDBNull(IDX_RPT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPT_NM),
                        TOTAL_REPORT_TIME = (IDX_TOTAL_REPORT_TIME < 0 || rdr.IsDBNull(IDX_TOTAL_REPORT_TIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TOTAL_REPORT_TIME),
                        TOTAL_TIME = (IDX_TOTAL_TIME < 0 || rdr.IsDBNull(IDX_TOTAL_TIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TOTAL_TIME)
                    });
                } // while

                //TABLE 1 Taken
                rdr.NextResult();
                List<ReportDealType> reportDealType = new List<ReportDealType>();
                int IDX_Customer_Count = DB.GetReaderOrdinal(rdr, "Customer Count");
                int IDX_Deal_Count = DB.GetReaderOrdinal(rdr, "Deal Count");
                int IDX_DEAL_TYPE = DB.GetReaderOrdinal(rdr, "DEAL TYPE");
                int IDX_Distinct_Customer = DB.GetReaderOrdinal(rdr, "Distinct Customer");
                int IDX_Product_Count = DB.GetReaderOrdinal(rdr, "Product Count");
                int IDX_Total_Dollar_Amount = DB.GetReaderOrdinal(rdr, "Total Dollar Amount");

                while (rdr.Read())
                {
                    reportDealType.Add(new ReportDealType
                    {
                        Customer_Count = (IDX_Customer_Count < 0 || rdr.IsDBNull(IDX_Customer_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Customer_Count),
                        Deal_Count = (IDX_Deal_Count < 0 || rdr.IsDBNull(IDX_Deal_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Count),
                        DEAL_TYPE = (IDX_DEAL_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE),
                        Distinct_Customer = (IDX_Distinct_Customer < 0 || rdr.IsDBNull(IDX_Distinct_Customer)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Distinct_Customer),
                        Product_Count = (IDX_Product_Count < 0 || rdr.IsDBNull(IDX_Product_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Product_Count),
                        Total_Dollar_Amount = (IDX_Total_Dollar_Amount < 0 || rdr.IsDBNull(IDX_Total_Dollar_Amount)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Total_Dollar_Amount)
                    });
                } // while

                //TABLE 2 Taken
                rdr.NextResult();
                List<ReportDealStage> reportDealStage = new List<ReportDealStage>();
                int IDX_DEAL_STAGE = DB.GetReaderOrdinal(rdr, "DEAL STAGE");
                int IDX_Deal_Stage_Count = DB.GetReaderOrdinal(rdr, "Deal Stage Count");

                while (rdr.Read())
                {
                    reportDealStage.Add(new ReportDealStage
                    {
                        DEAL_STAGE = (IDX_DEAL_STAGE < 0 || rdr.IsDBNull(IDX_DEAL_STAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_STAGE),
                        Deal_Stage_Count = (IDX_Deal_Stage_Count < 0 || rdr.IsDBNull(IDX_Deal_Stage_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Stage_Count)
                    });
                } // while

                //TABLE 3 Taken
                rdr.NextResult();
                List<ReportProductCount> reportProductCount = new List<ReportProductCount>();
                int IDX_Deal_Product_Count = DB.GetReaderOrdinal(rdr, "Deal  Product Count");
                int IDX_Primary_Product = DB.GetReaderOrdinal(rdr, "Primary Product");

                while (rdr.Read())
                {
                    reportProductCount.Add(new ReportProductCount
                    {
                        Deal_Product_Count = (IDX_Deal_Product_Count < 0 || rdr.IsDBNull(IDX_Deal_Product_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Product_Count),
                        Primary_Product = (IDX_Primary_Product < 0 || rdr.IsDBNull(IDX_Primary_Product)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Primary_Product)
                    });
                } // while

                //TABLE 4 Taken
                rdr.NextResult();
                List<ReportLogDeatils> reportLogDeatils = new List<ReportLogDeatils>();
                int IDX_ATRB_LIST = DB.GetReaderOrdinal(rdr, "ATRB_LIST");
                int IDX_END_TIME = DB.GetReaderOrdinal(rdr, "END TIME");
                int IDX_REPORT_NAME = DB.GetReaderOrdinal(rdr, "REPORT NAME");
                int IDX_START_TIME = DB.GetReaderOrdinal(rdr, "START TIME");
                int IDX_TOTAL_REPORT_TIME_TAKEN = DB.GetReaderOrdinal(rdr, "TOTAL_REPORT_TIME_TAKEN");
                int IDX_RPT_ALS_NM = DB.GetReaderOrdinal(rdr, "RPT_ALS_NM");

                while (rdr.Read())
                {
                    reportLogDeatils.Add(new ReportLogDeatils
                    {
                        ATRB_LIST = (IDX_ATRB_LIST < 0 || rdr.IsDBNull(IDX_ATRB_LIST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LIST),
                        END_TIME = (IDX_END_TIME < 0 || rdr.IsDBNull(IDX_END_TIME)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_TIME),
                        RPT_ALS_NM = (IDX_RPT_ALS_NM < 0 || rdr.IsDBNull(IDX_RPT_ALS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPT_ALS_NM),
                        REPORT_NAME = (IDX_REPORT_NAME < 0 || rdr.IsDBNull(IDX_REPORT_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_REPORT_NAME),
                        START_TIME = (IDX_START_TIME < 0 || rdr.IsDBNull(IDX_START_TIME)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_TIME),
                        TOTAL_REPORT_TIME_TAKEN = (IDX_TOTAL_REPORT_TIME_TAKEN < 0 || rdr.IsDBNull(IDX_TOTAL_REPORT_TIME_TAKEN)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TOTAL_REPORT_TIME_TAKEN)
                    });
                } // while


                //TABLE 5 Taken
                rdr.NextResult();
                List<ReportSummary> reportSummary = new List<ReportSummary>();
                int IDX_SUM_AMOUNT = DB.GetReaderOrdinal(rdr, "SUM AMOUNT");

                while (rdr.Read())
                {
                    reportSummary.Add(new ReportSummary
                    {
                        SUM_AMOUNT = (IDX_SUM_AMOUNT < 0 || rdr.IsDBNull(IDX_SUM_AMOUNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SUM_AMOUNT)
                    });
                } // while

                //TABLE 6 Taken
                rdr.NextResult();
                List<ReportName> reportName = new List<ReportName>();
                
                int IDX_COLR_CD = DB.GetReaderOrdinal(rdr, "COLR_CD");
                int IDX_CTGR_NM = DB.GetReaderOrdinal(rdr, "CTGR_NM");
                int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
                int IDX_RPT_UNIQ_NM = DB.GetReaderOrdinal(rdr, "RPT_UNIQ_NM");
                int IDX_RPT_URL = DB.GetReaderOrdinal(rdr, "RPT_URL");
                int IDX_SUB_CTGR_NM = DB.GetReaderOrdinal(rdr, "SUB_CTGR_NM");
                int IDX_UI_ORD = DB.GetReaderOrdinal(rdr, "UI_ORD");
                while (rdr.Read())
                {
                    reportName.Add(new ReportName
                    {
                        COLR_CD = (IDX_COLR_CD < 0 || rdr.IsDBNull(IDX_COLR_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COLR_CD),
                        CTGR_NM = (IDX_CTGR_NM < 0 || rdr.IsDBNull(IDX_CTGR_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTGR_NM),
                        ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
                        RPT_UNIQ_NM = (IDX_RPT_UNIQ_NM < 0 || rdr.IsDBNull(IDX_RPT_UNIQ_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPT_UNIQ_NM),
                        RPT_URL = (IDX_RPT_URL < 0 || rdr.IsDBNull(IDX_RPT_URL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPT_URL),
                        SUB_CTGR_NM = (IDX_SUB_CTGR_NM < 0 || rdr.IsDBNull(IDX_SUB_CTGR_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SUB_CTGR_NM),
                        UI_ORD = (IDX_UI_ORD < 0 || rdr.IsDBNull(IDX_UI_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UI_ORD)
                    });
                } // while

                rmd.ReportDashboardData = reportDashboardData;
                rmd.ReportDealStage = reportDealStage;
                rmd.ReportDealType = reportDealType;
                rmd.ReportProductCount = reportProductCount;
                rmd.ReportLogDeatils = reportLogDeatils;
                rmd.ReportSummary = reportSummary;
                rmd.ReportName = reportName;
            }

            return rmd;
        }
    }
}
