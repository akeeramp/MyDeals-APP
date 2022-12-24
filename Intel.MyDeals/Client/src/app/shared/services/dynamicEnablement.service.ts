import { Injectable } from "@angular/core";
import { constantsService } from "../../admin/constants/admin.constants.service";
import { logger } from "../logger/logger";

@Injectable({
    providedIn: 'root'
})
export class DynamicEnablementService {

    private readonly CONSTANT_TITLE = 'ANGULAR_ENABLED';

    private ANGULAR_ENABLED:boolean;    // Default to `false` to force AngularJS in case an issue occurs

    constructor(private constantsService: constantsService,
        private loggerService: logger) { }

    public async getEnablementConfig() {
        const data = await this.constantsService.getConstantsByName(this.CONSTANT_TITLE).toPromise().catch((error) => {
            this.loggerService.error(`The constant '${ this.CONSTANT_TITLE }' was not found and could not be retrieved; Defaulting to AngularJS components`,
                `Constant not found`, error);
        });
        if (data) {
            this.ANGULAR_ENABLED = (data.CNST_VAL_TXT === 'true');
        } 
        else{
            this.ANGULAR_ENABLED = false;
        }
    }
}