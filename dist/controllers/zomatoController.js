"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const constants_1 = require("../constants/constants");
const HTTPRequest_1 = require("../factories/HTTPRequest");
exports.getRestaurants = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let latitude = null;
    let longitude = null;
    let radius = 5000;
    let cuisines;
    let url = constants_1.ZOMATO_API + "search?";
    if (!_.isNil(req.query)) {
        if (!_.isNil(req.query.longitude) && !_.isNil(req.query.latitude)) {
            latitude = req.query.latitude;
            longitude = req.query.longitude;
        }
        url = url + 'lat=' + latitude + '&lon=' + longitude;
        if (!_.isNil(req.query.radius)) {
            radius = (Number(req.query.radius) * 1000);
        }
        url += '&radius' + radius;
        if (!_.isNil(req.query.cuisines)) {
            cuisines = req.query.cuisines;
            url += '&cuisines' + encodeURIComponent(cuisines);
        }
    }
    let options = {
        'uri': url,
        'headers': {
            'Accept': "application/json",
            'user-key': process.env['ZOMATO_KEY']
        }
    };
    let result = yield HTTPRequest_1.default.makeGetRequest(options);
    let resultJSON = JSON.parse(result);
    let restaurants = resultJSON.restaurants;
    let restaurantsData = [];
    for (let i = 0; i < restaurants.length; i++) {
        let restaurant = restaurants[i].restaurant;
        let data = {
            name: restaurant.name,
            address: !_.isNil(restaurant.location.address) ? restaurant.location.address : "",
            latitude: !_.isNil(restaurant.location.latitude) ? restaurant.location.latitude : "",
            longitude: !_.isNil(restaurant.location.longitude) ? restaurant.location.longitude : "",
            price: restaurant.average_cost_for_two,
            photoLink: !_.isNil(restaurant.featured_image) ? restaurant.featured_image : ""
        };
        restaurantsData.push(data);
    }
    res.render("restaurantList.pug", { 'restaurants': restaurantsData });
});
//# sourceMappingURL=zomatoController.js.map