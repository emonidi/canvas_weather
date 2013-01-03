function getForecast(lat,long){
	
	//get the location from device
	

	var Model = Backbone.Model.extend({});
	var LocationModel = Backbone.Model.extend({});
	var Collection = Backbone.Collection.extend({
		model:Model,
		url:"http://api.wunderground.com/api/45449d3bedba48af/forecast/q/"+lat+","+long+".json?callback=?",

		initialize:function(){
			var self = this;
			
			self.fetch().then(function(data){
				var forecastday = data.forecast.simpleforecast.forecastday;
				self.models = forecastday;								
				deployForecast();
			});
				
			
			
		}
	});
	var collection = new Collection
	function showModels(){
		console.log(collection.models);
	}

	function deployForecast(){
		$("#forecastInfo").append('<ul class="forecast"></ul>');
		var days = collection.models;
		
		_.each(days,function(e,i){
			$('.forecast').append("<li>"+
					"<h3>"+
						e.date.weekday_short+" - "+e.date.day+"/"+e.date.month+"/"+e.date.year+
					"</h3>"+
					"<div class='infoLi'>"+
						"<span class='icon'>"+
							"<img src='assets/images/icons/"+e.icon+".png'/>"+
						"</span>"+
						"<span class='info'>"+
							"<h3>"+e.conditions+"<h3/>"+
							"<p>Hi: "+e.high.celsius+"&deg Lo: "+e.low.celsius+"&deg</p>"+
							
						"</span>"+
					"</div>"+
			"</li>");
			//$(".forecast").append("</br><p>"+JSON.stringify(days[0])+"</p>")

		});
		
		
		
	}


}