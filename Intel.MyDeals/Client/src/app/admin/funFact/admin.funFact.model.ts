export class Fun_Facts {
    public FACT_SID: number;
    public FACT_TXT:string;
    public FACT_HDR:number;
    public FACT_ICON:number;
    public FACT_SRC: string;
    public ACTV_IND: boolean;
}

export interface Funfact_Map {
    ACTV_IND: boolean;
    FACT_HDR: string;
    FACT_ICON: string;
    FACT_SID: number;
    FACT_SRC: string;
    FACT_TXT: string;
}