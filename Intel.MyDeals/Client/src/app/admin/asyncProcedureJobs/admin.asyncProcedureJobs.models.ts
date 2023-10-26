export class AsyncProcTrigger {
    public ASYNC_SID: number;
    public STATE_TOKEN: number;
    public PROC_NAME: string;
    public PROC_DATA: string;
    public STATE: string;
    public START_TIME: Date;
    public END_TIME: Date;
    public DURATION: string;
}

export class CreateAsyncProcTriggerData {
    public PROC_NAME: string;
    public PROC_DATA: string;
}