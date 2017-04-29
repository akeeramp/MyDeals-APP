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
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT },
                DataType = "string",
                Label = "Title",
                Width = 150
            });

            #endregion

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
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST },
                DataType = "string",
                Label = "Title",
                Width = 150
            });

            #endregion

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
                Label = "Number of Tiers",
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
                AtrbCd = AttributeCodes.ECAP_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "ECAP Type",
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_ECAP_TYPE/ECAP",
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
                HelpText = "You cannot mix ALL & other market segments.\n\nNon Corp selects: Consumer retail pull, Education, Government, &SMB",
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                IsDefaultable = true,
                Label = "Geo",
                DataType = "string",
                UiType = "MULTISELECT",
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
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "MEET_COMP_PRICE_QSTN",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                IsDefaultable = true,
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 100,
                IsDefaultable = true,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });

            #endregion

            #region PRICING TABLE ROW

            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsHidden = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsReadOnly = true,
                IsHidden = true,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "ECAP_PRICE",
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'ECAP_PRICE_____10___0')#",
                Format = "{0:c}",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 30,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal Start Date",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 31,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Label = "Deal End Date",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PAYOUT_BASED_ON')#",
                IsDefaultable = true,
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
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#",
                IsDefaultable = true,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.ECAP_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "ECAP Type",
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_ECAP_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.CAP_BAND },
                IsExtra = true,
                Label = "Number of Tiers",
                IsRequired = true,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetNumTiersDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownID"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                IsDefaultable = true,
                Label = "Market Segment",
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
                Label = "Geo",
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
                Label = "Meet Comp Analysis",
                DataType = "string",
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.COMMENTS,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                Label = "Additional Discounts",
                DataType = "string",
                IsRequired = false
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 41,
                AtrbCd = AttributeCodes.MM_MEDIA_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "string",
                IsRequired = true
                //UiType = "RADIOBUTTONGROUP",
                //LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN/ECAP",
                //LookupText = "DROP_DOWN",
                //LookupValue = "DROP_DOWN"
            });

            #endregion

            #region  WIP DEAL

            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "Deal Id",
                Width = 70,
                IsReadOnly = true,
                Template = "<div class='dealLnk'><a href=''>#=DC_ID#</a></div>"
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
                Width = 130,
                IsSortable = false,
                IsFilterable = false,
                IsReadOnly = true,
                Template = "<deal-tools ng-model='dataItem'></deal-tools>",
                HeaderTemplate = "<input type='checkbox' style='margin: 0px 6px 0px 13px;' ng-click='clkAllItems()' id='chkDealTools' />Deal Tools"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'START_DT', \"date:'MM/dd/yyyy'\")#",
                IsReadOnly = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'END_DT', \"date:'MM/dd/yyyy'\")#",
                IsReadOnly = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Deal Type",
                Template = "#=gridUtils.uiControlWrapper(data, 'OBJ_SET_TYPE_CD')#",
                IsReadOnly = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.WF_STG_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Label = "Stage",
                Template = "#=gridUtils.uiControlWrapper(data, 'WF_STG_CD')#",
                IsReadOnly = true,
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'PTR_USER_PRD')#",
                IsReadOnly = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'PTR_SYS_PRD')#",
                IsReadOnly = true,
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DEAL_COMB_TYPE,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_COMB_TYPE')#",
                Width = 100
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'VOLUME')#",
                Width = 95
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.CREDIT_VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'CREDIT_VOLUME')#",
                Width = 95
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DEBIT_VOLUME,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEBIT_VOLUME')#",
                Width = 95
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.BLLG_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'BLLG_DT', \"date:'MM/dd/yyyy'\")#",
                Label = "Last Credit / Debit Date",
                Width = 110
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.ON_ADD_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'ON_ADD_DT', \"date:'MM/dd/yyyy'\")#",
                Width = 110
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DEAL_SOLD_TO_ID,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'DEAL_SOLD_TO_ID')#",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.EXPIRE_YCS2,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Template = "#=gridUtils.uiControlWrapper(data, 'EXPIRE_YCS2')#",
                Width = 95
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.ECAP_PRICE,
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'ECAP_PRICE_____10___0')#",
                Format = "{0:c}"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.CAP,
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'CAP_____10___0')#",
                Format = "{0:c}"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "CAP_START_DT",
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'CAP_START_DT_____10___0', \"date:'MM/dd/yyyy'\")#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "CAP_END_DT",
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'CAP_END_DT_____10___0', \"date:'MM/dd/yyyy'\")#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "YCS2_PRC_IRBT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Label = "YCS2 Price",
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_PRC_IRBT')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "YCS2_START_DT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_START_DT', \"date:'MM/dd/yyyy'\")#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "YCS2_END_DT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_END_DT', \"date:'MM/dd/yyyy'\")#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "YCS2_OVERLAP_OVERRIDE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Template = "#=gridUtils.uiControlWrapper(data, 'YCS2_OVERLAP_OVERRIDE')#"
            });


            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "PRD_COST",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'PRD_COST')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COST_TYPE_USED",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150,
                Template = "#=gridUtils.uiControlWrapper(data, 'COST_TYPE_USED')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COST_TEST_RESULT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Label = "Cost Test Result",
                Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_RESULT')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COST_TEST_FAIL_OVERRIDE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Label = "Price Cost Test Analysis Override Comments",
                Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_FAIL_OVERRIDE')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COST_TEST_FAIL_OVERRIDE_REASON",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Label = "Price Cost Test Analysis Override",
                Template = "#=gridUtils.uiControlWrapper(data, 'COST_TEST_FAIL_OVERRIDE_REASON')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "MEET_COMP_PRICE_QSTN",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 140,
                Label = "Meet Comp Analysis",
                Template = "#=gridUtils.uiControlWrapper(data, 'MEET_COMP_PRICE_QSTN')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COMP_SKU",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Label = "Comp Sku",
                Template = "#=gridUtils.uiControlWrapper(data, 'COMP_SKU')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COMP_SKU_OTHR",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiControlWrapper(data, 'COMP_SKU_OTHR')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COMPETITIVE_PRICE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Label = "Comp Price",
                Template = "#=gridUtils.uiControlWrapper(data, 'COMPETITIVE_PRICE')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COMP_BENCH",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 120,
                Label = "Comp Bench",
                Template = "#=gridUtils.uiControlWrapper(data, 'COMP_BENCH')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "IA_BENCH",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Label = "IA Bench",
                Template = "#=gridUtils.uiControlWrapper(data, 'IA_BENCH')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "COMP_TARGET_SYSTEM_PRICE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 140,
                Label = "Comp Target System Price",
                Template = "#=gridUtils.uiControlWrapper(data, 'COMP_TARGET_SYSTEM_PRICE')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "MEETCOMP_TEST_RESULT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 120,
                Label = "Meet Comp Test Results",
                Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_RESULT')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "MEETCOMP_TEST_FAIL_OVERRIDE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                Label = "Meet Comp Analysis Override",
                Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_FAIL_OVERRIDE')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "MEETCOMP_TEST_FAIL_OVERRIDE_REASON",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Label = "Meet Comp Analysis Override Comments",
                Template = "#=gridUtils.uiControlWrapper(data, 'MEETCOMP_TEST_FAIL_OVERRIDE_REASON')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "RETAIL_CYCLE",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_CYCLE')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "RETAIL_PULL",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 120,
                Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "RETAIL_PULL_USR_DEF",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 120,
                Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL_USR_DEF')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "RETAIL_PULL_USR_DEF_CMNT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 160,
                Label = "Retail Pull$ User Defined Comments",
                Template = "#=gridUtils.uiControlWrapper(data, 'RETAIL_PULL_USR_DEF_CMNT')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "ECAP_FLR",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 110,
                Template = "#=gridUtils.uiControlWrapper(data, 'ECAP_FLR')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "BACK_DATE_RSN",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 140,
                Template = "#=gridUtils.uiControlWrapper(data, 'BACK_DATE_RSN')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "BACK_DATE_RSN_TXT",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 180,
                Template = "#=gridUtils.uiControlWrapper(data, 'BACK_DATE_RSN_TXT')#"
            });







            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PAYOUT_BASED_ON')#",
                IsDefaultable = true,
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
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#",
                IsDefaultable = true,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                IsRequired = true
            });

            #endregion








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