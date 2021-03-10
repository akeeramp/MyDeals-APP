using System.Collections.Generic;
using System.Reflection;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.UI_Templates;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    internal class UiTemplateDataLib : IUiTemplateDataLib
    {
        private List<UiTemplateContainerItem> GetData()
        {
            // TODO replace with DB call and admin screen

            List<UiTemplateContainerItem> items = new List<UiTemplateContainerItem>();

            #region CONTRACT

            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 2,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT }
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT },
                DataType = "string",
                Width = 40
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT },
                DataType = "string",
                Label = "Title",
                Width = 150
            });

            #endregion CONTRACT

            #region PRICING STRATEGIES

            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 2,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST }
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST },
                DataType = "string",
                Width = 40
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST },
                DataType = "string",
                Label = "Title",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3,
                AtrbCd = AttributeCodes.TERMS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST },
                DataType = "string",
                Label = "Additional Ts And Cs",
                Width = 150
            });

            #endregion PRICING STRATEGIES

            #region PRICING TABLE

            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 2,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL }
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                DataType = "string",
                Width = 40
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                DataType = "string",
                Label = "Title",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.FLEX },
                IsDefaultable = true,
                Label = "Number of Tiers",
                IsRequired = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetNumTiersDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownID"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 19,
                AtrbCd = AttributeCodes.FLEX_ROW_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.FLEX },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/FLEX_ROW_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/PROGRAM",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/VOL_TIER",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.FLEX },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/VOL_TIER",  //change to appropriate api
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                IsDefaultable = true,
                Label = "Market Segment",
                DataType = "string",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                HelpText = "You cannot mix ALL & other market segments.\n\nNon Corp selects: Consumer retail pull, Education, Government, & SMB",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                IsDefaultable = true,
                Label = "Geo",
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 100,
                IsDefaultable = true,
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                IsDefaultable = true,
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM, OpDataElementSetType.KIT, OpDataElementSetType.FLEX  },
                Width = 100,
                IsDefaultable = true,
                IsHidden = true, // the differnce between ECAP and other deal types
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROD_INCLDS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 100,
                IsDefaultable = true,
                Label = "Media",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROD_INCLDS",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3717,
                AtrbCd = AttributeCodes.PERIOD_PROFILE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER, OpDataElementSetType.FLEX },
                Width = 160,
                IsDefaultable = true,
                Label = "Period Profile",
                UiType = "BUTTONGROUP",
                Template = "#=gridUtils.uiControlWrapper(data, 'PERIOD_PROFILE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/PERIOD_PROFILE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
           items.Add(new UiTemplateContainerItem
            {
                Id = 3458,
                AtrbCd = AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                HeaderTemplate = "<span title='Consumption Customer Reported Geo'>Customer Reported Region</ span>",
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_CUST_RPT_GEO')#",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_RPT_GEO/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsHidden = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3719,
                AtrbCd = AttributeCodes.AR_SETTLEMENT_LVL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 240,
                IsDefaultable = true,
                Label = "Settlement Level",
                UiType = "BUTTONGROUP",
                Template = "#=gridUtils.uiControlWrapper(data, 'AR_SETTLEMENT_LVL')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3573,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 140,
                IsDefaultable = true,
                Label = "Overarching Maximum Volume",
                Format = "{0:d}",
                UiType = "IntegerTextBox",
                DataType = "number",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_VOL', 'number')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3574,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_AMT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 140,
                IsDefaultable = true,
                Label = "Overarching Maximum Dollar",
                Format = "{0:d}",
                UiType = "NumericTextBox",
                DataType = "number",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_AMT', 'currency')#"
            });

            #endregion PRICING TABLE

            #region PRICING TABLE ROW

            items.Add(new UiTemplateContainerItem
            {
                Id = 200,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Row ID",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3659,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                Label = "Json String (will be hidden)",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsReadOnly = false, // need to set to true after product selector is in place
                IsHidden = true,
                Width = 220
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 7093,
                AtrbCd = AttributeCodes.PTR_SYS_INVLD_PRD,
                Label = "Invalid Json String (will be hidden)",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsReadOnly = false, // need to set to true after product selector is in place
                IsHidden = true,
                Width = 220,
                //// This is how it should be set once the product selector is in place:
                //IsReadOnly = true,
                //IsHidden = true,
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3686,
                AtrbCd = AttributeCodes.PRD_DRAWING_ORD,
                Label = "Invalid Json String (will be hidden)",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                IsReadOnly = false, // need to set to true after product selector is in place
                IsHidden = true,
                Width = 220,
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3591,
                AtrbCd = AttributeCodes.CUST_ACCNT_DIV,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 120,
                DataType = "string",
                UiType = "MULTISELECT",
                LookupUrl = "/api/Customers/GetCustomerDivisionsByCustNmSid/",
                LookupText = "CUST_DIV_NM",
                LookupValue = "CUST_DIV_NM",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3658,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                Label = "Contract Product *",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 220
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3663,
                AtrbCd = AttributeCodes.PRD_EXCLDS,
                Label = "Exclude Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 220,
                IsReadOnly = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3201,
                AtrbCd = AttributeCodes.DEAL_GRP_NM,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 200,
                Label = "Kit Name *",
                DataType = "string",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3680,
                AtrbCd = AttributeCodes.DEAL_DESC,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                Label = "Deal Description",
                DataType = "string"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 21,
                AtrbCd = AttributeCodes.TIER_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                IsReadOnly = true,
                Label = "Tier",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.STRT_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                Width = 100,
                Label = "Start Vol *"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 6,
                AtrbCd = AttributeCodes.END_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                Width = 100,
                Label = "End Vol *"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 56,
                AtrbCd = AttributeCodes.RATE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                Width = 100,
                Label = "Rate *"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 5,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                Label = "ECAP Price *",
                IsDimKey = true,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 86,
                AtrbCd = AttributeCodes.CAP,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                Label = "CAP",
                IsDimKey = false,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 201,
                AtrbCd = "YCS2",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                Label = "YCS2",
                IsDimKey = false,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 22,
                AtrbCd = AttributeCodes.TOTAL_DOLLAR_AMOUNT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 100,
                Label = "Total Dollar Amount *",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3559,
                AtrbCd = AttributeCodes.ORIG_ECAP_TRKR_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                UiType = "DROPDOWN",
                Label = "Original Tracker #",
                LookupUrl = "/api/EcapTracker/GetEcapTrackerList/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                Width = 100,
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3560,
                AtrbCd = AttributeCodes.ADJ_ECAP_UNIT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 100,
                Label = "Adjustment Ecap Unit",
                DataType = "number"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3603,
                AtrbCd = AttributeCodes.FRCST_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 100,
                Label = "Forecast Volume",
                DataType = "number"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3321,
                AtrbCd = AttributeCodes.VOLUME,
                Label = "Ceiling Volume",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 110,
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3319,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal Start Date *",
                Width = 90,
                Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3320,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal End Date *",
                Width = 90,
                Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3684,
                AtrbCd = AttributeCodes.PRD_BCKT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 150,
                Label = "Products",
                IsDimKey = true,
                IsReadOnly = true,
                DataType = "string"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 86,
                AtrbCd = "CAP",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "CAP",
                IsDimKey = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 201,
                AtrbCd = "YCS2",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "YCS2",
                IsDimKey = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 57,
                AtrbCd = AttributeCodes.RESET_VOLS_ON_PERIOD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.FLEX },
                Template = "#=gridUtils.uiControlWrapper(data, 'RESET_VOLS_ON_PERIOD')#",
                DataType = "string",
                Label = "Reset Per Period",
                Width = 140,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/RESET_VOLS_ON_PERIOD",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 5,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "ECAP Standalone *",    //different name than ECAP deal type, we also move it down here because kit mockup has this attribute listed after st/end dts
                IsDimKey = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 5,
                AtrbCd = AttributeCodes.ECAP_PRICE + "_____20_____1",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 120,
                Label = "Net Kit Price (Kit ECAP)",
                IsDimKey = false,
                DataType = "number",
                Format = "{0:c}"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 202,
                AtrbCd = "TEMP_KIT_REBATE",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 120,
                Label = "KIT Rebate / Bundle Discount",
                IsDimKey = false,
                IsReadOnly = true,
                DataType = "number",
                Format = "{0:c}"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3681,
                AtrbCd = AttributeCodes.DSCNT_PER_LN,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "Discount per line",
                IsRequired = false,
                IsDimKey = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3682,
                AtrbCd = AttributeCodes.QTY,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "Quantity",
                IsRequired = false,
                IsDimKey = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 203,
                AtrbCd = "TEMP_TOTAL_DSCNT_PER_LN",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Label = "Total Discount per line",
                IsDimKey = true,
                IsReadOnly = true,
                DataType = "number",
                Format = "{0:c}"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3717,
                AtrbCd = AttributeCodes.PERIOD_PROFILE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
                Width = 160,
                Label = "Period Profile",
                UiType = "DROPDOWN",
                Template = "#=gridUtils.uiControlWrapper(data, 'PERIOD_PROFILE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/PERIOD_PROFILE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3458,
                AtrbCd = AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                HeaderTemplate = "<span title='Consumption Customer Reported Geo'>Customer Reported Region</span>",
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_CUST_RPT_GEO')#",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_RPT_GEO/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsHidden = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3719,
                AtrbCd = AttributeCodes.AR_SETTLEMENT_LVL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 240,
                Label = "Settlement Level",
                UiType = "DROPDOWN",
                Template = "#=gridUtils.uiControlWrapper(data, 'AR_SETTLEMENT_LVL')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3573,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 140,
                Label = "Overarching Maximum Volume",
                Format = "{0:d}",
                UiType = "IntegerTextBox",
                DataType = "number",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_VOL', 'number')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3574,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_AMT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 140,
                Label = "Overarching Maximum Dollar",
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_AMT', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3348,
                AtrbCd = AttributeCodes.END_CUSTOMER_RETAIL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3711,
                AtrbCd = AttributeCodes.OEM_PLTFRM_LNCH_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiIconWrapper(data, 'OEM_PLTFRM_LNCH_DT')#",
                Label = "OEM Platform Launch Date",
                Width = 100,
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3712,
                AtrbCd = AttributeCodes.OEM_PLTFRM_EOL_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiIconWrapper(data, 'OEM_PLTFRM_EOL_DT')#",
                Label = "OEM Platform EOL Date",
                Width = 100,
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3620,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsDefaultable = true,
                Label = "Geo *",
                Width = 120,
                DataType = "string",
                UiType = "MULTISELECT",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3678,
                AtrbCd = AttributeCodes.QLTR_BID_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180,
                UiType = "MULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_BID_GEO')#",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                DataType = "string",
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3347,
                AtrbCd = AttributeCodes.SERVER_DEAL_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                UiType = "DROPDOWN",
                Template = "#=gridUtils.uiControlWrapper(data, 'SERVER_DEAL_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3568,
                AtrbCd = AttributeCodes.QLTR_PROJECT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                DataType = "string",
                Width = 180,
                Label = "Project *",
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_PROJECT')#",
                IsFilterable = true,
                IsSortable = true,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 35,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 120,
                IsDefaultable = true,
                Label = "Payout Based On *",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            /// PROGRAM_PAYMENT column behaviours in various deal types
            ///  ECAP - Editable
            ///  KIT - Readonly
            ///  VOLTIER, PROGRAM - Readonly and Hidden
            items.Add(new UiTemplateContainerItem
            {
                Id = 3495,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 130,
                IsDefaultable = true,
                Label = "Program Payment *",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3495,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT }, //KIT TODO: should it be readonly and thus here or do we move it up to be editable like ECAP?
                Width = 130,
                IsDefaultable = true,
                Label = "Program Payment *",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true,
                IsReadOnly = true   //only editable for ECAP deals
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3495,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 130,
                IsDefaultable = true,
                Label = "Program Payment *",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true,
                IsReadOnly = true,   //only editable for ECAP deals
                IsHidden = true // Hiden for VOLTIER, PROGRAM
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                IsDefaultable = true,
                Label = "Rebate Type *",
                Width = 100,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 18,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDefaultable = true,
                Label = "Rebate Type *",
                Width = 100,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/VOL_TIER",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 18,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                IsDefaultable = true,
                Label = "Rebate Type *",
                Width = 100,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/PROGRAM",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem  
            {
                Id = 19,
                AtrbCd = AttributeCodes.FLEX_ROW_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.FLEX },
                IsDefaultable = true,
                Label = "Row Type *",
                Width = 80,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/FLEX_ROW_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3353,
                AtrbCd = AttributeCodes.SETTLEMENT_PARTNER,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Settlement Partner",
                Width = 160,
                DataType = "string",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdowns/FLEX_ROW_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 21,
                AtrbCd = AttributeCodes.TIER_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                IsDimKey = true,
                IsReadOnly = false,
                Label = "Tier",
                IsHidden = true
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 3474,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsDefaultable = true,
                Label = "Market Segment *",
                Width = 160,
                DataType = "string",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                HelpText = "You cannot mix ALL & other market segments.\n\nNon Corp selects: Consumer retail pull, Education, Government, &SMB",
                IsRequired = true
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 3662,
                AtrbCd = AttributeCodes.PROD_INCLDS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "string",
                Width = 100,
                UiType = "DROPDOWN",
                Label = "Media *",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROD_INCLDS",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3569,
                AtrbCd = AttributeCodes.TERMS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                IsDimKey = false,
                Label = "Additional Ts And Cs",
                DataType = "string",
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3011,
                AtrbCd = AttributeCodes.CUST_MBR_SID,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 50,
                Label = "Customer",
                IsRequired = false,
                IsHidden = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3490,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.KIT },
                IsHidden = true
            });

            #endregion PRICING TABLE ROW

            #region WIP DEAL

            items.Add(new UiTemplateContainerItem  // Fake atrb since it is in all attribs headers, for display reasons only
            {
                Id = 10001,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                IsFilterable = true,
                IsSortable = true,
                DataType = "number",
                Label = "Deal Id",
                Width = 90,
                IsReadOnly = true,
                Locked = true,
                Lockable = false,
                Template = "#=gridUtils.uiControlDealWrapper(data, 'DC_ID')#",
                ExcelTemplate = "#=DC_ID#",
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, placeholder for a block of items for display reasons only
            {
                Id = 10002,
                AtrbCd = "details",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                DataType = "number",
                Label = "Deal Details",
                Width = 260,
                IsReadOnly = true,
                Locked = true,
                Lockable = false,
                Template = "<div><deal-detail ng-model='dataItem'></deal-detail></div>",
                BypassExport = true
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, placeholder for a block of items for display reasons only
            {
                Id = 10003,
                AtrbCd = "tools",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                DataType = "object",
                Label = "Deal Tools",
                Width = 230,
                IsSortable = false,
                IsFilterable = false,
                IsReadOnly = true,
                Locked = true,
                Lockable = false,
                Template = "<div><deal-tools ng-model='dataItem' is-editable='true'></deal-tools></div>",
                HeaderTemplate = "<input type='checkbox' ng-click='clkAllItems()' class='with-font' id='chkDealTools' /><label for='chkDealTools' style='margin: 5px 0 0 5px;'>Deal Tools</label>",
                BypassExport = true
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 10004,
                AtrbCd = "tender_actions",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                DataType = "object",
                Label = "Actions",
                Width = 110,
                IsSortable = false,
                IsFilterable = false,
                IsReadOnly = false,
                Locked = true,
                Lockable = false,
                Template = "<div id='cb_actn_#=data.DC_ID#'>#=gridUtils.getBidActions(data)#</div>",
                BypassExport = true,
                Editor = "BID_ACTNS"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 10005, //Note: placeholder ID, granted these IDs don't do anything right now but 10004 is not this attribute's id.
                AtrbCd = "CNTRCT_OBJ_SID",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                DataType = "number",
                Label = "Folio Id",
                Width = 80,
                IsSortable = true,
                IsFilterable = true,
                IsReadOnly = true,
                Locked = true,
                Lockable = false,
                Template = "#=gridUtils.uiReadonlyControlWrapper(data, 'CNTRCT_OBJ_SID')#",
                ExcelTemplate = "#=CNTRCT_OBJ_SID#",
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3668,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 50,
                IsSortable = true,
                IsFilterable = true,
                Label = "<i class='intelicon-protection-solid' style='color: #00AEEF; font-size: 20px;'></i>",
                IsReadOnly = true,
                DataType = "string",
                Template = "#=gridUtils.uiValidationErrorDetail(data)#",
                ExcelTemplate = "#=PASSED_VALIDATION#",
                ExcelHeaderLabel = "Validation Status"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit only
            {
                Id = 3201,
                AtrbCd = AttributeCodes.DEAL_GRP_NM,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 150,
                Label = "Kit Name",
                IsFilterable = true,
                IsSortable = true,
                IsReadOnly = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_GRP_NM')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb since it is in all attribs headers, for cancel/delete checks
            {
                Id = 10004,
                AtrbCd = AttributeCodes.DC_PARENT_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 90,
                Label = "Prc Table Row ID",
                Template = "#=gridUtils.uiControlWrapper(data, 'DC_PARENT_ID')#",
                IsFilterable = true,
                IsSortable = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3011,
                AtrbCd = AttributeCodes.CUST_MBR_SID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiCustomerControlWrapper(data, 'CUST_MBR_SID')#",
                HeaderTemplate = "<span title='Customer (or Division if present)'>Customer</span>",
                Label = "Customer",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                ExcelTemplate = "#=Customer.CUST_NM#"
            });

            items.Add(new UiTemplateContainerItem  // WIP All types + Dimensioned by Prod Bucket
            {
                Id = 24,
                AtrbCd = AttributeCodes.TRKR_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 130,
                Template = "#=gridUtils.uiDimTrkrControlWrapper(data)#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                ExcelTemplate = "#=gridUtils.exportDimTrkrControlWrapper(data)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types + Dimensioned by Prod Bucket
            {
                Id = 24,
                AtrbCd = AttributeCodes.AUTO_APPROVE_RULE_INFO,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Auto-approved By",
                Width = 320,
                Template = "#=gridUtils.uiReadonlyControlWrapper(data, 'AUTO_APPROVE_RULE_INFO')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3319,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiStartDateWrapper(data, 'START_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Deal Start Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = true,
                ExcelTemplate = "#=gridUtils.formatDate(START_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3320,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlEndDateWrapper(data, 'END_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Deal End Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = true,
                ExcelTemplate = "#=gridUtils.formatDate(END_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3711,
                AtrbCd = AttributeCodes.OEM_PLTFRM_LNCH_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiControlEndDateWrapper(data, 'OEM_PLTFRM_LNCH_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "OEM Platform Launch Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = false,
                ExcelTemplate = "#=gridUtils.formatDate(OEM_PLTFRM_LNCH_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3712,
                AtrbCd = AttributeCodes.OEM_PLTFRM_EOL_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiControlEndDateWrapper(data, 'OEM_PLTFRM_EOL_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "OEM Platform EOL Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = false,
                ExcelTemplate = "#=gridUtils.formatDate(OEM_PLTFRM_EOL_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3676,
                AtrbCd = AttributeCodes.EXPIRE_FLG,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Label = "Deal Expired?",
                DataType = "string",
                IsFilterable = true,
                IsSortable = true,
                Width = 90,
                Template = "#=gridUtils.uiBoolControlWrapper(data, 'EXPIRE_FLG')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3002,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Deal Type",
                Template = "#=gridUtils.uiControlWrapper(data, 'OBJ_SET_TYPE_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP type
            {
                Id = 3354,
                AtrbCd = AttributeCodes.COMPETITIVE_PRICE,
                Label = "Meet Comp Price",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Template = "<div class=\"uiControlDiv isReadOnlyCell\">#=gridUtils.uiDimControlWrapper(data, 'COMPETITIVE_PRICE', '20___0', 'currency')#</div>",
                IsSortable = true,
                Width = 100,
                DataType = "object",
                IsReadOnly = true,
                Format = "{0:c}",
                IsDimKey = true
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP type
            {
                Id = 3621,
                AtrbCd = AttributeCodes.COMP_SKU,
                Label = "Meet Comp SKU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Template = "<div class=\"uiControlDiv isReadOnlyCell\"><div class=\"vert-center\">#=gridUtils.getFormatedDim(data, 'TempCOMP_SKU', '20___0', 'string')#</div></div>",
                IsSortable = true,
                Width = 100,
                DataType = "object",
                IsReadOnly = true,
                IsDimKey = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 26,
                AtrbCd = AttributeCodes.WF_STG_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiParentControlWrapper(data, 'PS_WF_STG_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                ExcelTemplate = "#=gridUtils.stgFullTitleChar(data)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3658,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                Label = "Contract Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'PTR_USER_PRD')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3663,
                AtrbCd = AttributeCodes.PRD_EXCLDS,
                Label = "Excluded Products",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiControlWrapper(data, 'PRD_EXCLDS')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3671,
                AtrbCd = AttributeCodes.PRODUCT_CATEGORIES,
                Label = "Product Vertical",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER, OpDataElementSetType.KIT, OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiControlWrapper(data, 'PRODUCT_CATEGORIES')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3662,
                AtrbCd = AttributeCodes.PROD_INCLDS,
                Label = "Media",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'PROD_INCLDS')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });

            items.Add(new UiTemplateContainerItem  // WIP KIT
            {
                Id = 50,
                AtrbCd = AttributeCodes.PRD_BCKT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiProductDimControlWrapper(data, 'kit')#",
                Width = 140,
                Label = "My Deals Products",
                IsDimKey = true,
                IsReadOnly = true,
                DataType = "string",
                ExcelTemplate = "#=PTR_USER_PRD#"
            });
            items.Add(new UiTemplateContainerItem  // WIP KIT
            {
                Id = 50,
                AtrbCd = "PRD_BCKT_SUBKIT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiProductDimControlWrapper(data, 'subkit')#",
                Width = 140,
                Label = "Sub KIT Products",
                IsDimKey = true,
                IsReadOnly = true,
                DataType = "string",
                ExcelTemplate = "#=PTR_USER_PRD#"       //TODO: will likely need a custom excel export template for this one
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 33,
                AtrbCd = AttributeCodes.TITLE,
                Label = "My Deals Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.PROGRAM, OpDataElementSetType.VOL_TIER },
                Template = "#=gridUtils.uiProductControlWrapper(data, 'TITLE')#",
                ExcelTemplate = "#=TITLE#",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3594,
                AtrbCd = AttributeCodes.DEAL_COMB_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_COMB_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/DEAL_COMB_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                Label = "Group Type",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3594,
                AtrbCd = AttributeCodes.DEAL_COMB_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_COMB_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/DEAL_COMB_TYPE/PROGRAM",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                Label = "Group Type",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3594,
                AtrbCd = AttributeCodes.DEAL_COMB_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_COMB_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/DEAL_COMB_TYPE/VOL_TIER",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                Label = "Group Type",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            //items.Add(new UiTemplateContainerItem  // WIP All types
            //{
            //    Id = 90002,
            //    AtrbCd = AttributeCodes.DEAL_GRP_EXCLDS,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    DataType = "string",
            //    Label = "Exclude Deal Group",
            //    LookupUrl = "/api/Dropdown/GetDealGroupDropdown",
            //    LookupText = "DROP_DOWN",
            //    LookupValue = "DROP_DOWN",
            //    UiType = "EMBEDDEDMULTISELECT",
            //    Template = "#=gridUtils.uiControlWrapperWithDefault(data, 'DEAL_GRP_EXCLDS')#",
            //    Width = 140
            //});
            //items.Add(new UiTemplateContainerItem  // WIP All types
            //{
            //    Id = 90003,
            //    AtrbCd = AttributeCodes.DEAL_GRP_CMNT,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Label = "Deal Group Comment",
            //    DataType = "string",
            //    Width = 140,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_GRP_CMNT')#",
            //    IsHidden = true
            //});
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3680,
                AtrbCd = AttributeCodes.DEAL_DESC,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Deal Description",
                DataType = "string",
                IsFilterable = true,
                IsSortable = true,
                Width = 200,
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_DESC')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit types
            {
                Id = 3435,
                AtrbCd = AttributeCodes.ON_ADD_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.PROGRAM },
                Template = "#=gridUtils.uiControlWrapper(data, 'ON_ADD_DT', \"date:'MM/dd/yyyy'\")#",
                IsFilterable = true,
                IsSortable = true,
                Width = 110,
                ExcelTemplate = "#=gridUtils.formatDate(ON_ADD_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP VT types
            {
                Id = 21,
                AtrbCd = AttributeCodes.TIER_NBR, //AtrbCd = AttributeCodes.TIER_NBR - Moved to a non-always-readonly field to allow for security to drive behaviors
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Template = "#=gridUtils.uiControlScheduleWrapper(data)#",
                Editor = "scheduleEditor",
                DataType = "object",
                Label = "Rate Breakout",
                Width = 300,
                ExcelTemplate = "#=gridUtils.exportControlScheduleWrapper(data)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP types
            {
                Id = 3540,
                AtrbCd = AttributeCodes.DEAL_SOLD_TO_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                UiType = "EMBEDDEDMULTISELECT",
                Template = "#=gridUtils.uiMultiselectArrayControlWrapper(data, 'DEAL_SOLD_TO_ID')#",
                LookupUrl = "/api/Dropdown/GetSoldToIds", // TODO
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true,
                Width = 150,
                ExcelTemplate = "#=DEAL_SOLD_TO_ID#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, KIT types
            {
                Id = 3562,
                AtrbCd = AttributeCodes.EXPIRE_YCS2,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Template = "#=gridUtils.uiControlWrapper(data, 'EXPIRE_YCS2')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 115,
                LookupUrl = "/api/Dropdown/GetDropdowns/EXPIRE_YCS2",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 19,
                AtrbCd = AttributeCodes.FLEX_ROW_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.FLEX },
                Width = 80,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'FLEX_ROW_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/FLEX_ROW_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3353,
                AtrbCd = AttributeCodes.SETTLEMENT_PARTNER,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SETTLEMENT_PARTNER')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/FLEX_ROW_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem  // WIP KIT types
            {
                Id = 3462,
                AtrbCd = AttributeCodes.CS_SHIP_AHEAD_STRT_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiControlWrapper(data, 'CS_SHIP_AHEAD_STRT_DT')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 115,
                Format = "{0:d}"
            });

            items.Add(new UiTemplateContainerItem  // WIP KIT types
            {
                Id = 3463,
                AtrbCd = AttributeCodes.CS_SHIP_AHEAD_END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiControlWrapper(data, 'CS_SHIP_AHEAD_END_DT')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 115,
                Format = "{0:d}"
            });

            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit, Tender types + Dimension by Prod Bucket
            {
                Id = 5,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'ECAP_PRICE', '20___0', 'currency')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportDimControlWrapper(data, 'ECAP_PRICE', '20___0', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types + Dimension by Prod Bucket
            {
                Id = 5,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'ECAP_PRICE', 'currency')#",  //if the singleton case works all 3 should just use this control wrapper
                DataType = "object",
                IsFilterable = true,
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'ECAP_PRICE', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "KIT_ECAP",
                Label = "Net KIT Price (Kit ECAP)",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'ECAP_PRICE', '20_____1', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportDimControlWrapper(data, 'ECAP_PRICE', '20_____1', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "SUBKIT_ECAP",
                Label = "Net Subkit Price (Subkit ECAP)",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'ECAP_PRICE', '20_____2', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportDimControlWrapper(data, 'ECAP_PRICE', '20_____2', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake Atrb, placeholder for dispaly purposes only
            {
                Id = 10005,
                AtrbCd = "PRIMARY_OR_SECONDARY",
                Label = "Primary or Secondary",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                Template = "#=gridUtils.uiPrimarySecondaryDimControlWrapper(data)#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportPrimarySecondaryDimControlWrapper(data)#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, for display purposes only
            {
                Id = 10006,
                AtrbCd = "KIT_REBATE_BUNDLE_DISCOUNT",
                Label = "Kit Discount (ECAP value only)",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiKitCalculatedValuesControlWrapper(data, 'kit', 'rebateBundle')#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportKitCalculatedValuesControlWrapper(data, 'kit', 'rebateBundle')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, for display purposes only
            {
                Id = 10006,
                AtrbCd = "SUBKIT_REBATE_BUNDLE_DISCOUNT",
                Label = "Sub Kit Discount (ECAP value only)",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiKitCalculatedValuesControlWrapper(data, 'subkit', 'rebateBundle')#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportKitCalculatedValuesControlWrapper(data, 'subkit', 'rebateBundle')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "BACKEND_REBATE",
                Label = "Backend Rebate",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 130,
                Template = "#=gridUtils.uiControlBackEndRebateWrapper(data, 'ECAP', 'ECAP_PRICE', '20___0', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportBackEndRebateWrapper(data, 'ECAP', 'ECAP_PRICE', '20___0', 'currency')#",
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "BACKEND_REBATE",
                Label = "Backend Rebate",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiControlBackEndRebateWrapper(data, 'KIT', 'ECAP_PRICE', '20_____1', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportBackEndRebateWrapper(data, 'KIT', 'ECAP_PRICE', '20_____1', 'currency')#",
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types + Dimension by Prod Bucket
            {
                Id = 3681,
                AtrbCd = AttributeCodes.DSCNT_PER_LN,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'DSCNT_PER_LN', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'DSCNT_PER_LN', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types + Dimension by Prod Bucket
            {
                Id = 3682,
                AtrbCd = AttributeCodes.QTY,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 100,
                DataType = "object",
                Format = "{0:d}",
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'QTY', 'number')#",
                UiType = "IntegerTextBox",
                Editor = "multiDimEditor",
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'QTY', 'number')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, placeholder for a block of items for display reasons only
            {
                Id = 10007,
                AtrbCd = "TOTAL_DSCNT_PR_LN",
                Label = "Total Discount per line",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiTotalDiscountPerLineControlWrapper(data, 'currency')#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportTotalDiscountPerLineControlWrapper(data, 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, for display purposes only
            {
                Id = 10006,
                AtrbCd = "KIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE",
                Label = "KIT Sum of Total Discount Per Line",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiKitCalculatedValuesControlWrapper(data, 'kit', 'sumTD')#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportKitCalculatedValuesControlWrapper(data, 'kit', 'sumTD')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, for display purposes only
            {
                Id = 10006,
                AtrbCd = "SUBKIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE",
                Label = "Sub KIT Sum of Total Discount Per Line",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiKitCalculatedValuesControlWrapper(data, 'subkit', 'sumTD')#",
                DataType = "object",
                IsReadOnly = true,
                ExcelTemplate = "#=gridUtils.exportKitCalculatedValuesControlWrapper(data, 'subkit', 'sumTD')#"
            });
            items.Add(new UiTemplateContainerItem   // We include this so that the subkit tab can filter against it, only appearing if any deals can have subkit or showing only the deals eligible for subkits
            {
                Id = 3701,
                AtrbCd = "HAS_SUBKIT",
                Label = "Has Subkit",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiControlWrapper(data, 'HAS_SUBKIT')#",
                DataType = "object",
                IsReadOnly = true,
                IsFilterable = true
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, placeholder for a block of items for display reasons only
            {
                Id = 10008,
                AtrbCd = "CAP_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.FLEX },
                Width = 150,
                Template = "#=gridUtils.uiDimInfoControlWrapper(data, 'CAP')#",
                ExcelTemplate = "#=gridUtils.uiDimInfoExcelControlWrapper(data, 'CAP')#",
                Label = "CAP Info",
                DataType = "object",
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit, Tender types
            {
                Id = 86,
                AtrbCd = AttributeCodes.CAP,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'CAP', 'currency')#",
                DataType = "object",
                IsFilterable = true,
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'CAP', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit types
            {
                Id = 3665,
                AtrbCd = AttributeCodes.CAP_STRT_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'CAP_STRT_DT', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsHidden = true,
                Width = 100,
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'CAP_STRT_DT', 'date')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit types
            {
                Id = 3666,
                AtrbCd = AttributeCodes.CAP_END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'CAP_END_DT', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsHidden = true,
                Width = 100,
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'CAP_END_DT', 'date')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "CAP_KIT",
                Label = "CAP Kit",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'CAP', '20_____1', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportDimControlWrapper(data, 'CAP', '20_____1', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // Fake atrb, placeholder for a block of items for display reasons only
            {
                Id = 10009,
                AtrbCd = "YCS2_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 150,
                Label = "YCS2 Info",
                IsReadOnly = true,
                Template = "#=gridUtils.uiDimInfoControlWrapper(data, 'YCS2')#",
                ExcelTemplate = "#=gridUtils.uiDimInfoExcelControlWrapper(data, 'YCS2')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP types + Dimension by Prod Bucket
            {
                Id = 137,
                AtrbCd = AttributeCodes.YCS2_PRC_IRBT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'YCS2_PRC_IRBT', 'currency')#",
                Label = "YCS2 Price",
                DataType = "object",
                IsFilterable = true,
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'YCS2_PRC_IRBT', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP types + Dimension by Prod Bucket
            {
                Id = 138,
                AtrbCd = AttributeCodes.YCS2_START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'YCS2_START_DT', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsHidden = true,
                Width = 100,
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'YCS2_START_DT', 'date')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP types + Dimension by Prod Bucket
            {
                Id = 139,
                AtrbCd = AttributeCodes.YCS2_END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Template = "#=gridUtils.uiPositiveDimControlWrapper(data, 'YCS2_END_DT', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsHidden = true,
                Width = 100,
                ExcelTemplate = "#=gridUtils.exportPositiveDimControlWrapper(data, 'YCS2_END_DT', 'date')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP Kit types
            {
                Id = 5,
                AtrbCd = "YCS2_KIT",
                Label = "YCS2 Price Kit",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'YCS2_PRC_IRBT', '20_____1', 'currency')#",
                DataType = "object",
                Format = "{0:c}",
                ExcelTemplate = "#=gridUtils.exportDimControlWrapper(data, 'YCS2_PRC_IRBT', '20_____1', 'currency')#"
            });

            items.Add(new UiTemplateContainerItem  // WIP ECAP types + Dimension by Prod Bucket
            {
                Id = 3542,
                AtrbCd = AttributeCodes.YCS2_OVERLAP_OVERRIDE,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_OVERLAP_OVERRIDE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/YCS2_OVERLAP_OVERRIDE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP, Kit, Tender types
            {
                Id = 3321,
                AtrbCd = AttributeCodes.VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 100,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                UiType = "IntegerTextBox",
                Template = "#=gridUtils.uiControlWrapper(data, 'VOLUME', 'number')#"
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3570,
                AtrbCd = AttributeCodes.REBATE_BILLING_START,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_BILLING_START', \"date:'MM/dd/yyyy'\")#",
                ExcelTemplate = "#=gridUtils.formatDate(REBATE_BILLING_START)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3571,
                AtrbCd = AttributeCodes.REBATE_BILLING_END,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_BILLING_END', \"date:'MM/dd/yyyy'\")#",
                ExcelTemplate = "#=gridUtils.formatDate(REBATE_BILLING_END)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3459,
                AtrbCd = AttributeCodes.CONSUMPTION_REASON,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_REASON')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/CONSUMPTION_REASON",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3460,
                AtrbCd = AttributeCodes.CONSUMPTION_REASON_CMNT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_REASON_CMNT')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3456,
                AtrbCd = AttributeCodes.CONSUMPTION_CUST_PLATFORM,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Customer Platform",
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_CUST_PLATFORM')#",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_PLATFORM/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3457,
                AtrbCd = AttributeCodes.CONSUMPTION_CUST_SEGMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Customer Segment",
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_CUST_SEGMENT')#",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_SEGMENT/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3458,
                AtrbCd = AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                HeaderTemplate = "<span title='Consumption Customer Reported Geo'>Customer Reported Region</span>",
                //Label = "Customer Reported Region",
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_CUST_RPT_GEO')#",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_RPT_GEO/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3461,
                AtrbCd = AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                HeaderTemplate = "Consumption Lookback Period (Months) <span title='Invoice eligibility time period for rebate payment. Could be a rolling number of months or equal to billings dates. Enter 0 (zero) for deals using billing start and end date.'><i class='intelicon-help' style='font-size: 15px !important'></i></span>",
                //Label = "Consumption Cust Reported Geo",
                Width = 170, // 110
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                UiType = "IntegerTextBox",
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_LOOKBACK_PERIOD', 'number')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3453,
                AtrbCd = AttributeCodes.SYS_PRICE_POINT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SYS_PRICE_POINT')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3454,
                AtrbCd = AttributeCodes.CONSUMPTION_SYS_CONFIG,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_SYS_CONFIG')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/CONSUMPTION_SYS_CONFIG",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3454,
                AtrbCd = AttributeCodes.SEND_TO_VISTEX,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 80,
                IsFilterable = true,
                IsSortable = true,
                IsDefaultable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SEND_TO_VISTEX')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SEND_TO_VISTEX",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3596,
                AtrbCd = AttributeCodes.BACK_DATE_RSN,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 220,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'BACK_DATE_RSN')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/BACK_DATE_RSN",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3347,
                AtrbCd = AttributeCodes.SERVER_DEAL_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SERVER_DEAL_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3347,
                AtrbCd = AttributeCodes.SERVER_DEAL_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SERVER_DEAL_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/VOL_TIER",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3347,
                AtrbCd = AttributeCodes.SERVER_DEAL_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SERVER_DEAL_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/PROGRAM",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 35,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'PAYOUT_BASED_ON')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3495,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'PROGRAM_PAYMENT')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3474,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                UiType = "EMBEDDEDMULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'MRKT_SEG')#",
                LookupUrl = "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3620,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                UiType = "MULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'GEO_COMBINED')#",
                Label = "Geo",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 23,
                AtrbCd = AttributeCodes.TRGT_RGN,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                UiType = "EMBEDDEDMULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'TRGT_RGN')#",
                LookupUrl = "/api/Dropdown/GetGeoDropdownHierarchy/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3678,
                AtrbCd = AttributeCodes.QLTR_BID_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180,
                UiType = "MULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_BID_GEO')#",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3568,
                AtrbCd = AttributeCodes.QLTR_PROJECT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_PROJECT')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3348,
                AtrbCd = AttributeCodes.END_CUSTOMER_RETAIL,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'END_CUSTOMER_RETAIL')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3350,
                AtrbCd = AttributeCodes.PRIMED_CUST_NM,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'PRIMED_CUST_NM')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3351,
                AtrbCd = AttributeCodes.PRIMED_CUST_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'PRIMED_CUST_ID')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem   // We include this so that the subkit tab can filter against it, only appearing if any deals can have subkit or showing only the deals eligible for subkits
            {
                Id = 3352,
                AtrbCd = AttributeCodes.IS_PRIMED_CUST,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 130,
                Template = "#=gridUtils.uiControlWrapper(data, 'IS_PRIMED_CUST')#",
                DataType = "object",
                IsReadOnly = true,
                IsFilterable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 18,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 18,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/VOL_TIER",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 18,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/PROGRAM",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3569,
                AtrbCd = AttributeCodes.TERMS,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Additional Ts And Cs",
                IsFilterable = true,
                IsSortable = true,
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'TERMS')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP ECAP types for now
            {
                Id = 3716,
                AtrbCd = AttributeCodes.QUOTE_LN_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Quote Line Number",
                IsFilterable = true,
                IsSortable = true,
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'QUOTE_LN_ID')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 57,
                AtrbCd = AttributeCodes.RESET_VOLS_ON_PERIOD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.FLEX },
                Template = "#=gridUtils.uiControlWrapper(data, 'RESET_VOLS_ON_PERIOD')#",
                DataType = "string",
                Label = "Reset Per Period",
                Width = 140,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/RESET_VOLS_ON_PERIOD",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT types
            {
                Id = 3490,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Width = 140,
                Label = "Number of Tiers",
                Template = "#=gridUtils.uiControlWrapper(data, 'NUM_OF_TIERS')#",
                IsHidden = true,
                IsReadOnly = true,
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3603,
                AtrbCd = AttributeCodes.FRCST_VOL,
                Label = "Forecast Volume",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'FRCST_VOL', 'number')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3600,
                AtrbCd = AttributeCodes.MAX_RPU,
                Label = "Max RPU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'MAX_RPU', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3675,
                AtrbCd = AttributeCodes.USER_MAX_RPU,
                Label = "User Defined Max RPU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'USER_MAX_RPU', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3601,
                AtrbCd = AttributeCodes.AVG_RPU,
                Label = "Average RPU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'AVG_RPU', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3674,
                AtrbCd = AttributeCodes.USER_AVG_RPU,
                Label = "User Defined Average RPU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'USER_AVG_RPU', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP VT, Program types
            {
                Id = 3614,
                AtrbCd = AttributeCodes.RPU_OVERRIDE_CMNT,
                Label = "User Defined RPU Override Comment",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'RPU_OVERRIDE_CMNT')#",
                IsFilterable = true,
                IsSortable = true
            });

            items.Add(new UiTemplateContainerItem  // WIP Program types
            {
                Id = 3559,
                AtrbCd = AttributeCodes.ORIG_ECAP_TRKR_NBR,
                Label = "Original Tracker #",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                UiType = "DROPDOWN",
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'ORIG_ECAP_TRKR_NBR')#",
                LookupUrl = "/api/EcapTracker/GetEcapTrackerList/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP Program types
            {
                Id = 22,
                AtrbCd = AttributeCodes.TOTAL_DOLLAR_AMOUNT,
                Label = "Total Dollar Amount",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 100,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'TOTAL_DOLLAR_AMOUNT', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem  // WIP Program types
            {
                Id = 3560,
                AtrbCd = AttributeCodes.ADJ_ECAP_UNIT,
                Label = "Adjustment Ecap Unit",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM },
                Width = 100,
                Format = "{0:c}",
                Template = "#=gridUtils.uiControlWrapper(data, 'ADJ_ECAP_UNIT', 'currency')#",
                IsFilterable = true,
                IsSortable = true
            });

            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3573,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Overarching Max Volume",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                UiType = "IntegerTextBox",
                DataType = "number",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_VOL', 'number')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3574,
                AtrbCd = AttributeCodes.REBATE_OA_MAX_AMT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Overarching Max Dollar",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_OA_MAX_AMT', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3575,
                AtrbCd = AttributeCodes.REBATE_DEAL_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Overarching Deal IDs",
                Width = 140,
                IsReadOnly = true,
                IsFilterable = true,
                IsSortable = true,
                //UiType = "IntegerTextBox",
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_DEAL_ID')#"
            });
            //items.Add(new UiTemplateContainerItem  // WIP All Types
            //{
            //    Id = 3348,
            //    AtrbCd = AttributeCodes.END_CUSTOMER_RETAIL,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Label = "End Customer/Retail",
            //    Width = 140,
            //    //Format = "{0:d}",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'END_CUSTOMER_RETAIL')#"
            //});
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3488,
                AtrbCd = AttributeCodes.CREDIT_VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Credit Volume",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CREDIT_VOLUME', 'number')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3489,
                AtrbCd = AttributeCodes.DEBIT_VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Debit Volume",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'DEBIT_VOLUME', 'number')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3510,
                AtrbCd = AttributeCodes.CREDIT_AMT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Credit Dollar",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CREDIT_AMT', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3511,
                AtrbCd = AttributeCodes.DEBIT_AMT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Debit Dollar",
                Width = 140,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'DEBIT_AMT', 'currency')#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 9999,
                AtrbCd = "TOTAL_CR_DB_PERC",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Total Deal Volume",
                Width = 140,
                IsFilterable = false,
                IsSortable = false,
                Template = "#=gridUtils.uiCrDbPercWrapper(data)#",
                ExcelTemplate = "#=gridUtils.uiCrDbPercExcelWrapper(data)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3521,
                AtrbCd = AttributeCodes.BLLG_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Last Credit/Debit Payment Date",
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'BLLG_DT', \"date:'MM/dd/yyyy'\")#",
                ExcelTemplate = "#=gridUtils.formatDate(BLLG_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3651,
                AtrbCd = AttributeCodes.MEETCOMP_TEST_RESULT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
                Width = 150,
                IsFilterable = true,
                IsReadOnly = true,
                IsSortable = true,
                Template = "#=gridUtils.getResultSingleIcon(data, 'MEETCOMP_TEST_RESULT')#",
                ExcelTemplate = "#=MEETCOMP_TEST_RESULT#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 90012,
                AtrbCd = AttributeCodes.EXCLUDE_AUTOMATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP }, // not sure that KIT should be here...
                DataType = "object",
                Label = "<div title='Exclude from Price Approval Rules'>Exclude from Price Rules</div>",
                Width = 120,
                Template = "#=gridUtils.uiControlWrapper(data, 'EXCLUDE_AUTOMATION')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/EXCLUDE_AUTOMATION/",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true,
                ExcelTemplate = "#=EXCLUDE_AUTOMATION#",
                BypassExport = true
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3651,
                AtrbCd = "MISSING_CAP_COST_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.KIT, OpDataElementSetType.VOL_TIER, OpDataElementSetType.PROGRAM },
                Width = 150,
                Label = "<div title='Deals missing Cost and/or CAP cannot be approved by Division Approvers until the missing data has been added. For urgent issues, contact TAC.'>Missing Cost/CAP</div>",
                IsFilterable = true,
                IsReadOnly = true,
                IsSortable = true,
                Template = "#=gridUtils.getMissingCostCapIcon(data)#",
                ExcelTemplate = "#=gridUtils.getMissingCostCapTitle(data)#",
                ExcelHeaderLabel = "Missing Cost/CAP"
            });
            items.Add(new UiTemplateContainerItem  // WIP All Types
            {
                Id = 3651,
                AtrbCd = AttributeCodes.COST_TEST_RESULT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
                Width = 150,
                IsFilterable = true,
                IsReadOnly = true,
                IsSortable = true,
                Template = "#=gridUtils.getResultSingleIcon(data, 'COST_TEST_RESULT')#",
                ExcelTemplate = "#=COST_TEST_RESULT#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 0,
                AtrbCd = AttributeCodes.GEO_APPROVED_BY,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
                Template = "#=gridUtils.uiControlWrapper(data, 'GEO_APPROVED_BY')#",
                Label = "Geo Approved By",
                IsFilterable = true,
                IsSortable = true,
                Width = 150,
                IsReadOnly = true,
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 0,
                AtrbCd = AttributeCodes.DIV_APPROVED_BY,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
                Template = "#=gridUtils.uiControlWrapper(data, 'DIV_APPROVED_BY')#",
                Label = "Div Approved By",
                IsFilterable = true,
                IsSortable = true,
                Width = 150,
                IsReadOnly = true,
            });
            //items.Add(new UiTemplateContainerItem  // WIP All types + Dimensioned by Prod Bucket
            //{
            //    Id = 9999,
            //    AtrbCd = AttributeCodes.AUTO_APPROVE_RULE_INFO,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Label = "Approving Price Rule Name",
            //    Width = 190,
            //    Template = "#=gridUtils.uiReadonlyControlWrapper(data, 'AUTO_APPROVE_RULE_INFO')#",
            //    DataType = "object",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    IsReadOnly = true
            //});
            //items.Add(new UiTemplateContainerItem  // WIP All types + Dimensioned by Prod Bucket
            //{
            //    Id = 24,
            //    AtrbCd = AttributeCodes.AUTO_APPROVE_RULE_INFO,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Label = "Approving Price Rule Id",
            //    Width = 130,
            //    Template = "#=gridUtils.uiReadonlyControlWrapper(data, 'AUTO_APPROVE_RULE_INFO')#",
            //    DataType = "object",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    IsReadOnly = true
            //});
            items.Add(new UiTemplateContainerItem
            {
                Id = 3717,
                AtrbCd = AttributeCodes.PERIOD_PROFILE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
                Width = 160,
                Template = "#=gridUtils.uiControlWrapper(data, 'PERIOD_PROFILE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/PERIOD_PROFILE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true,
                ExcelTemplate = "#=PERIOD_PROFILE#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3719,
                AtrbCd = AttributeCodes.AR_SETTLEMENT_LVL,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 240,
                IsDefaultable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'AR_SETTLEMENT_LVL')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true,
                ExcelTemplate = "#=AR_SETTLEMENT_LVL#",
                IsRequired = true
            });

            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3673,
                AtrbCd = AttributeCodes.LAST_REDEAL_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiStartDateWrapper(data, 'LAST_REDEAL_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "<div title='Date the current deal values took effect. This date can be changed on a re-deal.'>Effective Tracker Start Date</div>",
                IsFilterable = false,
                IsSortable = true,
                Width = 120,
                IsRequired = false,
                ExcelTemplate = "#=gridUtils.formatDate(LAST_REDEAL_DT)#"
            });
            items.Add(new UiTemplateContainerItem  // WIP All types
            {
                Id = 3655,
                AtrbCd = AttributeCodes.LAST_TRKR_START_DT_CHK,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'LAST_TRKR_START_DT_CHK', \"date:'MM/dd/yyyy'\")#",
                Label = "Last Tracker Start Date",
                IsFilterable = false,
                IsReadOnly = true,
                IsSortable = true,
                Width = 100,
                IsRequired = false,
                ExcelTemplate = "#=gridUtils.formatDate(LAST_TRKR_START_DT_CHK)#"
            });

            //items.Add(new UiTemplateContainerItem  // WIP All types
            //{
            //    Id = 0,
            //    AtrbCd = AttributeCodes.WIP_DEAL_CRE_DTM,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
            //    Template = "#=gridUtils.uiStartDateWrapper(data, 'WIP_DEAL_CRE_DTM', \"date:'MM/dd/yyyy'\")#",
            //    Label = "Created On",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Width = 100,
            //    IsReadOnly = true,
            //    ExcelTemplate = "#=gridUtils.formatDate(WIP_DEAL_CRE_DTM)#"
            //});
            //items.Add(new UiTemplateContainerItem  // WIP All types
            //{
            //    Id = 0,
            //    AtrbCd = AttributeCodes.LAST_MOD_BY,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
            //    Template = "#=gridUtils.uiControlWrapper(data, 'LAST_MOD_BY')#",
            //    Label = "Last Modified By",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Width = 150,
            //    IsReadOnly = true,
            //});
            //items.Add(new UiTemplateContainerItem  // WIP All types
            //{
            //    Id = 0,
            //    AtrbCd = AttributeCodes.LAST_MOD_DT,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.KIT, OpDataElementSetType.ECAP },
            //    Template = "#=gridUtils.uiStartDateWrapper(data, 'LAST_MOD_DT', \"date:'MM/dd/yyyy'\")#",
            //    Label = "Last Modified On",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Width = 100,
            //    IsReadOnly = true,
            //    ExcelTemplate = "#=gridUtils.formatDate(LAST_MOD_DT)#"
            //});

            #endregion WIP DEAL

            #region MASTER (Tender)

            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                IsFilterable = true,
                IsSortable = true,
                DataType = "number",
                Label = "Deal Id",
                Width = 90,
                IsReadOnly = true,
                Template = "<div class='dealLnk' style='padding: 0 4px;'>#=DC_ID#</div>"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.DC_PARENT_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 90,
                Label = "Master ID",
                Template = "#=gridUtils.uiControlWrapper(data, 'DC_PARENT_ID')#",
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "_dirty",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 90,
                Label = "dirty",
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 16,
                AtrbCd = "tools",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                DataType = "object",
                Label = "Deal Tools",
                Width = 170,
                IsSortable = false,
                IsFilterable = false,
                IsReadOnly = true,
                Template = "<div><deal-tools-tender ng-model='dataItem' is-editable='true'></deal-tools></div>",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 50,
                IsSortable = true,
                IsFilterable = true,
                Label = "<i class='intelicon-protection-solid' style='color: #00AEEF; font-size: 20px;'></i>",
                IsReadOnly = true,
                DataType = "string",
                Template = "#=gridUtils.uiValidationErrorDetail(data)#"
                //Template = "<i class='valid-icon validf_{{ dataItem.PASSED_VALIDATION }} {{ (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\") ? \"intelicon-protection-solid\" : (dataItem.PASSED_VALIDATION == \"Complete\") ? \"intelicon-protection-checked-verified-solid\" : \"intelicon-alert-solid\" }}' title='Validation: {{ (dataItem.PASSED_VALIDATION === \"Dirty\" ? \"Validation Errors\" : dataItem.PASSED_VALIDATION) || \"Not validated yet\" }}' style='margin-left: 14px;'></i>"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.dc_type,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 90,
                Label = "Master / Child",
                Template = "#=gridUtils.uiMasterChildWrapper(data, 'dc_type')#",
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                Label = "Contract Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'PTR_USER_PRD')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.TITLE,
                Label = "MyDeals Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'TITLE')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.WF_STG_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'WF_STG_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.QLTR_PROJECT,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_PROJECT')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.END_CUSTOMER_RETAIL,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'END_CUSTOMER_RETAIL')#",
                Label = "End Customer",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 50,
                AtrbCd = "Customer",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiCustomerControlWrapper(data, 'CUST_MBR_SID')#",
                Label = "OEM",
                LookupUrl = "/api/Customers/GetMyCustomersNameInfo",
                LookupText = "CUST_NM",
                LookupValue = "CUST_SID",
                UiType = "ComboBox",
                IsFilterable = true,
                IsSortable = true,
                Width = 140
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3678,
                AtrbCd = AttributeCodes.QLTR_BID_GEO,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 180,
                UiType = "EMBEDDEDMULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_BID_GEO')#",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3568,
                AtrbCd = AttributeCodes.QLTR_PROJECT,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'QLTR_PROJECT')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3348,
                AtrbCd = AttributeCodes.END_CUSTOMER_RETAIL,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'END_CUSTOMER_RETAIL')#",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'ECAP_PRICE', '20___0', 'currency')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "CAP_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 130,
                Template = "<op-popover ng-click='openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-label='' op-data='getPrductDetails(dataItem, \"CAP\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'CAP', 'CAP_STRT_DT', 'CAP_END_DT', '20___0')#</op-popover>",
                Label = "CAP Info",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Format = "{0:c}",
                UiType = "NumericTextBox",
                Editor = "multiDimEditor"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Label = "Deal Type",
                Template = "#=gridUtils.uiControlWrapper(data, 'OBJ_SET_TYPE_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 180,
                UiType = "MULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'GEO_COMBINED')#",
                Label = "Geo",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 180,
                UiType = "EMBEDDEDMULTISELECT",
                Template = "#=gridUtils.uiControlWrapper(data, 'MRKT_SEG')#",
                LookupUrl = "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 100,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'VOLUME')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'START_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Deal Start Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Template = "#=gridUtils.uiControlWrapper(data, 'END_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Deal End Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.BACK_DATE_RSN,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 220,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'BACK_DATE_RSN')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/BACK_DATE_RSN",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.COMP_BENCH,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 120,
                Label = "Comp Bench",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'COMP_BENCH')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.IA_BENCH,
                ObjType = new List<OpDataElementType> { OpDataElementType.MASTER },
                Width = 100,
                Label = "IA Bench",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'IA_BENCH')#"
            });

            #endregion MASTER (Tender)

            return FillInGapsFromT4(items);
        }

        public UiTemplates GetUiTemplates()
        {
            return new UiTemplates().Populate(DataCollections.GetTemplateDict(), GetData());
        }

        private List<UiTemplateContainerItem> FillInGapsFromT4(List<UiTemplateContainerItem> data)
        {
            foreach (UiTemplateContainerItem item in data)
            {
                FieldInfo fieldInfo = typeof(Attributes).GetField(item.AtrbCd);
                if (fieldInfo == null) continue;

                MyDealsAttribute atrb = (MyDealsAttribute)fieldInfo.GetValue(null);

                if (string.IsNullOrEmpty(item.Label)) item.Label = atrb.ATRB_LBL;
                if (string.IsNullOrEmpty(item.DataType)) item.DataType = GetDataType(atrb.DATA_TYPE_CD);
                if (item.MaxLength == 0) item.MaxLength = atrb.ATRB_MAX_LEN == 0 ? 8000 : atrb.ATRB_MAX_LEN;
                if (string.IsNullOrEmpty(item.Format)) item.Format = atrb.FRMT_MSK;
                if (string.IsNullOrEmpty(item.UiType)) item.UiType = atrb.UI_TYPE_CD;
                if (string.IsNullOrEmpty(item.MjrMnrChg)) item.MjrMnrChg = atrb.MJR_MNR_CHG;
            }

            return data;
        }

        private string GetDataType(string dataType)
        {
            switch (dataType)
            {
                case "INT":
                case "MONEY":
                    return "number";

                case "VARCHAR":
                    return "string";

                case "CUSTOM":
                    return "object";

                case "DATE":
                case "DATETIME":
                    return "date";

                case "BIT":
                    return "boolean";
            }
            return "string";
        }
    }
}