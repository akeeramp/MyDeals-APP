export interface EnvsDataMap {
    ENV_NM: string;
    ENV_ORD: number;
    ENV_SRC: string;
    ENV_TAG: string;
    IS_CURR_ENV: number;
    IS_LNK: number;
}

export interface DbObjs {
    DB_OBJ: string;
    DB_TYPE: string;
    OBJ_SCHEMA: string;
}

export interface ObjsDataMap {
    categoryName: string;
    subCategories: DbObjs[]
}

export interface Envs {
    ENV_NM: string;
    ENV_ORD: number;
    ENV_TAG: string;
}

export interface DbAuditDataPacket {
    TESTITEM: string,
    ENVIRONMENTS: Envs[],
    DB_OBJECTS: DbObjs[]
}

export interface DbAuditObjTextRequest {
    ENV_NM: string;
    ENV_TAG: string;
    DB_TYPE: string;
    DB_OBJ: string;
    DB_DATA: string;
}

export interface GridReturnsOrig {
    DB_OBJ: string;
    DB_TYPE: string;
    LOCAL: number;
}

export interface GetObjMap {
    LineNbr: number;
    LineText: string;
}