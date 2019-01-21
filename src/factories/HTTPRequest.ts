import * as https from "https";
import * as http from "http";
import * as _ from "lodash";
import * as rp from "request-promise-native";


export default class HTTPRequest {

    static async makeGetRequest(options : any) : Promise<any>  
    {
        return await rp(options);
    };

}
