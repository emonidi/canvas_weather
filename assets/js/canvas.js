

function w(){
	/**
	 * Created with JetBrains WebStorm.
	 * User: admin
	 * Date: 12/24/12
	 * Time: 4:08 PM
	 * To change this template use File | Settings | File Templates.
	 */


	  var loc = new Object;

	    navigator.geolocation.getCurrentPosition(function(location){
	        loc.lat = location.coords.latitude;
	        loc.long = location.coords.longitude;
	        
	        reverseGeoCode(loc);
	    },function(error){
	    	alert("error");
	    });

	    
	    function reverseGeoCode(loc){
	       // console.log(loc);
	        $.ajax({
	            url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+loc.lat+","+loc.long+"&sensor=true",
	            type:"GET",
	            dataType:"JSON",
	            success:function(data){
	                weather.place = data.results[4].formated_address;

	                loc.town = data.results['0'].address_components['2'].long_name;
	                   loc.country = data.results['0'].address_components['4'].short_name;
	                   loc.country_name = data.results[0].address_components[4].long_name;
	                
	                   getSunrise(loc);


	                   
	            }
	        });
	    }
	    var weather = new Object();
	    function getSunrise(loc){
	        $.ajax({
	            url:"http://api.geonames.org/timezoneJSON?lat="+loc.lat+"&lng="+loc.long+"&username=aero_students&callback=?",
	            dataType:'JSONP',
	            success:function(data){

	             loc.sunrise = new Date(data.sunrise);
	             loc.sunset = new Date(data.sunset);

	               getWeather(loc);


	            }
	        });
	    }


	    function getWeather(place){

	        $.ajax({
	           url:"http://api.wunderground.com/api/45449d3bedba48af/conditions/q/"+place.country+"/"+place.town+".json?callback=?",
	           dataType:"jsonp",
	           success:function(data){

	             //  var forecast  =  data.forecast.simpleforecast.forecastday[0];

	               var result = data.current_observation;
	               // result.icon = 'snow';
	                //result.temp_c = '-12';
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
	                       weather.secondImage = 'assets/images/cloudy_night.png';
	                       weather.secondImageStyle = 'position:absolute;top:0px;width:100%;left:0px;height:40%;z-index:-1';
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
	            $('body').append(function(){

	            });
	        }

	        function icy(result,loc){
	           // result.temp_c = "-4";
	            if(result.temp_c < 0){
	                if(loc.time === 'day'){
	                    weather.icy = function(){
	                        $('body').append("<div class='icy' style='width:"+window.document.width+"px;display:none;'>"+
	                            "<img src='assets/images/icy_day_left.png' style='position: absolute;top:0px;left:0px;height:"+$('canvas').height()+"px'/>"+
	                            "<img src='assets/images/icy_day_right.png' style='position: absolute;top:0px;right:0px;height:"+$('canvas').height()+"px'/>"

	                            +"</div>");
	                        $(".icy").fadeIn('slow');
	                    };
	                }else{
	                    weather.icy = function(){
	                        $('body').append("<div class='icy' style='width:"+window.document.width+"px;display:none;height:"+window.document.height+"px'>"+
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

	    	$('#canvas').empty();
	        var canvas = document.getElementById("canvas");

	        $('body').css('margin','0px');
	        canvas.setAttribute('width',window.document.width);
	        canvas.setAttribute('height',window.document.height);
	        var bgImg = new Image();
	        bgImg.src = weather.background;
	        var ctx =  canvas.getContext('2d');

	        bgImg.onload = function(){
	            ctx.drawImage(bgImg,0,0,1280,window.document.height);
	            //console.log(window.innerHeight = $('canvas').height());
	            //append sun/moon
	            $('body').append("<img id='skyBody' src='"+weather.skyBody+"' style='position:absolute;top:0px;left:"+window.document.width*0.2+"px ;width:"+window.document.width*0.6+"px'/>");
	            $('body').append("<div id='secondImage'><img src='"+weather.secondImage+"' style='"+weather.secondImageStyle+"'/></div>");
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
	    $('body').append("<div id='info'>"+
	                   "<div id='location' style='position: absolute;top:50%;margin-left: 5%;padding:5px 10px;color: white;font-size: 16px;font-family: Arial;border-bottom:solid 1px white;'>"+weather.location.town+", "+weather.location.country+"</div>"+
	                   "<div id='time' style='position: absolute;top: 55%;margin-left: 5%;padding:5px 10px;color: white;font-size: 16px;font-family: Arial'>"+weather.time+"</div>"+
	                   "<div id='temp' style='position: absolute;top: 60%;margin-left: 4%;padding:5px 10px;color: white;font-size: 75px;font-family: Arial'>"+weather.temperature+"&deg</div>"+
	                   "<div id='pic' style='position: absolute;top: 50%;right:4%;color: white;font-size: 75px;font-family: Arial'><img id='wIcon' src='"+weather.pic+"' style='height:"+window.document.width*0.35+"px'/></div>"+
	                   "<div class='helper' style='position: absolute;top: 70%;right:4%;color: white;font-size: 25px;font-family: Arial'></div>"+
	                  
	    "</div>");
	    
	    $('body').append("<div id='refreshButton'></div>");
	    
	    var transform = false;
    	
    	document.getElementById('info').addEventListener('touchstart',function(target){
    		if(transform){
    			transform = false;
    		}else{
    			transform =true;
    		}
    		
    	
    	});
	    
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




