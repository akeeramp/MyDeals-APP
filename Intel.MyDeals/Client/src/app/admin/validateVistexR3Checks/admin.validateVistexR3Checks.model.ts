export interface PushValidateVistexR3Data {
	DEAL_IDS: string;
	VSTX_CUST_FLAG: boolean;
	CUST: string;
	MODE: number;
}

export interface ValidateVistexR3Wrapper {
	R3CutoverResponses: R3CutoverResponse[]
	R3CutoverResponsePassedDeals: R3CutoverResponsePassedDeals[]
}

export interface R3CutoverResponsePassedDeals {
	Customer_Name: string;
	Deal_Id: number;
}

export interface R3CutoverResponse {
	Limit: string;
	Additive_Standalone: string;
	AR_Settlement_Level: string;
	Ceiling_Limit_End_Volume_for_VT: string;
	COMMENTS: string;
	Consumption_Customer_Platform: string;
	Consumption_Customer_Reported_Geo: string;
	Consumption_Customer_Segment: string;
	Consumption_Reason: string;
	Consumption_Reason_Comment: string;
	Customer_Division: string;
	Customer_Name: string;
	Deal_Description: string;
	Deal_End_Date: string;
	Deal_Id: number;
	Deal_Stage: string;
	Deal_Start_Date: string;
	Deal_Type: string;
	Division_Approved_Date: Date;
	Division_Approver: string;
	End_Customer: string;
	End_Customer_Country: string;
	End_Customer_Retailer: string;
	Expire_Deal_Flag: string;
	Geo: string;
	Geo_Approver: string;
	Is_a_Unified_Cust: string;
	Look_Back_Period_Months: string;
	Market_Segment: string;
	Payout_Based_On: string;
	Period_Profile: string;
	Pricing_Strategy_Stage: string;
	Program_Payment: string;
	Project_Name: string;
	Rebate_Type: string;
	Request_Date: Date;
	Request_Quarter: number;
	Requested_by: string;
	Reset_Per_Period: string;
	Send_To_Vistex: string;
	Settlement_Partner: string;
	System_Configuration: string;
	System_Price_Point: string;
	Unified_Customer_ID: string;
	Vertical: string;
}