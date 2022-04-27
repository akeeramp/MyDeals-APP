
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
 })

export class ContractUtil {
    constructor() {}

   static findInArray (input:any, id:any) {
        var len = input.length;
        for (var i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
    }
}