using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities.deal;
using System.Net.NetworkInformation;
using System.Xml.Linq;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Logical;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;
using System.Drawing;
using static Intel.MyDeals.Entities.EN;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

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
                int IDX_YEAR_WISE = DB.GetReaderOrdinal(rdr, "YEAR WISE");

                while (rdr.Read())
                {
                    reportDealStage.Add(new ReportDealStage
                    {
                        DEAL_STAGE = (IDX_DEAL_STAGE < 0 || rdr.IsDBNull(IDX_DEAL_STAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_STAGE),
                        Deal_Stage_Count = (IDX_Deal_Stage_Count < 0 || rdr.IsDBNull(IDX_Deal_Stage_Count)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Stage_Count),
                        YEAR_WISE = (IDX_YEAR_WISE < 0 || rdr.IsDBNull(IDX_YEAR_WISE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_YEAR_WISE)
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

                //TABLE 7 Taken
                rdr.NextResult();
                List<ReportDealTypeStage> reportDealTypeStage = new List<ReportDealTypeStage>();

                int IDX_DEAL_COUNT = DB.GetReaderOrdinal(rdr, "Deal Count");
                int IDX_DEAL_TYPE_STAGE = DB.GetReaderOrdinal(rdr, "DEAL STAGE");
                int IDX_DEAL_TYPES = DB.GetReaderOrdinal(rdr, "DEAL TYPE");

                while (rdr.Read())
                {
                    reportDealTypeStage.Add(new ReportDealTypeStage
                    { 
                        DEAL_COUNT = (IDX_DEAL_COUNT < 0 || rdr.IsDBNull(IDX_DEAL_COUNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_COUNT),
                        DEAL_STAGE = (IDX_DEAL_TYPE_STAGE < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_STAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_STAGE),
                        DEAL_TYPE = (IDX_DEAL_TYPES < 0 || rdr.IsDBNull(IDX_DEAL_TYPES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPES)
                    });
                } // while

                //TABLE 11 Taken
                rdr.NextResult();
                List<ReportCustomerReport> reportCustomerReport = new List<ReportCustomerReport>();

                int IDX_DEAL_COUNT_4 = DB.GetReaderOrdinal(rdr, "Deal Count");
                int IDX_Customer_Name = DB.GetReaderOrdinal(rdr, "Customer Name");

                while (rdr.Read())
                {
                    reportCustomerReport.Add(new ReportCustomerReport
                    {
                        DEAL_COUNT = (IDX_DEAL_COUNT_4 < 0 || rdr.IsDBNull(IDX_DEAL_COUNT_4)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_COUNT_4),
                        CUSTOMER_NAME = (IDX_Customer_Name < 0 || rdr.IsDBNull(IDX_Customer_Name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer_Name)
                    });
                } // while

                //TABLE 12 Taken
                rdr.NextResult();
                List<ReportDealTypeQuarter> reportDealTypeQuarter = new List<ReportDealTypeQuarter>();

                int IDX_DEAL_TYPE_1 = DB.GetReaderOrdinal(rdr, "DEAL TYPE");
                int IDX_QUARTER = DB.GetReaderOrdinal(rdr, "QUARTER");
                int IDX_DEAL_COUNT_5 = DB.GetReaderOrdinal(rdr, "DEAL COUNT");

                while (rdr.Read())
                {
                    reportDealTypeQuarter.Add(new ReportDealTypeQuarter
                    {
                        DEAL_TYPE = (IDX_DEAL_TYPE_1 < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_1)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_1),
                        QUARTER = (IDX_QUARTER < 0 || rdr.IsDBNull(IDX_QUARTER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_QUARTER),
                        DEAL_COUNT = (IDX_DEAL_COUNT_5 < 0 || rdr.IsDBNull(IDX_DEAL_COUNT_5)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_COUNT_5),
                    });
                } // while

                //TABLE 13 Taken
                rdr.NextResult();
                List<ReportProducts> reportProducts = new List<ReportProducts>();

                int PRODUCT = DB.GetReaderOrdinal(rdr, "PRODUCT");
                int IDX_DEAL_COUNT_6 = DB.GetReaderOrdinal(rdr, "DEAL_COUNT");

                while (rdr.Read())
                {
                    reportProducts.Add(new ReportProducts
                    {
                        PRODUCT = (PRODUCT < 0 || rdr.IsDBNull(PRODUCT)) ? String.Empty : rdr.GetFieldValue<System.String>(PRODUCT),
                        DEAL_COUNT = (IDX_DEAL_COUNT_6 < 0 || rdr.IsDBNull(IDX_DEAL_COUNT_6)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_COUNT_6),
                    });
                } // while

                rdr.NextResult();
                List<ReportAllDealCount> reportAllDealCount = new List<ReportAllDealCount>();
                int IDX_Customer_Count_All = DB.GetReaderOrdinal(rdr, "Customer Count");
                int IDX_Deal_Count_All = DB.GetReaderOrdinal(rdr, "Deal Count");
                int IDX_DEAL_TYPE_All = DB.GetReaderOrdinal(rdr, "DEAL TYPE");
                int IDX_Distinct_Customer_All = DB.GetReaderOrdinal(rdr, "Distinct Customer");
                int IDX_Product_Count_All = DB.GetReaderOrdinal(rdr, "Product Count");
                int IDX_Total_Dollar_Amount_All = DB.GetReaderOrdinal(rdr, "Total Dollar Amount");

                while (rdr.Read())
                {
                    reportAllDealCount.Add(new ReportAllDealCount
                    {
                        Customer_Count = (IDX_Customer_Count_All < 0 || rdr.IsDBNull(IDX_Customer_Count_All)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Customer_Count_All),
                        Deal_Count = (IDX_Deal_Count_All < 0 || rdr.IsDBNull(IDX_Deal_Count_All)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Count_All),
                        DEAL_TYPE = (IDX_DEAL_TYPE_All < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_All)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_All),
                        Distinct_Customer = (IDX_Distinct_Customer_All < 0 || rdr.IsDBNull(IDX_Distinct_Customer_All)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Distinct_Customer_All),
                        Product_Count = (IDX_Product_Count_All < 0 || rdr.IsDBNull(IDX_Product_Count_All)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Product_Count_All),
                        Total_Dollar_Amount = (IDX_Total_Dollar_Amount_All < 0 || rdr.IsDBNull(IDX_Total_Dollar_Amount_All)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Total_Dollar_Amount_All)
                    });
                } // while

                rmd.ReportDashboardData = reportDashboardData;
                rmd.ReportDealStage = reportDealStage;
                rmd.ReportDealType = reportDealType;
                rmd.ReportProductCount = reportProductCount;
                rmd.ReportLogDeatils = reportLogDeatils;
                rmd.ReportSummary = reportSummary;
                rmd.ReportName = reportName;
                rmd.ReportDealTypeStage = reportDealTypeStage;
                rmd.ReportCustomerReport = reportCustomerReport;
                rmd.ReportDealTypeQuarter = reportDealTypeQuarter;
                rmd.ReportProducts = reportProducts;
                rmd.ReportAllDealCount = reportAllDealCount;
            }

            return rmd;
        }

        public List<ReportMissingCostData> GetReportMissingCostData()
        {
            var cmd = new Procs.dbo.PR_MYDL_DQ_MISS_PRD_COST_DEAL
            {
                l_is_ui_call = true
            };
            List<ReportMissingCostData> reportMissingCostData = new List<ReportMissingCostData>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRODUCT_NAME = DB.GetReaderOrdinal(rdr, "Product Name");
                int IDX_VERTICAL = DB.GetReaderOrdinal(rdr, "Vertical");
                int IDX_BRAND = DB.GetReaderOrdinal(rdr, "Brand");
                int IDX_FAMILY = DB.GetReaderOrdinal(rdr, "Family");
                int IDX_PROCESSOR = DB.GetReaderOrdinal(rdr, "Processor");
                int IDX_MISSING_YEAR_AND_QUARTER = DB.GetReaderOrdinal(rdr, "Missing Year and Quarter");
                int IDX_IMPACTED_DEALS = DB.GetReaderOrdinal(rdr, "Impacted Deals");


                while (rdr.Read())
                {
                    reportMissingCostData.Add(new ReportMissingCostData
                    {
                        ProductName = (IDX_PRODUCT_NAME < 0 || rdr.IsDBNull(IDX_PRODUCT_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_NAME),
                        Vertical = (IDX_VERTICAL < 0 || rdr.IsDBNull(IDX_VERTICAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VERTICAL),
                        Brand = (IDX_BRAND < 0 || rdr.IsDBNull(IDX_BRAND)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRAND),
                        Family = (IDX_FAMILY < 0 || rdr.IsDBNull(IDX_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FAMILY),
                        Processor = (IDX_PROCESSOR < 0 || rdr.IsDBNull(IDX_PROCESSOR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROCESSOR),
                        MissingYearAndCost = (IDX_MISSING_YEAR_AND_QUARTER < 0 || rdr.IsDBNull(IDX_MISSING_YEAR_AND_QUARTER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MISSING_YEAR_AND_QUARTER),
                        ImpactedDeals = (IDX_IMPACTED_DEALS < 0 || rdr.IsDBNull(IDX_IMPACTED_DEALS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IMPACTED_DEALS),
                    });


                };
            } // while


            return reportMissingCostData;
        }

        public List<ReportNewProductMissingCostData> GetNewProductReportMissingCostData()
        {
            var cmd = new Procs.dbo.PR_MYDL_DQ_NEW_PRODUCT_MISSING_COST
            {
                l_is_ui_call = true
            };
            List<ReportNewProductMissingCostData> reportMissingCostData = new List<ReportNewProductMissingCostData>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRODUCT_NAME = DB.GetReaderOrdinal(rdr, "Product Name");
                int IDX_VERTICAL = DB.GetReaderOrdinal(rdr, "Vertical");
                int IDX_BRAND = DB.GetReaderOrdinal(rdr, "Brand");
                int IDX_FAMILY = DB.GetReaderOrdinal(rdr, "Family");
                int IDX_PROCESSOR = DB.GetReaderOrdinal(rdr, "Processor");
                int IDX_PRODUCT_ID = DB.GetReaderOrdinal(rdr, "Product ID");
                int IDX_ISSUE = DB.GetReaderOrdinal(rdr, "Issue");
                int IDX_DAYS_AGO = DB.GetReaderOrdinal(rdr, "Days Ago");
                int IDX_MISSING_YEAR_AND_QUARTER_1 = DB.GetReaderOrdinal(rdr, "Missing Year and Qtr");


                while (rdr.Read())
                {
                    reportMissingCostData.Add(new ReportNewProductMissingCostData
                    {

                        ProductName = (IDX_PRODUCT_NAME < 0 || rdr.IsDBNull(IDX_PRODUCT_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_NAME),
                        Vertical = (IDX_VERTICAL < 0 || rdr.IsDBNull(IDX_VERTICAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VERTICAL),
                        Brand = (IDX_BRAND < 0 || rdr.IsDBNull(IDX_BRAND)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRAND),
                        Family = (IDX_FAMILY < 0 || rdr.IsDBNull(IDX_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FAMILY),
                        Processor = (IDX_PROCESSOR < 0 || rdr.IsDBNull(IDX_PROCESSOR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROCESSOR),
                        ProducID = (IDX_PRODUCT_ID < 0 || rdr.IsDBNull(IDX_PRODUCT_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRODUCT_ID),
                        Issue = (IDX_ISSUE < 0 || rdr.IsDBNull(IDX_ISSUE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ISSUE),
                        DaysAgo = (IDX_DAYS_AGO < 0 || rdr.IsDBNull(IDX_DAYS_AGO)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DAYS_AGO),
                        MissingYearAndCost = (IDX_MISSING_YEAR_AND_QUARTER_1 < 0 || rdr.IsDBNull(IDX_MISSING_YEAR_AND_QUARTER_1)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MISSING_YEAR_AND_QUARTER_1)
                    });


                };
            } // while


            return reportMissingCostData;
        }

        public List<UCMReportData> GetUCMReportData()
        {
            var cmd = new Procs.dbo.PR_MYDEAL_UCM_RPT{};
            List<UCMReportData> objUCMReportData = new List<UCMReportData>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL ID");
                int IDX_CUSTOMER_NAME = DB.GetReaderOrdinal(rdr, "CUSTOMER NAME");
                int IDX_DEAL_START_DATE = DB.GetReaderOrdinal(rdr, "DEAL START DATE");
                int IDX_DEAL_END_DATE = DB.GetReaderOrdinal(rdr, "DEAL END DATE");
                int IDX_DEAL_STAGE = DB.GetReaderOrdinal(rdr, "DEAL STAGE");
                int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END CUSTOMER/ RETAIL");
                int IDX_END_CUSTOMER_COUNTRY_REGION = DB.GetReaderOrdinal(rdr, "END CUSTOMER COUNTRY/REGION");
                int IDX_UNIFIED_GLOBAL_CUSTOMER_ID = DB.GetReaderOrdinal(rdr, "UNIFIED GLOBAL CUSTOMER ID");
                int IDX_UNIFIED_GLOBAL_CUSTOMER_NAME = DB.GetReaderOrdinal(rdr, "UNIFIED GLOBAL CUSTOMER NAME");
                int IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_ID = DB.GetReaderOrdinal(rdr, "UNIFIED COUNTRY/REGION CUSTOMER ID");
                int IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_NAME = DB.GetReaderOrdinal(rdr, "UNIFIED COUNTRY/REGION CUSTOMER NAME");
                int IDX_RPL_STATUS = DB.GetReaderOrdinal(rdr, "RPL STATUS");
                int IDX_RPL_STATUS_CODE = DB.GetReaderOrdinal(rdr, "RPL STATUS CODE");

                while (rdr.Read())
                {
                    objUCMReportData.Add(new UCMReportData
                    {

                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        CustomerName = (IDX_CUSTOMER_NAME < 0 || rdr.IsDBNull(IDX_CUSTOMER_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUSTOMER_NAME),
                        DealStartDate = (IDX_DEAL_START_DATE < 0 || rdr.IsDBNull(IDX_DEAL_START_DATE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_START_DATE),
                        DealEndDate = (IDX_DEAL_END_DATE < 0 || rdr.IsDBNull(IDX_DEAL_END_DATE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_END_DATE),
                        DealStage = (IDX_DEAL_STAGE < 0 || rdr.IsDBNull(IDX_DEAL_STAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_STAGE),
                        EndCustomerRetail = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                        EndCustomerCountryRegion = (IDX_END_CUSTOMER_COUNTRY_REGION < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_COUNTRY_REGION)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_COUNTRY_REGION),
                        UnifiedGlobalCustomerId = (IDX_UNIFIED_GLOBAL_CUSTOMER_ID < 0 || rdr.IsDBNull(IDX_UNIFIED_GLOBAL_CUSTOMER_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UNIFIED_GLOBAL_CUSTOMER_ID),
                        UnifiedGlobalCustomerName = (IDX_UNIFIED_GLOBAL_CUSTOMER_NAME < 0 || rdr.IsDBNull(IDX_UNIFIED_GLOBAL_CUSTOMER_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UNIFIED_GLOBAL_CUSTOMER_NAME),
                        UnifiedCountryRegionCustomerId= (IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_ID < 0 || rdr.IsDBNull(IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_ID),
                        UnifiedCountryRegionCustomerName= (IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_NAME < 0 || rdr.IsDBNull(IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UNIFIED_COUNTRY_REGION_CUSTOMER_NAME),
                        RplStatus= (IDX_RPL_STATUS < 0 || rdr.IsDBNull(IDX_RPL_STATUS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_RPL_STATUS),
                        RplStatusCode= (IDX_RPL_STATUS_CODE < 0 || rdr.IsDBNull(IDX_RPL_STATUS_CODE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STATUS_CODE),
                    });
                };
            } // while


            return objUCMReportData;
        }
    }
}
