
//get the location from device
var loc = new Object();


var Model = Backbone.Model.extend({});
var LocationModel = Backbone.Model.extend({});
var Collection = Backbone.Collection.extend({
	model:Model,
	url : "http://api.wunderground.com/api/45449d3bedba48af/forecast/q/"+loc.lat+","+loc.long+".json?callback=?",

	initialize:function(){
		var self = this;
		
				navigator.geolocation.getCurrentPosition(
						//success
						function(location){
							loc.lat = location.coords.latitude;
							loc.long = location.coords.longitude;
							self.url = "http://api.wunderground.com/api/45449d3bedba48af/forecast/q/"+loc.lat+","+loc.long+".json?callback=?"
							self.fetch().then(function(data){
								var forecastday = data.forecast.simpleforecast.forecastday;
								self.models = forecastday;								
								showModels();
							});
							
							
						},
						//error
						function(error){
							console.log(error)
						},
						//options
						{enableHighAccuracy:true}
				);
			
		
		
	}
});
var collection = new Collection
function showModels(){
	console.log(collection.models);
}

function deployForecast(){
	
}
