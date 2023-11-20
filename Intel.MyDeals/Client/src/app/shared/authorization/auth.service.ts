import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public static getToken(): string {
        //in this method we will put the get Token API and store to local variable and if not exist will hit again and store it
        return localStorage.getItem('ReqVerToken');
    }

}