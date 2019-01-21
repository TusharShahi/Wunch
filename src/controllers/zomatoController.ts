import {Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import { ZOMATO_API } from "../constants/constants";
import HTTP from "../factories/HTTPRequest";
// Get Restaurants

interface optionsRestaurantsRequest 
{
    latitude : number,

    longitude : number,

    radius? : number,

    cuisines? : string[]
} 


export let getRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    let latitude : number = null;
    let longitude : number = null;
    let radius : number = 5000;
    let cuisines : string;
    let url = ZOMATO_API + "search?"

    if(!_.isNil(req.query))
    {
        if(!_.isNil(req.query.longitude) && !_.isNil(req.query.latitude))
        {
            latitude = req.query.latitude;
            longitude = req.query.longitude;
        }

        url = url + 'lat=' + latitude + '&lon=' + longitude;

        if(!_.isNil(req.query.radius))
        {
            radius = (Number(req.query.radius)*1000);
        }

        url += '&radius' + radius;

        if(!_.isNil(req.query.cuisines))
        {
            cuisines = req.query.cuisines;
            url += '&cuisines' + encodeURIComponent(cuisines);
        }
    }

    let options = {
        'uri' : url,
        'headers' :
        {
        'Accept':  "application/json",
        'user-key' : process.env['ZOMATO_KEY'] 
    }
}

    let result = await HTTP.makeGetRequest(options);
    let resultJSON = JSON.parse(result);
    let restaurants = resultJSON.restaurants;

    let restaurantsData = [];
    for(let i=0;i<restaurants.length;i++)
    {
        let restaurant = restaurants[i].restaurant;
        let data = {
            name : restaurant.name,
            address : !_.isNil(restaurant.location.address) ? restaurant.location.address : "",
            latitude : !_.isNil(restaurant.location.latitude) ? restaurant.location.latitude : "",
            longitude : !_.isNil(restaurant.location.longitude) ? restaurant.location.longitude : "" ,
            price : restaurant.average_cost_for_two,
            photoLink : !_.isNil(restaurant.featured_image) ? restaurant.featured_image : ""
        }
        restaurantsData.push(data);
    }
    res.render("restaurantList.pug",{'restaurants' : restaurantsData});
}