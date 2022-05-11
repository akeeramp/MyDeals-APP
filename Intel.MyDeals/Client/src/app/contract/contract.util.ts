import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
 })

export class ContractUtil {

   static findInArray (input, id) {
       const len = input.length;
        for (let i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
    }
}