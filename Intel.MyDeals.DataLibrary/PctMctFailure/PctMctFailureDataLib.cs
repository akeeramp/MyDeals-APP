using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries.PctMctFailure;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary.PctMctFailure
{
    public class PctMctFailureDataLib : IPctMctFailureDataLib
    {
        public List<PctMctFailureException> GetFailedPctMctResults(int startYearQuarter, int endYearQuarter, bool includeCurrentResult)
        {
            var ret = new List<PctMctFailureException>();
            var cmd = new Procs.dbo.PR_MYDL_RPT_PCT_MCT_EXCEPTIONS
            {
                in_start_yrqtr = startYearQuarter,
                in_end_yrqtr = endYearQuarter,
                current_rslt = includeCurrentResult ? 1 : 0
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_Average_Net_Price = DB.GetReaderOrdinal(rdr, "Average Net Price");
                    int IDX_CAP = DB.GetReaderOrdinal(rdr, "CAP");
                    int IDX_Ceiling_Volume = DB.GetReaderOrdinal(rdr, "Ceiling Volume");
                    int IDX_Contract_ID = DB.GetReaderOrdinal(rdr, "Contract ID");
                    int IDX_Cost_Type = DB.GetReaderOrdinal(rdr, "Cost Type");
                    int IDX_Customer = DB.GetReaderOrdinal(rdr, "Customer");
                    int IDX_Deal_Created_By = DB.GetReaderOrdinal(rdr, "Deal Created By");
                    int IDX_Deal_Created_Date = DB.GetReaderOrdinal(rdr, "Deal Created Date");
                    int IDX_Deal_End_Date = DB.GetReaderOrdinal(rdr, "Deal End Date");
                    int IDX_Deal_ID = DB.GetReaderOrdinal(rdr, "Deal ID");
                    int IDX_Deal_Product_Processor_Number = DB.GetReaderOrdinal(rdr, "Deal Product (Processor Number)");
                    int IDX_Deal_Stage = DB.GetReaderOrdinal(rdr, "Deal Stage");
                    int IDX_Deal_Start_Date = DB.GetReaderOrdinal(rdr, "Deal Start Date");
                    int IDX_Deal_Type = DB.GetReaderOrdinal(rdr, "Deal Type");
                    int IDX_Division_Approved_Date = DB.GetReaderOrdinal(rdr, "Division Approved Date");
                    int IDX_Division_Approver = DB.GetReaderOrdinal(rdr, "Division Approver");
                    int IDX_ECAP_Price = DB.GetReaderOrdinal(rdr, "ECAP Price");
                    int IDX_Forcast_Alt_Id = DB.GetReaderOrdinal(rdr, "Forcast Alt Id");
                    int IDX_Geo = DB.GetReaderOrdinal(rdr, "Geo");
                    int IDX_Geo_Approved_Date = DB.GetReaderOrdinal(rdr, "Geo Approved Date");
                    int IDX_Geo_Approver = DB.GetReaderOrdinal(rdr, "Geo Approver");
                    int IDX_Group_type = DB.GetReaderOrdinal(rdr, "Group type");
                    int IDX_Lowest_Net_Price = DB.GetReaderOrdinal(rdr, "Lowest Net Price");
                    int IDX_Market_Segment = DB.GetReaderOrdinal(rdr, "Market Segment");
                    int IDX_MAX_RPU = DB.GetReaderOrdinal(rdr, "MAX_RPU");
                    int IDX_Meet_Comp_Price = DB.GetReaderOrdinal(rdr, "Meet Comp Price");
                    int IDX_Meet_Comp_Test_Result = DB.GetReaderOrdinal(rdr, "Meet Comp Test Result");
                    int IDX_Payout_Based_On = DB.GetReaderOrdinal(rdr, "Payout Based On");
                    int IDX_Price_Cost_Test_Result = DB.GetReaderOrdinal(rdr, "Price Cost Test Result");
                    int IDX_Product_Bucket = DB.GetReaderOrdinal(rdr, "Product Bucket");
                    int IDX_Product_Cost = DB.GetReaderOrdinal(rdr, "Product Cost");
                    int IDX_Program_Payment = DB.GetReaderOrdinal(rdr, "Program Payment");
                    int IDX_Rebate_Type = DB.GetReaderOrdinal(rdr, "Rebate Type");
                    int IDX_Retail_Pull_Dollar = DB.GetReaderOrdinal(rdr, "Retail Pull Dollar");
                    int IDX_YCS2 = DB.GetReaderOrdinal(rdr, "YCS2");
                    int IDX_PCT_MCT_Skip = DB.GetReaderOrdinal(rdr, "pct_mct_skp");
                    int IDX_PCT_MCT_Skip_Date = DB.GetReaderOrdinal(rdr, "skp_date");
                    int IDX_PCT_MCT_Skip_User = DB.GetReaderOrdinal(rdr, "skp_by_user");
                    int IDX_Current_Product_Cost = DB.GetReaderOrdinal(rdr, "Current Product Cost");
                    int IDX_Current_CAP = DB.GetReaderOrdinal(rdr, "Current CAP");
                    int IDX_Current_YCS2 = DB.GetReaderOrdinal(rdr, "Current YCS2");
                    int IDX_Current_MAX_RPU = DB.GetReaderOrdinal(rdr, "Current MAX_RPU");
                    int IDX_Current_Lowest_Net_Price = DB.GetReaderOrdinal(rdr, "Current Lowest Net Price");
                    int IDX_Current_Price_Cost_Test_Result = DB.GetReaderOrdinal(rdr, "Current Price Cost Test Result");
                    int IDX_Current_Average_Net_Price = DB.GetReaderOrdinal(rdr, "Current Average Net Price");
                    int IDX_Current_Meet_Comp_Test_Result = DB.GetReaderOrdinal(rdr, "Current Meet Comp Test Result");


                    while (rdr.Read())
                    {
                        ret.Add(new PctMctFailureException
                        {
                            Average_Net_Price = (IDX_Average_Net_Price < 0 || rdr.IsDBNull(IDX_Average_Net_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Average_Net_Price),
                            CAP = (IDX_CAP < 0 || rdr.IsDBNull(IDX_CAP)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_CAP),
                            Ceiling_Volume = (IDX_Ceiling_Volume < 0 || rdr.IsDBNull(IDX_Ceiling_Volume)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Ceiling_Volume),
                            Contract_ID = (IDX_Contract_ID < 0 || rdr.IsDBNull(IDX_Contract_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Contract_ID),
                            Cost_Type = (IDX_Cost_Type < 0 || rdr.IsDBNull(IDX_Cost_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Cost_Type),
                            Customer = (IDX_Customer < 0 || rdr.IsDBNull(IDX_Customer)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer),
                            Deal_Created_By = (IDX_Deal_Created_By < 0 || rdr.IsDBNull(IDX_Deal_Created_By)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Created_By),
                            Deal_Created_Date = (IDX_Deal_Created_Date < 0 || rdr.IsDBNull(IDX_Deal_Created_Date)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_Deal_Created_Date),
                            Deal_End_Date = (IDX_Deal_End_Date < 0 || rdr.IsDBNull(IDX_Deal_End_Date)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_Deal_End_Date),
                            Deal_ID = (IDX_Deal_ID < 0 || rdr.IsDBNull(IDX_Deal_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_ID),
                            Deal_Product_Processor_Number = (IDX_Deal_Product_Processor_Number < 0 || rdr.IsDBNull(IDX_Deal_Product_Processor_Number)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Product_Processor_Number),
                            Deal_Stage = (IDX_Deal_Stage < 0 || rdr.IsDBNull(IDX_Deal_Stage)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Stage),
                            Deal_Start_Date = (IDX_Deal_Start_Date < 0 || rdr.IsDBNull(IDX_Deal_Start_Date)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_Deal_Start_Date),
                            Deal_Type = (IDX_Deal_Type < 0 || rdr.IsDBNull(IDX_Deal_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Type),
                            Division_Approved_Date = (IDX_Division_Approved_Date < 0 || rdr.IsDBNull(IDX_Division_Approved_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Division_Approved_Date),
                            Division_Approver = (IDX_Division_Approver < 0 || rdr.IsDBNull(IDX_Division_Approver)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Division_Approver),
                            ECAP_Price = (IDX_ECAP_Price < 0 || rdr.IsDBNull(IDX_ECAP_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ECAP_Price),
                            Forcast_Alt_Id = (IDX_Forcast_Alt_Id < 0 || rdr.IsDBNull(IDX_Forcast_Alt_Id)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Forcast_Alt_Id),
                            Geo = (IDX_Geo < 0 || rdr.IsDBNull(IDX_Geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Geo),
                            Geo_Approved_Date = (IDX_Geo_Approved_Date < 0 || rdr.IsDBNull(IDX_Geo_Approved_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Geo_Approved_Date),
                            Geo_Approver = (IDX_Geo_Approver < 0 || rdr.IsDBNull(IDX_Geo_Approver)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Geo_Approver),
                            Group_type = (IDX_Group_type < 0 || rdr.IsDBNull(IDX_Group_type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Group_type),
                            Lowest_Net_Price = (IDX_Lowest_Net_Price < 0 || rdr.IsDBNull(IDX_Lowest_Net_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Lowest_Net_Price),
                            Market_Segment = (IDX_Market_Segment < 0 || rdr.IsDBNull(IDX_Market_Segment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Market_Segment),
                            MAX_RPU = (IDX_MAX_RPU < 0 || rdr.IsDBNull(IDX_MAX_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MAX_RPU),
                            Meet_Comp_Price = (IDX_Meet_Comp_Price < 0 || rdr.IsDBNull(IDX_Meet_Comp_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Meet_Comp_Price),
                            Meet_Comp_Test_Result = (IDX_Meet_Comp_Test_Result < 0 || rdr.IsDBNull(IDX_Meet_Comp_Test_Result)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Meet_Comp_Test_Result),
                            Payout_Based_On = (IDX_Payout_Based_On < 0 || rdr.IsDBNull(IDX_Payout_Based_On)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Payout_Based_On),
                            Price_Cost_Test_Result = (IDX_Price_Cost_Test_Result < 0 || rdr.IsDBNull(IDX_Price_Cost_Test_Result)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Price_Cost_Test_Result),
                            Product_Bucket = (IDX_Product_Bucket < 0 || rdr.IsDBNull(IDX_Product_Bucket)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Product_Bucket),
                            Product_Cost = (IDX_Product_Cost < 0 || rdr.IsDBNull(IDX_Product_Cost)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Product_Cost),
                            Program_Payment = (IDX_Program_Payment < 0 || rdr.IsDBNull(IDX_Program_Payment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Program_Payment),
                            Rebate_Type = (IDX_Rebate_Type < 0 || rdr.IsDBNull(IDX_Rebate_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Rebate_Type),
                            Retail_Pull_Dollar = (IDX_Retail_Pull_Dollar < 0 || rdr.IsDBNull(IDX_Retail_Pull_Dollar)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Retail_Pull_Dollar),
                            YCS2 = (IDX_YCS2 < 0 || rdr.IsDBNull(IDX_YCS2)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_YCS2),
                            PCT_MCT_Skip = (IDX_PCT_MCT_Skip < 0 || rdr.IsDBNull(IDX_PCT_MCT_Skip)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCT_MCT_Skip),
                            PCT_MCT_Skip_Date = (IDX_PCT_MCT_Skip_Date < 0 || rdr.IsDBNull(IDX_PCT_MCT_Skip_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCT_MCT_Skip_Date),
                            PCT_MCT_Skip_User = (IDX_PCT_MCT_Skip_User < 0 || rdr.IsDBNull(IDX_PCT_MCT_Skip_User)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCT_MCT_Skip_User),
                            Current_Product_Cost = (IDX_Current_Product_Cost < 0 || rdr.IsDBNull(IDX_Current_Product_Cost)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_Product_Cost),
                            Current_CAP = (IDX_Current_CAP < 0 || rdr.IsDBNull(IDX_Current_CAP)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_CAP),
                            Current_YCS2 = (IDX_Current_YCS2 < 0 || rdr.IsDBNull(IDX_Current_YCS2)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_YCS2),
                            Current_MAX_RPU = (IDX_Current_MAX_RPU < 0 || rdr.IsDBNull(IDX_Current_MAX_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_MAX_RPU),
                            Current_Lowest_Net_Price = (IDX_Current_Lowest_Net_Price < 0 || rdr.IsDBNull(IDX_Current_Lowest_Net_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_Lowest_Net_Price),
                            Current_Price_Cost_Test_Result = (IDX_Current_Price_Cost_Test_Result < 0 || rdr.IsDBNull(IDX_Current_Price_Cost_Test_Result)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Current_Price_Cost_Test_Result),
                            Current_Average_Net_Price = (IDX_Current_Average_Net_Price < 0 || rdr.IsDBNull(IDX_Current_Average_Net_Price)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_Current_Average_Net_Price),
                            Current_Meet_Comp_Test_Result = (IDX_Current_Meet_Comp_Test_Result < 0 || rdr.IsDBNull(IDX_Current_Meet_Comp_Test_Result)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Current_Meet_Comp_Test_Result)
                        });
                    }
                }

            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret;
        }
    }
}