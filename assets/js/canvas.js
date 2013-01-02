$(document).ready(function(){
$("body").append("OK");
	$("body").on('touchmove',function(e){e.preventDefault();});
});
document.addEventListener('deviceready',function(){
	
	$("#mainWrapper").append("<div id='splash'><img src='assets/images/icons/splash_sun.png'/></div>");
	
});

function w(){
	
	/**
	 * Created with JetBrains WebStorm.
	 * User: admin
	 * Date: 12/24/12
	 * Time: 4:08 PM
	 * To change this template use File | Settings | File Templates.
	 */

      var debug = true;
	  var loc = new Object();
	  var weather = new Object();

	  	if(debug){
	  		$("#mainWrapper").append("<p id='step1'>getting location...</p>");
	  	}
	    navigator.geolocation.getCurrentPosition(function(location){
	        loc['lat'] = location.coords.latitude;
	        loc['long'] = location.coords.longitude;
	        debug ? $("#step1").append("OK <br/>lat="+loc['lat']+"<br/>long="+loc['long']) : '';

	        reverseGeoCode(loc);
	    },function(error){
	    	alert("error");
	    },{enableHighAccuracy:true});

	    
	    function reverseGeoCode(loc){
	    	debug ?	$("#mainWrapper").append("<p id='step2'>reverse geocoding...</p>") : '';

	       // console.log(loc);
	        $.ajax({
	            url:"http://api.geonames.org/findNearbyPlaceNameJSON?lat="+loc['lat']+"&lng="+loc['long']+"&username=aero_students&lang=bg",
	            type:"GET",
	            dataType:"JSONP",
	            success:function(data){
	            	debug ? $("#step2").append("OK") : '';
	            	//$('#mainWrapper').append($.parseJSON(data).toString());
	            		
	                   loc.town = data.geonames[0].name;
	                   
	                   loc.country = data.geonames[0].countryCode;
	                   loc.country_name = data.geonames[0].countryName;
	                   
		                weather.place = loc.town+" ,"+loc.country;

	                   getSunrise(loc);


	                   
	            },
	            error:function(){
	            	alert('error');
	            }
	        });
	    }
	    
	    
	    function getSunrise(loc){
	    	debug ? $("#mainWrapper").append("<p id='step3'>getting sunrise/sunset...</p>") : '';

	        $.ajax({
	            url:"http://api.geonames.org/timezoneJSON?lat="+loc['lat']+"&lng="+loc['long']+"&username=aero_students&callback=?",
	            dataType:'JSONP',
	            success:function(data){

	             loc.sunrise = new Date(data.sunrise);
	             loc.sunset = new Date(data.sunset);
	             $("#step3").append("OK");
	               getWeather(loc);


	            }
	        });
	    }


	    function getWeather(place){
	    	debug ? $("#mainWrapper").append("<p id='step4'>getting weather...</p>") : '';

	        $.ajax({
	           url:"http://api.wunderground.com/api/45449d3bedba48af/conditions/q/"+loc['lat']+","+loc['long']+".json?callback=?",
	           dataType:"jsonp",
	           success:function(data){
	        	   debug ? $("#mainWrapper").append(JSON.stringify(data)) : '';
	             //  var forecast  =  data.forecast.simpleforecast.forecastday[0];

	               var result = data.current_observation;
	                result.icon = 'snow';
	                result.temp_c = '12';
	               //console.log(result);
	               var hour = new Date(result.local_time_rfc822);
	               if(hour >  loc.sunset){
	                   loc.time = 'night';
	                   weather.background = 'assets/images/starry_sky.jpg';
	                   weather.skyBody = 'assets/images/moon.png';
	                   if(result.icon === 'fog'){
	                	   weather.skyBody = '';
	                       weather.background = 'assets/images/foggy_night.jpg';
	                       weather.secondImage = 'assets/images/fog_night.png';
	                       weather.secondImageStyle='position:absolute;top:0px;left:0px;width:'+window.document.width+'px';	                   }
	                   if(result.icon === 'partlycloudy'){
	                       weather.secondImage = 'assets/images/cloudy_night.png';
	                       weather.secondImageStyle = 'position:absolute;top:0px;width:100%;left:0px';
	                   }
	                   if(result.icon === 'mostlycloudy'){
	                       weather.background = 'assets/images/cloudy_night.png';

	                       weather.secondImage = 'assets/images/dark_cloud_night_2.png';
	                       weather.secondImageStyle = 'position:absolute;top:15px;width:80%;left:10%;height:25%;';
	                   }
	                   if(result.icon === 'cloudy'){
	                       weather.background = 'assets/images/cloudy_night.png';
	                	   weather.skyBody = '';
	                       weather.secondImage = 'assets/images/dark_cloud_night_2.png';
	                       weather.secondImageStyle = 'position:absolute;top:5%;width:100%;height:30%';
	                   }
	                   if(result.icon === 'rain'){
	                       weather.background = 'assets/images/cloudy_night.png';

	                	   weather.skyBody = 'assets/images/dark_cloud_night_2.png';
	                       weather.secondImage = 'assets/images/rain_night.png';
	                       weather.secondImageStyle = 'position:absolute;top:20%;width:70%;left:15%;height:20%';
	                       
	                   }
	                   if(result.icon === 'snow'){
	                       weather.background = 'assets/images/cloudy_night.png';

	                	   weather.skyBody = 'assets/images/dark_cloud_night_2.png';
	                       weather.secondImage = 'assets/images/snow_big_night.png';
	                       weather.secondImageStyle = 'position:absolute;top:20%;width:70%;left:15%;height:20%';
	                   }     
	                   
	               }else{
	                   loc.time = 'day';
	                   weather.background = 'assets/images/clear_day.jpg';
	                   weather.skyBody = 'assets/images/sun.png';
	                   if(result.icon === 'clear' || result.icon === 'sunny'){
	                	   weather.icon = 'clear';
	                	   weather.secondImage = '';
	                	   weather.secondImageStyle='';
	                   }
	                   if(result.icon === 'fog'){
	                       weather.skyBody = '';
	                       weather.background = 'assets/images/foggy_day.jpg';
	                       weather.secondImage = 'assets/images/fog_day.png';
	                       weather.secondImageStyle='position:absolute;top:0px;left:0px;width:'+window.document.width+'px';
	                   }
	                   if(result.icon === 'partlycloudy'){
	                       weather.secondImage = 'assets/images/white_cloud_day_2.png';
	                       weather.secondImageStyle = 'position:absolute;top:20%;width:60%;left:15%';

	                   }
	                   if(result.icon === 'rain'){
	                	   weather.background = 'assets/images/grey_cloudy_day.jpg';
	                	   weather.skyBody = 'assets/images/white_cloud_day_2.png';
	                       weather.secondImage = 'assets/images/rain_day.png';
	                       weather.secondImageStyle = 'position:absolute;top:20%;width:70%;left:15%;height:20%';
	                       
	                   }
	                   if(result.icon === 'mostlycloudy'){
	                       weather.background = 'assets/images/grey_cloudy_day.jpg';
	                	   weather.skyBody = '';
	                	   weather.secondImage = 'assets/images/white_cloud_day_2.png';
	                       weather.secondImageStyle = 'position:absolute;top:15%;width:70%;left:15%;height:20%';
	                   }
	                   if(result.icon === 'cloudy'){
	                       weather.background = 'assets/images/dark_cloudy_day.jpg';
	                	   weather.skyBody = '';
	                	   weather.secondImage = 'assets/images/white_cloud_day_2.png';
	                       weather.secondImageStyle = 'position:absolute;top:5%;width:100%;height:30%';
	                   }
	                   if(result.icon === 'snow'){
	                       weather.background = 'assets/images/grey_cloudy_day.jpg';

	                	   weather.skyBody = 'assets/images/white_cloud_day_2.png';
	                       weather.secondImage = 'assets/images/snow_big_day.png';
	                       weather.secondImageStyle = 'position:absolute;top:20%;width:70%;left:15%;height:20%';
	                   }     
	               }




	               icy(result,loc);
	               weather.icon = result.icon;
	              
	               if(result.temp_c < 0 ){
	                   weather.temperature =  result.temp_c;
	               }else{
	                   weather.temperature =  " "+result.temp_c;
	               }

	               weather.pic = 'assets/images/icons/'+result.icon+".png";
	               weather.location = loc;
	               var time = new Date(result.local_time_rfc822);
	               var minutes = '';
	               if(parseInt(time.getMinutes()) < 10){
	                    minutes  = "0"+time.getMinutes();
	               }else{
	                   minutes = time.getMinutes();
	               }
	               weather.time = result.local_time_rfc822.split(" ",time)['0'] +" "+ time.getHours()+":"+minutes;
	               console.log(weather.time);
	               initCanvas(weather,loc);

	           }
	        });


	        function  rainy(result,loc){
	            $('#mainWrapper').append(function(){

	            });
	        }

	        function icy(result,loc){
	           // result.temp_c = "-4";
	            if(result.temp_c < 0){
	                if(loc.time === 'day'){
	                    weather.icy = function(){
	                        $('#mainWrapper').append("<div class='icy' style='width:"+window.document.width+"px;display:none;'>"+
	                            "<img src='assets/images/icy_day_left.png' style='position: absolute;top:0px;left:0px;height:"+$('canvas').height()+"px'/>"+
	                            "<img src='assets/images/icy_day_right.png' style='position: absolute;top:0px;right:0px;height:"+$('canvas').height()+"px'/>"

	                            +"</div>");
	                        $(".icy").fadeIn('slow');
	                    };
	                }else{
	                    weather.icy = function(){
	                        $('#mainWrapper').append("<div class='icy' style='width:"+window.document.width+"px;display:none;height:"+window.document.height+"px'>"+
	                            "<img src='assets/images/icy_night_left.png' style='position: absolute;top:0px;left:0px;height:"+$('canvas').height()+"px'/>"+
	                            "<img src='assets/images/icy_night_right.png' style='position: absolute;top:0px;right:0px;height:"+$('canvas').height()+"px'/>"

	                            +"</div>");
	                        $(".icy").fadeIn('slow');
	                    };
	                }
	            }
	        }

	    }







	    function initCanvas(weather){
	    	
	    	$('#mainWrapper').empty();
	    	$('#mainWrapper').append("<canvas id='canvas'></canvas>");
	    
	    	
	        var canvas = document.getElementById("canvas");
	         
	         WebGL2D.enable(canvas); // adds "webgl-2d" context to cvs


	        $('#mainWrapper').css('margin','0px');
	        canvas.setAttribute('width',window.document.width);
	        canvas.setAttribute('height',window.document.height);
	        var bgImg = new Image();
	        bgImg.src = weather.background;
	        var ctx =  canvas.getContext('2d');


	        bgImg.onload = function(){
	            ctx.drawImage(bgImg,0,0,1280,window.document.height);
	            //console.log(window.innerHeight = $('canvas').height());
	            //append sun/moon
	            $('#mainWrapper').append("<img id='skyBody' src='"+weather.skyBody+"' style='position:absolute;top:0px;left:"+window.document.width*0.2+"px ;width:"+window.document.width*0.6+"px'/>");
	            $('#mainWrapper').append("<div id='secondImage'><img src='"+weather.secondImage+"' style='"+weather.secondImageStyle+"'/></div>");
	            deployInfo(weather,ctx);
	            animateCanvas(ctx,bgImg,weather);
	
	            if(weather.icon === 'rain' || weather.icon === 'snow'){
	            	
	            	$("#skyBody").css('width',window.document.width*0.8+'px');
	            	$("#skyBody").css('left',window.document.width*0.1+'px');
	            	$("#skyBody").css('top',window.document.height*0.05+'px');
	            	$('#secondImage').find('img').remove();
	            	$("#secondImage").attr('style',weather.secondImageStyle).addClass('rainFall');
	            	$("#secondImage").css('background-image','url('+weather.secondImage+')');
	     
	            	
	            }


	        };


	            weather.icy();


	        function animateCanvas(ctx,bgImage,weather){
	        	
	        
	          
	            var step = '';
	            
	        

	            var interval = setInterval(function(){
	            	
	            	
	            	
	                ctx.clearRect();
	                ctx.drawImage(bgImg,step,0,1300,window.document.height);
	                ctx.drawImage(bgImg,1300+step,0,window.document.width*2+step,window.document.height);	

	              
	                
	                
	                if(window.document.width+step < 0){
	                    step = -1;
	                  
	                   
	                    
	                }else{
	                    step = step-1;
	                  
	                    
	                }
	              

	            },84);
	        }
	    }

}
	$(document).ready(function(){
		document.addEventListener('deviceready',function(){
		
			w();
		});
	
		

	
	  
	    
	});

	function deployInfo(weather,ctx){
		$('#info').remove();
		
	    $('#mainWrapper').append("<div id='info' style='position:absolute;top:50%;width:100%;display:inline;height:200px;'>"+
	                  "<div id='mainInfo' style='float:left;'>"+
		                  "<div id='loctime' style='display:inline;color: white;font-size: 16px;padding:0px 10px 0px 10px;font-family: Arial;border-bottom:solid 1px white;width:90%;position:absolute;margin-left:2%;margin-right:2%'>"+
		                   "<span id='location' style='float:left'>"+weather.location.town+", "+weather.location.country+"</span>"+
		                   "<span id='time' style='float:right'>"+weather.time+"</span>"+
	
		                   "</div>"+
		                   "<div id='pictemp' style='display:inline'>"+
			                   "<div id='temp' style='float:left;margin-top:20px;padding:0px 10px 0px 10px;color: white;font-size: 75px;font-family: Arial'>"+weather.temperature+"&deg</div>"+
			                   "<div id='pic' style='position:absolute;float:right;margin-top:15px;right:5px;color: white;font-size: 75px;font-family: Arial'><img id='wIcon' src='"+weather.pic+"' style='height:90px'/></div>"+
		                  
		                   "</div>"+
	                  "</div>"+
	                  "<div id='forecastInfo' style='margin-top:-100px;float:left;margin-left:100%;width:100%;'>"+
	                  	
	                  "</div>"+
	                   	                  
	    "</div>");
	    
	   getForecast();
	    
	    document.getElementById("info").addEventListener('touchmove',function(event){
	    	$("#info").removeClass('animateLeft');
	    	$("#info").removeClass('animateRight');
	    	$$('#info').swipeLeft(function(){
	    		
	    	$("#info").addClass('animateLeft');
	    	});
	    	
	    	$$('#info').swipeRight(function(){
	    		$("#info").addClass('animateRight');
	    	});

	    });
	    
	 
	    
	  

	    
	    $('#mainWrapper').append("<div id='refreshButton'></div>");
	    $('#refreshButton')[0].addEventListener('touchstart',function(){
	    	$("#refreshButton").addClass('animated');
			  navigator.accelerometer.clearWatch(compass);

			transform = false;
	    	w();
	    });
	    
//	    var transform = false;
//
//    	document.getElementById('info').addEventListener('touchstart',function(target){
//    		if(transform){
//    			transform = false;
//
//    		}else{
//    			transform =true;
//    			
//    		}
//    		
//    	
//    	});
	    
	   
    	
        var compass  = navigator.accelerometer.watchAcceleration(function(acc){
        	var z = acc.z.toFixed('1');
        	var x = acc.x.toFixed('1');
        	var y = acc.y.toFixed('1');
        	$(".helper").html(weather.icon);
        	
        	
        	
        
        	
        	if(transform){
        		$("#wIcon,#temp,#location,#time").css('-webkit-transform-style','preserve-3d');
            	$("#wIcon,#temp,#location,#time").css('-webkit-transform','rotateY('+x*-10+'deg) skewY('+x*-5+'deg)');
            	$("#wIcon,#temp,#location,#time").css('transform','rotateY('+x*-10+'deg) skewY('+x*-5+'deg)');
        	}else{
        		$("#wIcon,#temp,#location,#time").css('-webkit-transform-style','none');
            	$("#wIcon,#temp,#location,#time").css('-webkit-transform','none');
            	$("#wIcon,#temp,#location,#time").css('transform','none');


        	}

        },error,{frequency:100});
        
        function error(){
        	alert('errror');
        };
        
       
	    //console.log(weather);
	    
	  
	}
	
	
	
	
	


