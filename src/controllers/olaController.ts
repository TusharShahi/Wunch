import {Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import { OLA_API } from "../constants/constants";
import HTTP from "../factories/HTTPRequest";
import { type } from "os";

interface olaHeaders 
{
        'Authorization'? : string,
        'x-app-token': string   
}

interface olaCostEstimate 
{
        type : string,
        minAmount : number,
        maxAmount : number,
        distance : number, 
        time : number
}

interface olaShareEstimate 
{
        type : string,
        seat : number,
        amount : number,
        savings : number
}

export const getOlaCosts= async (dropLatitude : number, dropLongitude : number,pickUpLatitude : number, pickUpLongitude : number ) :Promise<any> => 
{

   let olaApiUrl = OLA_API + 'pickup_lat=' + pickUpLatitude + '&pickup_lng=' + pickUpLongitude + '&drop_lat=' + dropLatitude + '&drop_lng=' + dropLongitude + '&service_type=p2p'

   const OLA_KEY = process.env['OLA_KEY'];
   let options = {
        'headers' :  {
        'x-app-token':  OLA_KEY
    },
    'uri' : olaApiUrl
   }

    let result = await HTTP.makeGetRequest(options);
    let resultJSON = JSON.parse(result);

    let rideEstimates = resultJSON.ride_estimate;
     
    let olaCosts : olaCostEstimate[] = [];
    let olaShareCosts : olaShareEstimate[] = [];
     if(!_.isNil(rideEstimates))
    {
    for(let i=0;i < rideEstimates.length; i++)
        {
                let olaCostEstimate : olaCostEstimate = null;
                let olaShareEstimate : olaShareEstimate  = null;
               if(rideEstimates[i].category != 'share')
               { 
                olaCostEstimate = {
                        type : rideEstimates[i].category,
                        minAmount : rideEstimates[i].amount_min,
                        maxAmount : rideEstimates[i].amount_max,
                        distance : rideEstimates[i].distance, 
                        time : rideEstimates[i].distance
                    }

                    olaCosts.push(olaCostEstimate);
                }
                else
                {
                        if(!_.isNil(rideEstimates[i].fares))
                        {
                                let shareFares = rideEstimates[i].fares;
                        for (let j=0;j<shareFares.length;j++)
                        {

                 olaShareEstimate = {
                         type : 'share',
                        amount : shareFares[j].cost,
                        savings : shareFares[j].savings,
                        seat : shareFares[j].seats
                 }             
                            olaShareCosts.push(olaShareEstimate);
                }

                }
                }    
        }

        return { olaCosts,olaShareCosts}
   }
   return null;
}