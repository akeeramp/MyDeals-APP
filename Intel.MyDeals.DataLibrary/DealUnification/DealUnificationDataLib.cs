using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.DBAccess;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    internal class DealUnificationDataLib : IDealUnificationDataLib
    {
        public List<UnificationReconciliationReport> GetDealUnificationReport()
        {
            List<UnificationReconciliationReport> result = new List<UnificationReconciliationReport>();
            var cmd = new Procs.dbo.PR_MYDL_UCD_RPT();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_Customer_Name = DB.GetReaderOrdinal(rdr, "Customer Name");
                int IDX_Deal_Created_Date = DB.GetReaderOrdinal(rdr, "Deal Created Date");
                int IDX_Deal_End_Date = DB.GetReaderOrdinal(rdr, "Deal End Date");
                int IDX_Deal_Geo = DB.GetReaderOrdinal(rdr, "Deal Geo");
                int IDX_Deal_Id = DB.GetReaderOrdinal(rdr, "Deal Id");
                int IDX_Deal_Stage = DB.GetReaderOrdinal(rdr, "Deal Stage");
                int IDX_Deal_Start_Date = DB.GetReaderOrdinal(rdr, "Deal Start Date");
                int IDX_Deal_Type = DB.GetReaderOrdinal(rdr, "Deal Type");
                int IDX_End_Customer_Country_Region = DB.GetReaderOrdinal(rdr, "End Customer Country / Region");
                int IDX_End_Customer_Retail = DB.GetReaderOrdinal(rdr, "End Customer Retail");
                int IDX_GEO_APPROVED_BY = DB.GetReaderOrdinal(rdr, "GEO_APPROVED_BY");
                int IDX_Group_Type = DB.GetReaderOrdinal(rdr, "Group Type");
                int IDX_Is_Unified = DB.GetReaderOrdinal(rdr, "Is_Unified");
                int IDX_Payout_Based_On = DB.GetReaderOrdinal(rdr, "Payout Based On");
                int IDX_Program_Payment = DB.GetReaderOrdinal(rdr, "Program Payment");
                int IDX_Quote_Line_Id = DB.GetReaderOrdinal(rdr, "Quote Line Id");
                int IDX_Rebate_Type = DB.GetReaderOrdinal(rdr, "Rebate Type");
                int IDX_RPL_Status_Code = DB.GetReaderOrdinal(rdr, "RPL Status Code");
                int IDX_Unified_Customer_Country_ID = DB.GetReaderOrdinal(rdr, "Unified Customer Country ID");
                int IDX_Unified_Customer_Name = DB.GetReaderOrdinal(rdr, "Unified Customer Name");
                int IDX_Unified_Global_Customer_ID = DB.GetReaderOrdinal(rdr, "Unified Global Customer ID");

                while (rdr.Read())
                {
                    result.Add(new UnificationReconciliationReport
                    {
                        Customer_Name = (IDX_Customer_Name < 0 || rdr.IsDBNull(IDX_Customer_Name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer_Name),
                        Deal_Created_Date = (IDX_Deal_Created_Date < 0 || rdr.IsDBNull(IDX_Deal_Created_Date)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_Deal_Created_Date),
                        Deal_End_Date = (IDX_Deal_End_Date < 0 || rdr.IsDBNull(IDX_Deal_End_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_End_Date),
                        Deal_Geo = (IDX_Deal_Geo < 0 || rdr.IsDBNull(IDX_Deal_Geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Geo),
                        Deal_Id = (IDX_Deal_Id < 0 || rdr.IsDBNull(IDX_Deal_Id)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_Deal_Id),
                        Deal_Stage = (IDX_Deal_Stage < 0 || rdr.IsDBNull(IDX_Deal_Stage)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Stage),
                        Deal_Start_Date = (IDX_Deal_Start_Date < 0 || rdr.IsDBNull(IDX_Deal_Start_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Start_Date),
                        Deal_Type = (IDX_Deal_Type < 0 || rdr.IsDBNull(IDX_Deal_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Type),
                        End_Customer_Country_Region = (IDX_End_Customer_Country_Region < 0 || rdr.IsDBNull(IDX_End_Customer_Country_Region)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_End_Customer_Country_Region),
                        End_Customer_Retail = (IDX_End_Customer_Retail < 0 || rdr.IsDBNull(IDX_End_Customer_Retail)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_End_Customer_Retail),
                        GEO_APPROVED_BY = (IDX_GEO_APPROVED_BY < 0 || rdr.IsDBNull(IDX_GEO_APPROVED_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_APPROVED_BY),
                        Group_Type = (IDX_Group_Type < 0 || rdr.IsDBNull(IDX_Group_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Group_Type),
                        Is_Unified = (IDX_Is_Unified < 0 || rdr.IsDBNull(IDX_Is_Unified)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Is_Unified),
                        Payout_Based_On = (IDX_Payout_Based_On < 0 || rdr.IsDBNull(IDX_Payout_Based_On)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Payout_Based_On),
                        Program_Payment = (IDX_Program_Payment < 0 || rdr.IsDBNull(IDX_Program_Payment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Program_Payment),
                        Quote_Line_Id = (IDX_Quote_Line_Id < 0 || rdr.IsDBNull(IDX_Quote_Line_Id)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Quote_Line_Id),
                        Rebate_Type = (IDX_Rebate_Type < 0 || rdr.IsDBNull(IDX_Rebate_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Rebate_Type),
                        RPL_Status_Code = (IDX_RPL_Status_Code < 0 || rdr.IsDBNull(IDX_RPL_Status_Code)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_Status_Code),
                        Unified_Customer_Country_ID = (IDX_Unified_Customer_Country_ID < 0 || rdr.IsDBNull(IDX_Unified_Customer_Country_ID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_Unified_Customer_Country_ID),
                        Unified_Customer_Name = (IDX_Unified_Customer_Name < 0 || rdr.IsDBNull(IDX_Unified_Customer_Name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Unified_Customer_Name),
                        Unified_Global_Customer_ID = (IDX_Unified_Global_Customer_ID < 0 || rdr.IsDBNull(IDX_Unified_Global_Customer_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Unified_Global_Customer_ID)
                    });
                }
            }

            return result;
        }
    }
}
