using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary
{
    public class ValidateVistexR3ChecksDataLib : IValidateVistexR3ChecksDataLib
    {

        public ValidateVistexR3Wrapper ValidateVistexR3Check(List<int> dealIds, int action, string custName)
        {
			var CutoverResults = new List<R3CutoverResponse>();
			var CutoverPassedDeals = new List<R3CutoverResponsePassedDeals>();
			//@in_deal_list = @OBJ_IDS
			try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_R3_CUT_OVER_VALIDATION
                {
                    in_deal_list = new type_int_list(dealIds.ToArray())
                }))
                {
					int IDX_Limit = DB.GetReaderOrdinal(rdr, "$ Limit");
					int IDX_Additive_Standalone = DB.GetReaderOrdinal(rdr, "Additive/Standalone");
					int IDX_AR_Settlement_Level = DB.GetReaderOrdinal(rdr, "AR Settlement Level");
					int IDX_Ceiling_Limit_End_Volume_for_VT = DB.GetReaderOrdinal(rdr, "Ceiling Limit/End Volume (for VT)");
					int IDX_COMMENTS = DB.GetReaderOrdinal(rdr, "COMMENTS");
					int IDX_Consumption_Customer_Platform = DB.GetReaderOrdinal(rdr, "Consumption Customer Platform");
					int IDX_Consumption_Customer_Reported_Geo = DB.GetReaderOrdinal(rdr, "Consumption Customer Reported Geo");
					int IDX_Consumption_Customer_Segment = DB.GetReaderOrdinal(rdr, "Consumption Customer Segment");
					int IDX_Consumption_Reason = DB.GetReaderOrdinal(rdr, "Consumption Reason");
					int IDX_Consumption_Reason_Comment = DB.GetReaderOrdinal(rdr, "Consumption Reason Comment");
					int IDX_Customer_Division = DB.GetReaderOrdinal(rdr, "Customer Division");
					int IDX_Customer_Name = DB.GetReaderOrdinal(rdr, "Customer Name");
					int IDX_Deal_Description = DB.GetReaderOrdinal(rdr, "Deal Description");
					int IDX_Deal_End_Date = DB.GetReaderOrdinal(rdr, "Deal End Date");
					int IDX_Deal_Id = DB.GetReaderOrdinal(rdr, "Deal Id");
					int IDX_Deal_Stage = DB.GetReaderOrdinal(rdr, "Deal Stage");
					int IDX_Deal_Start_Date = DB.GetReaderOrdinal(rdr, "Deal Start Date");
					int IDX_Deal_Type = DB.GetReaderOrdinal(rdr, "Deal Type");
					int IDX_Division_Approved_Date = DB.GetReaderOrdinal(rdr, "Division Approved Date");
					int IDX_Division_Approver = DB.GetReaderOrdinal(rdr, "Division Approver");
					int IDX_End_Customer = DB.GetReaderOrdinal(rdr, "End Customer");
					int IDX_End_Customer_Country = DB.GetReaderOrdinal(rdr, "End Customer Country");
					int IDX_End_Customer_Retailer = DB.GetReaderOrdinal(rdr, "End Customer/Retailer");
					int IDX_Expire_Deal_Flag = DB.GetReaderOrdinal(rdr, "Expire Deal Flag");
					int IDX_Geo = DB.GetReaderOrdinal(rdr, "Geo");
					int IDX_Geo_Approver = DB.GetReaderOrdinal(rdr, "Geo Approver");
					int IDX_Is_a_Unified_Cust = DB.GetReaderOrdinal(rdr, "Is a Unified Cust");
					int IDX_Look_Back_Period_Months = DB.GetReaderOrdinal(rdr, "Look Back Period (Months)");
					int IDX_Market_Segment = DB.GetReaderOrdinal(rdr, "Market Segment");
					int IDX_Payout_Based_On = DB.GetReaderOrdinal(rdr, "Payout Based On");
					int IDX_Period_Profile = DB.GetReaderOrdinal(rdr, "Period Profile");
					int IDX_Pricing_Strategy_Stage = DB.GetReaderOrdinal(rdr, "Pricing Strategy Stage");
					int IDX_Program_Payment = DB.GetReaderOrdinal(rdr, "Program Payment");
					int IDX_Project_Name = DB.GetReaderOrdinal(rdr, "Project Name");
					int IDX_Rebate_Type = DB.GetReaderOrdinal(rdr, "Rebate Type");
					int IDX_Request_Date = DB.GetReaderOrdinal(rdr, "Request Date");
					int IDX_Request_Quarter = DB.GetReaderOrdinal(rdr, "Request Quarter");
					int IDX_Requested_by = DB.GetReaderOrdinal(rdr, "Requested by");
					int IDX_Reset_Per_Period = DB.GetReaderOrdinal(rdr, "Reset Per Period");
					int IDX_Send_To_Vistex = DB.GetReaderOrdinal(rdr, "Send To Vistex");
					int IDX_Settlement_Partner = DB.GetReaderOrdinal(rdr, "Settlement Partner");
					int IDX_System_Configuration = DB.GetReaderOrdinal(rdr, "System Configuration");
					int IDX_System_Price_Point = DB.GetReaderOrdinal(rdr, "System Price Point");
					int IDX_Unified_Customer_ID = DB.GetReaderOrdinal(rdr, "Unified Customer ID");
					int IDX_Vertical = DB.GetReaderOrdinal(rdr, "Vertical");

					while (rdr.Read())
					{
						CutoverResults.Add(new R3CutoverResponse
						{
							Limit = (IDX_Limit < 0 || rdr.IsDBNull(IDX_Limit)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Limit),
							Additive_Standalone = (IDX_Additive_Standalone < 0 || rdr.IsDBNull(IDX_Additive_Standalone)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Additive_Standalone),
							AR_Settlement_Level = (IDX_AR_Settlement_Level < 0 || rdr.IsDBNull(IDX_AR_Settlement_Level)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AR_Settlement_Level),
							Ceiling_Limit_End_Volume_for_VT = (IDX_Ceiling_Limit_End_Volume_for_VT < 0 || rdr.IsDBNull(IDX_Ceiling_Limit_End_Volume_for_VT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Ceiling_Limit_End_Volume_for_VT),
							COMMENTS = (IDX_COMMENTS < 0 || rdr.IsDBNull(IDX_COMMENTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMMENTS),
							Consumption_Customer_Platform = (IDX_Consumption_Customer_Platform < 0 || rdr.IsDBNull(IDX_Consumption_Customer_Platform)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Consumption_Customer_Platform),
							Consumption_Customer_Reported_Geo = (IDX_Consumption_Customer_Reported_Geo < 0 || rdr.IsDBNull(IDX_Consumption_Customer_Reported_Geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Consumption_Customer_Reported_Geo),
							Consumption_Customer_Segment = (IDX_Consumption_Customer_Segment < 0 || rdr.IsDBNull(IDX_Consumption_Customer_Segment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Consumption_Customer_Segment),
							Consumption_Reason = (IDX_Consumption_Reason < 0 || rdr.IsDBNull(IDX_Consumption_Reason)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Consumption_Reason),
							Consumption_Reason_Comment = (IDX_Consumption_Reason_Comment < 0 || rdr.IsDBNull(IDX_Consumption_Reason_Comment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Consumption_Reason_Comment),
							Customer_Division = (IDX_Customer_Division < 0 || rdr.IsDBNull(IDX_Customer_Division)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer_Division),
							Customer_Name = (IDX_Customer_Name < 0 || rdr.IsDBNull(IDX_Customer_Name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer_Name),
							Deal_Description = (IDX_Deal_Description < 0 || rdr.IsDBNull(IDX_Deal_Description)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Description),
							Deal_End_Date = (IDX_Deal_End_Date < 0 || rdr.IsDBNull(IDX_Deal_End_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_End_Date),
							Deal_Id = (IDX_Deal_Id < 0 || rdr.IsDBNull(IDX_Deal_Id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Id),
							Deal_Stage = (IDX_Deal_Stage < 0 || rdr.IsDBNull(IDX_Deal_Stage)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Stage),
							Deal_Start_Date = (IDX_Deal_Start_Date < 0 || rdr.IsDBNull(IDX_Deal_Start_Date)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Start_Date),
							Deal_Type = (IDX_Deal_Type < 0 || rdr.IsDBNull(IDX_Deal_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_Type),
							Division_Approved_Date = (IDX_Division_Approved_Date < 0 || rdr.IsDBNull(IDX_Division_Approved_Date)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_Division_Approved_Date),
							Division_Approver = (IDX_Division_Approver < 0 || rdr.IsDBNull(IDX_Division_Approver)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Division_Approver),
							End_Customer = (IDX_End_Customer < 0 || rdr.IsDBNull(IDX_End_Customer)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_End_Customer),
							End_Customer_Country = (IDX_End_Customer_Country < 0 || rdr.IsDBNull(IDX_End_Customer_Country)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_End_Customer_Country),
							End_Customer_Retailer = (IDX_End_Customer_Retailer < 0 || rdr.IsDBNull(IDX_End_Customer_Retailer)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_End_Customer_Retailer),
							Expire_Deal_Flag = (IDX_Expire_Deal_Flag < 0 || rdr.IsDBNull(IDX_Expire_Deal_Flag)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Expire_Deal_Flag),
							Geo = (IDX_Geo < 0 || rdr.IsDBNull(IDX_Geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Geo),
							Geo_Approver = (IDX_Geo_Approver < 0 || rdr.IsDBNull(IDX_Geo_Approver)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Geo_Approver),
							Is_a_Unified_Cust = (IDX_Is_a_Unified_Cust < 0 || rdr.IsDBNull(IDX_Is_a_Unified_Cust)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Is_a_Unified_Cust),
							Look_Back_Period_Months = (IDX_Look_Back_Period_Months < 0 || rdr.IsDBNull(IDX_Look_Back_Period_Months)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Look_Back_Period_Months),
							Market_Segment = (IDX_Market_Segment < 0 || rdr.IsDBNull(IDX_Market_Segment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Market_Segment),
							Payout_Based_On = (IDX_Payout_Based_On < 0 || rdr.IsDBNull(IDX_Payout_Based_On)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Payout_Based_On),
							Period_Profile = (IDX_Period_Profile < 0 || rdr.IsDBNull(IDX_Period_Profile)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Period_Profile),
							Pricing_Strategy_Stage = (IDX_Pricing_Strategy_Stage < 0 || rdr.IsDBNull(IDX_Pricing_Strategy_Stage)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Pricing_Strategy_Stage),
							Program_Payment = (IDX_Program_Payment < 0 || rdr.IsDBNull(IDX_Program_Payment)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Program_Payment),
							Project_Name = (IDX_Project_Name < 0 || rdr.IsDBNull(IDX_Project_Name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Project_Name),
							Rebate_Type = (IDX_Rebate_Type < 0 || rdr.IsDBNull(IDX_Rebate_Type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Rebate_Type),
							Request_Date = (IDX_Request_Date < 0 || rdr.IsDBNull(IDX_Request_Date)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_Request_Date),
							Request_Quarter = (IDX_Request_Quarter < 0 || rdr.IsDBNull(IDX_Request_Quarter)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Request_Quarter),
							Requested_by = (IDX_Requested_by < 0 || rdr.IsDBNull(IDX_Requested_by)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Requested_by),
							Reset_Per_Period = (IDX_Reset_Per_Period < 0 || rdr.IsDBNull(IDX_Reset_Per_Period)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Reset_Per_Period),
							Send_To_Vistex = (IDX_Send_To_Vistex < 0 || rdr.IsDBNull(IDX_Send_To_Vistex)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Send_To_Vistex),
							Settlement_Partner = (IDX_Settlement_Partner < 0 || rdr.IsDBNull(IDX_Settlement_Partner)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Settlement_Partner),
							System_Configuration = (IDX_System_Configuration < 0 || rdr.IsDBNull(IDX_System_Configuration)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_System_Configuration),
							System_Price_Point = (IDX_System_Price_Point < 0 || rdr.IsDBNull(IDX_System_Price_Point)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_System_Price_Point),
							Unified_Customer_ID = (IDX_Unified_Customer_ID < 0 || rdr.IsDBNull(IDX_Unified_Customer_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Unified_Customer_ID),
							Vertical = (IDX_Vertical < 0 || rdr.IsDBNull(IDX_Vertical)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Vertical)
						});
					}

					rdr.NextResult();

					//TABLE 2
					int IDX_Customer_Name2 = DB.GetReaderOrdinal(rdr, "Customer Name");
					int IDX_Deal_Id2 = DB.GetReaderOrdinal(rdr, "Deal Id");

					while (rdr.Read())
					{
						CutoverPassedDeals.Add(new R3CutoverResponsePassedDeals
						{
							Customer_Name = (IDX_Customer_Name2 < 0 || rdr.IsDBNull(IDX_Customer_Name2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Customer_Name2),
							Deal_Id = (IDX_Deal_Id2 < 0 || rdr.IsDBNull(IDX_Deal_Id2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Deal_Id2)
						});
					} // while

				}
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

			return new ValidateVistexR3Wrapper(CutoverResults, CutoverPassedDeals);
        }

    }
}