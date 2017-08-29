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
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.CAP_BAND },
                IsExtra = true,
                Label = "Tiers",
                IsRequired = true,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetNumTiersDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownID"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                DataType = "string",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/ECAP",
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
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
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
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
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
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
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
                AtrbCd = AttributeCodes.MEET_COMP_PRICE_QSTN,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
                IsDefaultable = true,
                Label = "Meet Comp Analysis",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP},
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
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Width = 100,
                IsDefaultable = true,
                IsHidden = true,
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
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP, OpDataElementSetType.VOL_TIER },
                Width = 100,
                IsDefaultable = true,
                Label = "Media",
                UiType = "BUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROD_INCLDS",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            #endregion PRICING TABLE

            #region PRICING TABLE ROW

            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "number",
                Label = "Row ID",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                Label = "Json String (will be hidden)",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsReadOnly = false, // need to set to true after product selector is in place
                IsHidden = true,
                Width = 220
                //// This is how it should be set once the product selector is in place:
                //IsReadOnly = true,
                //IsHidden = true,
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_SYS_INVLD_PRD,
                Label = "Invalid Json String (will be hidden)",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsReadOnly = false, // need to set to true after product selector is in place
                IsHidden = true,
                Width = 220
                //// This is how it should be set once the product selector is in place:
                //IsReadOnly = true,
                //IsHidden = true,
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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
                Id = 29,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                Label = "Contract Product *",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 220
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                Label = "ECAP Price *",
                Template = "#=gridUtils.uiIconWrapper(data, 'ECAP_PRICE')#",
                Format = "{0:c}",
                IsDimKey = true,
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 110,
                Template = "#=gridUtils.uiIconWrapper(data, 'VOLUME')#",
                Format = "{0:d}",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 30,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal Start Date *",
                Width = 90,
                Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 31,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal End Date *",
                Width = 90,
                Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 120,
                Template = "#=gridUtils.uiIconWrapper(data, 'PAYOUT_BASED_ON')#",
                IsDefaultable = true,
                Label = "Payout Based On *",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
			items.Add(new UiTemplateContainerItem
			{
				Id = 29,
				AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
				ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
				ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
				Width = 130,
				Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#",
				IsDefaultable = true,
				Label = "Program Payment *",
				UiType = "DROPDOWN",
				LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
				LookupText = "DROP_DOWN",
				LookupValue = "DROP_DOWN",
				IsRequired = true
			});
			items.Add(new UiTemplateContainerItem
			{
				Id = 29,
				AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
				ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
				ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
				Width = 130,
				Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#",
				IsDefaultable = true,
				Label = "Program Payment *",
				UiType = "DROPDOWN",
				LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/VOL_TIER",
				LookupText = "DROP_DOWN",
				LookupValue = "DROP_DOWN",
				IsRequired = true,
				IsReadOnly = true // the difference between ECAP and VOL TIER
			});
			items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
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
                Id = 37,
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
                Id = 37,
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
                Id = 36,
                AtrbCd = AttributeCodes.TIER_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.CAP_BAND },
                IsDimKey = true,
                IsReadOnly = true,
                Label = "Tier",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.STRT_VOL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                Width = 100,
                Label = "Start Vol"
			});
            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.END_VOL,   
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsDimKey = true,
                Width = 100,
                Label = "End Vol"
			});
			items.Add(new UiTemplateContainerItem
			{
				Id = 36,
				AtrbCd = AttributeCodes.RATE,
				ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
				ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
				IsDimKey = true,
				Width = 100,
				Label = "Rate"
			});

			items.Add(new UiTemplateContainerItem
            {
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsDefaultable = true,
                Label = "Market Segment *",
                Width = 140,
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
                Id = 39,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 41,
                AtrbCd = AttributeCodes.MEET_COMP_PRICE_QSTN,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsDefaultable = true,
                Label = "Meet Comp Analysis *",
                Width = 120,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 41,
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
                Id = 39,
                AtrbCd = AttributeCodes.TERMS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                Label = "Additional Discounts",
                DataType = "string",
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.CUST_MBR_SID,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 50,
                Label = "Customer",
                IsRequired = false,
                IsHidden = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsHidden = true
            });
			items.Add(new UiTemplateContainerItem
			{
				Id = 36,
				AtrbCd = AttributeCodes.TITLE,
				ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
				ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
				Width = 100,
				Label = "Deal Description"
			});

			#endregion PRICING TABLE ROW

			#region WIP DEAL

			items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
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
                Id = 1,
                AtrbCd = "details",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "Deal Details",
                Width = 260,
                IsReadOnly = true,
                Template = "<deal-detail ng-model='dataItem'></deal-detail>"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 16,
                AtrbCd = "tools",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "object",
                Label = "Deal Tools",
                Width = 170,
                IsSortable = false,
                IsFilterable = false,
                IsReadOnly = true,
                Template = "<deal-tools ng-model='dataItem' is-editable='true'></deal-tools>",
                HeaderTemplate = "<input type='checkbox' ng-click='clkAllItems()' class='with-font' id='chkDealTools' /><label for='chkDealTools' style='margin: 5px 0 0 5px;'>Deal Tools</label>"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PASSED_VALIDATION,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 50,
                IsSortable = true,
                IsFilterable = true,
                Label = "<i class='intelicon-protection-solid' style='color: #00AEEF; font-size: 20px;'></i>",
                IsReadOnly = true,
                DataType = "string",
                Template = "<i class='valid-icon validf_{{ dataItem.PASSED_VALIDATION }} {{ (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\") ? \"intelicon-protection-solid\" : (dataItem.PASSED_VALIDATION == \"Valid\" || dataItem.PASSED_VALIDATION == \"Finalizing\" || dataItem.PASSED_VALIDATION == \"Complete\") ? \"intelicon-protection-checked-verified-solid\" : \"intelicon-protection-failed-solid\" }}' title='Validation: {{dataItem.PASSED_VALIDATION || \"Not validated yet\"}}' style='margin-left: 14px;'></i>"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.DC_PARENT_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 90,
                Label = "Prc Table Row ID",
                Template = "#=gridUtils.uiControlWrapper(data, 'DC_PARENT_ID')#",
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 50,
                AtrbCd = AttributeCodes.CUST_MBR_SID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'CUST_MBR_SID')#",
                Label = "Customer",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
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
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'END_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Deal End Date",
                IsFilterable = true,
                IsSortable = true,
                Width = 100,
				IsRequired = true
			});
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Deal Type",
                Template = "#=gridUtils.uiControlWrapper(data, 'OBJ_SET_TYPE_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.WF_STG_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'WF_STG_CD')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                Label = "Contract Product",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
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
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'TITLE')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DEAL_COMB_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_COMB_TYPE')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 140,
                LookupUrl = "/api/Dropdown/GetDropdowns/DEAL_COMB_TYPE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.ON_ADD_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'ON_ADD_DT', \"date:'MM/dd/yyyy'\")#",
                IsFilterable = true,
                IsSortable = true,
                Width = 110
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.TIER_NBR,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                Template = "#=gridUtils.uiControlScheduleWrapper(data)#",
                Editor = "scheduleEditor",
                DataType = "object",
                Label = "Rate Breakout",
                Width = 300
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DEAL_SOLD_TO_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                UiType = "MULTISELECT",
                Template = "#=gridUtils.uiMultiselectArrayControlWrapper(data, 'DEAL_SOLD_TO_ID')#",
                LookupUrl = "/api/Dropdown/GetSoldToIds", // TODO
                LookupText = "dropdownName",
                LookupValue = "dropdownName",
                IsFilterable = true,
                IsSortable = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.EXPIRE_YCS2,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'EXPIRE_YCS2')#",
                IsFilterable = true,
                IsSortable = true,
                Width = 115,
                LookupUrl = "/api/Dropdown/GetDropdowns/EXPIRE_YCS2",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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
                Editor = "multiDimEditor"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "CAP_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
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
                Id = 29,
                AtrbCd = AttributeCodes.CAP,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'CAP', '20___0', 'currency')#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Format = "{0:c}"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.CAP_STRT_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiDimControlWrapper(data, 'CAP_STRT_DT', '20___0', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                IsHidden = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.CAP_END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiDimControlWrapper(data, 'CAP_END_DT', '20___0', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                IsHidden = true,
                Width = 100
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "YCS2_INFO",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 130,
                Label = "YCS2 Info",
                IsFilterable = true,
                IsSortable = true,
                IsReadOnly = true,
                Template = "<op-popover op-options='YCS2' op-data='getPrductDetails(dataItem, \"YCS2\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'YCS2_PRC_IRBT', 'YCS2_START_DT', 'YCS2_END_DT', '20___0')#</op-popover>",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.YCS2_PRC_IRBT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 130,
                Template = "#=gridUtils.uiDimControlWrapper(data, 'YCS2_PRC_IRBT', '20___0', 'currency')#",
                Label = "YCS2 Price",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                Format = "{0:c}"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.YCS2_START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiDimControlWrapper(data, 'YCS2_START_DT', '20___0', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                IsHidden = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.YCS2_END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiDimControlWrapper(data, 'YCS2_END_DT', '20___0', \"date:'MM/dd/yyyy'\")#",
                DataType = "object",
                IsFilterable = true,
                IsSortable = true,
                IsHidden = true,
                Width = 100
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.YCS2_OVERLAP_OVERRIDE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_OVERLAP_OVERRIDE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/YCS2_OVERLAP_OVERRIDE",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 100,
                Format = "{0:d}",
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'VOLUME')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.REBATE_BILLING_START,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_BILLING_START', \"date:'MM/dd/yyyy'\")#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.REBATE_BILLING_END,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_BILLING_END', \"date:'MM/dd/yyyy'\")#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.CONSUMPTION_REASON,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_REASON')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/CONSUMPTION_REASON",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.CONSUMPTION_REASON_CMNT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'CONSUMPTION_REASON_CMNT')#"
            });

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.PRD_COST,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 100,
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'PRD_COST', 'currency')#"
            //});

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.COST_TYPE_USED,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'COST_TYPE_USED')#"
            });

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COST_TEST_RESULT,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 100,
            //    Label = "Cost Test Result",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_RESULT')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COST_TEST_FAIL_OVERRIDE,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 180,
            //    Label = "Price Cost Test Analysis Override Comments",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_FAIL_OVERRIDE')#",
            //    LookupUrl = "/api/Dropdown/GetDropdowns/COST_TEST_OVERRIDE",
            //    LookupText = "DROP_DOWN",
            //    LookupValue = "DROP_DOWN"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COST_TEST_FAIL_OVERRIDE_REASON,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 180,
            //    Label = "Price Cost Test Analysis Override",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_FAIL_OVERRIDE_REASON')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.MEET_COMP_PRICE_QSTN,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 140,
            //    Label = "Meet Comp Analysis",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'MEET_COMP_PRICE_QSTN')#",
            //    LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN",
            //    LookupText = "DROP_DOWN",
            //    LookupValue = "DROP_DOWN"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COMP_SKU,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 110,
            //    Label = "Comp Sku",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COMP_SKU')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COMP_SKU_OTHR,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 100,
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COMP_SKU_OTHR')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COMPETITIVE_PRICE,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 110,
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Label = "Comp Price",
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COMPETITIVE_PRICE', 'currency')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COMP_BENCH,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 120,
            //    Label = "Comp Bench",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COMP_BENCH')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.IA_BENCH,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 100,
            //    Label = "IA Bench",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'IA_BENCH')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.COMP_TARGET_SYSTEM_PRICE,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 140,
            //    Label = "Comp Target System Price",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'COMP_TARGET_SYSTEM_PRICE', 'currency')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.MEETCOMP_TEST_RESULT,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 120,
            //    Label = "Meet Comp Test Results",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_RESULT')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 160,
            //    Label = "Meet Comp Analysis Override",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_FAIL_OVERRIDE')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE_REASON,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 180,
            //    Label = "Meet Comp Analysis Override Comments",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_FAIL_OVERRIDE_REASON')#"
            //});

            //         items.Add(new UiTemplateContainerItem
            //         {
            //             Id = 29,
            //             AtrbCd = AttributeCodes.RETAIL_CYCLE,
            //             ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //             Width = 140,
            //             IsFilterable = true,
            //             IsSortable = true,
            //	UiType = "ComboBox",
            //	Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_CYCLE')#",
            //             LookupUrl = "api/Dropdown/GetRetailPull", // TODO: uncomment the GetRetailPull function in the API or remove it
            //	LookupText = "dropdownName",
            //	LookupValue = "dropdownName",
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.RETAIL_PULL,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 120,
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL', 'currency')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.RETAIL_PULL_USR_DEF,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 120,
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL_USR_DEF', 'currency')#"
            //});

            //items.Add(new UiTemplateContainerItem
            //{
            //    Id = 29,
            //    AtrbCd = AttributeCodes.RETAIL_PULL_USR_DEF_CMNT,
            //    ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
            //    Width = 160,
            //    Label = "Retail Pull$ User Defined Comments",
            //    IsFilterable = true,
            //    IsSortable = true,
            //    Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL_USR_DEF_CMNT')#"
            //});

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.ECAP_FLR,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'ECAP_FLR')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.SERVER_DEAL_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 110,
                IsFilterable = true,
                IsSortable = true,
                Template = "#=gridUtils.uiControlWrapper(data, 'SERVER_DEAL_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
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

            items.Add(new UiTemplateContainerItem
            {
                Id = 38,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.REBATE_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'REBATE_TYPE')#",
                LookupUrl = "/api/Dropdown/GetDropdowns/REBATE_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsFilterable = true,
                IsSortable = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
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
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.TERMS,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Additional Discounts",
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'TERMS')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER },
                IsHidden = true
            });

            #endregion WIP DEAL

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

                case "DATETIME":
                    return "date";

                case "BIT":
                    return "boolean";
            }
            return "string";
        }
    }
}