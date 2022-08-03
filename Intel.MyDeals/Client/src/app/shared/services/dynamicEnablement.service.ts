import { Injectable } from "@angular/core";
import { constantsService } from "../../admin/constants/admin.constants.service";
import { logger } from "../logger/logger";

@Injectable({
    providedIn: 'root'
})
export class DynamicEnablementService {

    private readonly CONSTANT_TITLE = 'ANGULAR_ENABLED';

    private ANGULAR_ENABLED = false;    // Default to `false` to force AngularJS in case an issue occurs
    private WAS_CONFIG_SET = false;

    constructor(private constantsService: constantsService,
        private loggerService: logger) { }

    private getEnablementConfig() {
        this.constantsService.getConstantsByName(this.CONSTANT_TITLE).subscribe(data => {
            if (data) {
                this.ANGULAR_ENABLED = (data.CNST_VAL_TXT === 'true');
                this.WAS_CONFIG_SET = true;
            } else {
                this.loggerService.error(`The constant '${ this.CONSTANT_TITLE }' was not found and could not be retrieved; Defaulting to AngularJS components`,
                    `Constant not found`, null);
            }
        }, (error) => {
            this.loggerService.error(`The constant '${ this.CONSTANT_TITLE }' was not found and could not be retrieved; Defaulting to AngularJS components`,
                `Constant not found`, error);
        });
    }

    public isAngularEnabled() {
        if (!this.WAS_CONFIG_SET) {
            this.getEnablementConfig();
        }
        return this.ANGULAR_ENABLED;
    }

    public isAngularJSEnabled() {
        return !this.isAngularEnabled();
    }

}