using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class PctMctFailureException
    {
        [DataMember]
        public System.Int32 Contract_ID { set; get; }

        [DataMember]
        public System.Int32 Deal_ID { set; get; }

        [DataMember]
        public System.String Deal_Type { set; get; }

        [DataMember]
        public System.String Deal_Stage { set; get; }

        [DataMember]
        public System.DateTime Deal_Start_Date { set; get; }

        [DataMember]
        public System.DateTime Deal_End_Date { set; get; }

        [DataMember]
        public System.String Forcast_Alt_Id { set; get; }

        [DataMember]
        public System.String Deal_Product_Processor_Number { set; get; }

        [DataMember]
        public System.String Product_Bucket { set; get; }

        [DataMember]
        public System.String Market_Segment { set; get; }

        [DataMember]
        public System.String Geo { set; get; }

        [DataMember]
        public System.String Payout_Based_On { set; get; }

        [DataMember]
        public System.String Program_Payment { set; get; }

        [DataMember]
        public System.String Cost_Type { set; get; }

        [DataMember]
        public System.String Rebate_Type { set; get; }

        [DataMember]
        public System.String Group_type { set; get; }

        [DataMember]
        public System.Decimal CAP { set; get; }

        [DataMember]
        public System.Decimal MAX_RPU { set; get; }

        [DataMember]
        public System.Decimal YCS2 { set; get; }

        [DataMember]
        public System.Decimal ECAP_Price { set; get; }

        [DataMember]
        public System.Decimal Retail_Pull_Dollar { set; get; }

        [DataMember]
        public System.Decimal Product_Cost { set; get; }

        [DataMember]
        public System.Decimal Lowest_Net_Price { set; get; }

        [DataMember]
        public System.String Price_Cost_Test_Result { set; get; }

        [DataMember]
        public System.Decimal Meet_Comp_Price { set; get; }

        [DataMember]
        public System.Decimal Average_Net_Price { set; get; }

        [DataMember]
        public System.String Meet_Comp_Test_Result { set; get; }

        [DataMember]
        public System.String Division_Approver { set; get; }

        [DataMember]
        public System.String Division_Approved_Date { set; get; }

        [DataMember]
        public System.String Geo_Approver { set; get; }

        [DataMember]
        public System.String Geo_Approved_Date { set; get; }

        [DataMember]
        public System.String Deal_Created_By { set; get; }

        [DataMember]
        public System.DateTime Deal_Created_Date { set; get; }

        [DataMember]
        public System.String Customer { set; get; }

        [DataMember]
        public System.String Ceiling_Volume { set; get; }

        [DataMember]
        public System.String PCT_MCT_Skip { set; get; }

        [DataMember]
        public System.String PCT_MCT_Skip_Date { set; get; }

        [DataMember]
        public System.String PCT_MCT_Skip_User { set; get; }

        [DataMember]
        public System.Decimal Current_Product_Cost { set; get; }

        [DataMember]
        public System.Decimal Current_CAP { set; get; }

        [DataMember]
        public System.Decimal Current_YCS2 { set; get; }

        [DataMember]
        public System.Decimal Current_MAX_RPU { set; get; }

        [DataMember]
        public System.Decimal Current_Lowest_Net_Price { set; get; }

        [DataMember]
        public System.String Current_Price_Cost_Test_Result { set; get; }

        [DataMember]
        public System.Decimal Current_Average_Net_Price { set; get; }

        [DataMember]
        public System.String Current_Meet_Comp_Test_Result { set; get; }
    }
}