export class ExcelColumnsConfig {
    static meetCompExcelColHeaders = ["Customer", "Deal Product Name(Only Processor, Lvl 4)", "Meet Comp Sku", "Meet Comp Price", "IA Bench", "Comp Bench"];
    static meetCompExcel = [
        {
            data: 'CUST_NM',
            type: 'text',
            readOnly: false,
            width: 140
        },
        {
            data: 'HIER_VAL_NM',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'MEET_COMP_PRD',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'MEET_COMP_PRC',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'IA_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'COMP_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 75
        }
    ]
}