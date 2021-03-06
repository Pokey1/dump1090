var zoom = 8; //map zoom level 8,9,10,11, etc. as you go in

var planeObject = {
	oldlat		: null,
	oldlon		: null,
	oldalt		: null,

	// Basic location information
	altitude	: null,
	speed		: null,
	track		: null,
	latitude	: null,
	longitude	: null,
	
	// Info about the plane
	flight		: null,
	squawk		: null,
	icao		: null,
	is_selected	: false,	

	// Data packet numbers
	messages	: null,
	seen		: null,

	// Vaild...
	vPosition	: false,
	vTrack		: false,

	// GMap Details
	marker		: null,
	markerColor	: MarkerColor,
	lines		: [],
	trackdata	: new Array(),
	trackline	: new Array(),

	// When was this last updated?
	updated		: null,
	reapable	: false,
	
	//info from tail number - oink
	equipment   : 'Boeing 727',    //aircraft type
	age         : 13,       //age of aircraft in years
	coachfare   : 499,      //cost to fly coach
	ontimepct   : 63,       //on tiie percentage
	lastseen    : 1,        //last seen in days 
	infoWindow  : new google.maps.InfoWindow({content: this.equipment}),

	// Appends data to the running track so we can get a visual tail on the plane
	// Only useful for a long running browser session.
	funcAddToTrack	: function(){
			// TODO: Write this function out
			this.trackdata.push([this.latitude, this.longitude, this.altitude, this.track, this.speed]);
			this.trackline.push(new google.maps.LatLng(this.latitude, this.longitude));
		},

	// This is to remove the line from the screen if we deselect the plane
	funcClearLine	: function() {
			if (this.line) {
				this.line.setMap(null);
				this.line = null;
			}
			if (this.line2) {
				this.line2.setMap(null);
				this.line2 = null;
			}
		},

	// Should create an icon for us to use on the map...
	funcGetIcon	: function() {
			// If this marker is selected we should make it lighter than the rest.
			if (this.is_selected == true) {
				this.markerColor = SelectedColor;
			}
			
			// Plane marker
            var baseSvg = {
                planeData : "M 1.9565564,41.694305 C 1.7174505,40.497708 1.6419973,38.448747 " +
                    "1.8096508,37.70494 1.8936398,37.332056 2.0796653,36.88191 2.222907,36.70461 " +
                    "2.4497603,36.423844 4.087816,35.47248 14.917931,29.331528 l 12.434577," +
                    "-7.050718 -0.04295,-7.613412 c -0.03657,-6.4844888 -0.01164,-7.7625804 " +
                    "0.168134,-8.6194061 0.276129,-1.3160905 0.762276,-2.5869575 1.347875," +
                    "-3.5235502 l 0.472298,-0.7553719 1.083746,-0.6085497 c 1.194146,-0.67053522 " +
                    "1.399524,-0.71738842 2.146113,-0.48960552 1.077005,0.3285939 2.06344," +
                    "1.41299352 2.797602,3.07543322 0.462378,1.0469993 0.978731,2.7738408 " +
                    "1.047635,3.5036272 0.02421,0.2570284 0.06357,3.78334 0.08732,7.836246 0.02375," +
                    "4.052905 0.0658,7.409251 0.09345,7.458546 0.02764,0.04929 5.600384,3.561772 " +
                    "12.38386,7.805502 l 12.333598,7.715871 0.537584,0.959688 c 0.626485,1.118378 " +
                    "0.651686,1.311286 0.459287,3.516442 -0.175469,2.011604 -0.608966,2.863924 " +
                    "-1.590344,3.127136 -0.748529,0.200763 -1.293144,0.03637 -10.184829,-3.07436 " +
                    "C 48.007733,41.72562 44.793806,40.60197 43.35084,40.098045 l -2.623567," +
                    "-0.916227 -1.981212,-0.06614 c -1.089663,-0.03638 -1.985079,-0.05089 -1.989804," +
                    "-0.03225 -0.0052,0.01863 -0.02396,2.421278 -0.04267,5.339183 -0.0395,6.147742 " +
                    "-0.143635,7.215456 -0.862956,8.845475 l -0.300457,0.680872 2.91906,1.361455 " +
                    "c 2.929379,1.366269 3.714195,1.835385 4.04589,2.41841 0.368292,0.647353 " +
                    "0.594634,2.901439 0.395779,3.941627 -0.0705,0.368571 -0.106308,0.404853 " +
                    "-0.765159,0.773916 L 41.4545,62.83158 39.259237,62.80426 c -6.030106,-0.07507 " +
                    "-16.19508,-0.495041 -16.870991,-0.697033 -0.359409,-0.107405 -0.523792," +
                    "-0.227482 -0.741884,-0.541926 -0.250591,-0.361297 -0.28386,-0.522402 -0.315075," +
                    "-1.52589 -0.06327,-2.03378 0.23288,-3.033615 1.077963,-3.639283 0.307525," +
                    "-0.2204 4.818478,-2.133627 6.017853,-2.552345 0.247872,-0.08654 0.247455," +
                    "-0.102501 -0.01855,-0.711959 -0.330395,-0.756986 -0.708622,-2.221756 -0.832676," +
                    "-3.224748 -0.05031,-0.406952 -0.133825,-3.078805 -0.185533,-5.937448 -0.0517," +
                    "-2.858644 -0.145909,-5.208974 -0.209316,-5.222958 -0.06341,-0.01399 -0.974464," +
                    "-0.0493 -2.024551,-0.07845 L 23.247235,38.61921 18.831373,39.8906 C 4.9432155," +
                    "43.88916 4.2929558,44.057819 3.4954426,43.86823 2.7487826,43.690732 2.2007966," +
                    "42.916622 1.9565564,41.694305 z"
            };

			// If the squawk code is one of the international emergency codes,
			// match the info window alert color.
			if (this.squawk == 7500) {
				this.markerColor = "rgb(255, 85, 85)";
			}
			if (this.squawk == 7600) {
				this.markerColor = "rgb(0, 255, 255)";
			}
			if (this.squawk == 7700) {
				this.markerColor = "rgb(255, 255, 0)";
			}

			// If we have not overwritten color by now, an extension still could but
			// just keep on trucking.  :)

            var scale = $('#ddlMarkerScale').val();
            if(scale == 'undefined') scale = .4;
          
          	return {
                strokeWeight: (this.is_selected ? 2 : 1),
                path:  "M 0,0 "+ baseSvg["planeData"],
                scale: scale,
                fillColor: this.markerColor,
                fillOpacity: 0.9,
                anchor: new google.maps.Point(32, 32), // Set anchor to middle of plane.
                rotation: this.track
            };
		},

	// TODO: Trigger actions of a selecting a plane
	funcSelectPlane	: function(selectedPlane){
			selectPlaneByHex(this.icao);
			if(this.marker)
			{
			    if(this.marker.infoWindow) {
			        this.marker.infoWindow.setPosition(this.marker.getPosition());
                }
            }
		},
	
	
	// Update our data
	funcUpdateData	: function(data){
			// So we can find out if we moved
			var oldlat 	= this.latitude;
			var oldlon	= this.longitude;
			var oldalt	= this.altitude;

			// Update all of our data
			this.updated	= new Date().getTime();
			this.altitude	= data.altitude;
			this.speed	= data.speed;
			this.track	= data.track;
			this.latitude	= data.lat;
			this.longitude	= data.lon;
			this.flight	= data.flight;
			this.squawk	= data.squawk;
			this.icao	= data.hex;
			this.messages	= data.messages;
			this.seen	= data.seen;

			// If no packet in over 58 seconds, consider the plane reapable
			// This way we can hold it, but not show it just in case the plane comes back
			if (this.seen > 58) {
				this.reapable = true;
				if (this.marker) {
					this.marker.setMap(null);
					if(this.marker.infoWindow) this.marker.infoWindow.close();
					this.marker = null;
					
				}
				if($('#chkLinesRemain').prop('checked') != true) {
                    if (this.line) {
                        this.line.setMap(null);
                        this.line = null;
                    }
                    if (this.line2) {
                        this.line2.setMap(null);
                        this.line2 = null;
                    }
				}
				if (SelectedPlane == this.icao) {
					if (this.is_selected) {
						this.is_selected = false;
					}
					SelectedPlane = null;
				}
			} else {
				if (this.reapable == true) {
				}
				this.reapable = false;
			}

			// Is the position valid?
			if ((data.validposition == 1) && (this.reapable == false)) {
				this.vPosition = true;

				// Detech if the plane has moved
				changeLat = false;
				changeLon = false;
				changeAlt = false;
				if (oldlat != this.latitude) {
					changeLat = true;
				}
				if (oldlon != this.longitude) {
					changeLon = true;
				}
				if (oldalt != this.altitude) {
					changeAlt = true;
				}
				// Right now we only care about lat/long, if alt is updated only, oh well
				if ((changeLat == true) || (changeLon == true)) {
					this.funcAddToTrack();
					//if (this.is_selected) { /* oink */
						this.line = this.funcUpdateLines();
						this.line2 = this.funcUpdateLines2();
					//}
				}
				this.marker = this.funcUpdateMarker();
				PlanesOnMap++;
			} else {
				this.vPosition = false;
			}

			// Do we have a valid track for the plane?
			if (data.validtrack == 1)
				this.vTrack = true;
			else
				this.vTrack = false;
		},

    funcSetMarkerScale: function() {
    	this.marker.icon.scale = this.marker.icon.scale * zoom *.15;
    },
    
	// Update our marker on the map
	funcUpdateMarker: function() {
			if (this.marker) {
				this.marker.setPosition(new google.maps.LatLng(this.latitude, this.longitude));
				this.marker.setIcon(this.funcGetIcon());
		
            	this.funcSetMarkerScale();
              
				if(this.marker.infoWindow){
				    this.marker.infoWindow.setPosition(this.marker.getPosition());
				
				    var html = '';
				    
				    if(this.flight.length > 0)
				        html += 'Flight: ' + this.flight;
				    
				    if(this.altitude > 0) {
				        if(html.length > 0) html += '<br>'; 
				        html += 'Altitude: ' + this.altitude;
				    }
				    
				    if(this.speed > 0)
				        html += '<br>Speed: ' + this.speed + ' knots';
				        
				    $('#' + this.marker.icao).html(html);
                }   
			} else {
				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(this.latitude, this.longitude),
					map: GoogleMap,
					icon: this.funcGetIcon()
				});
				
				// This is so we can match icao address
				this.marker.icao = this.icao;

                this.marker.infoWindow = new google.maps.InfoWindow();
    			this.marker.infoWindow.open(GoogleMap);
    			
                var info = '<span id="' + this.marker.icao + '">Flight: ' + this.flight
                         + '<br>Altitude: ' + this.altitude + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                         + '<br>Speed: ' + this.speed + ' knots'
                         + '</span>';
            
    			this.marker.infoWindow.setContent(info);

             	// Trap clicks for this marker.
				google.maps.event.addListener(this.marker, 'click', this.funcSelectPlane);
				
                google.maps.event.addListener(GoogleMap, 'zoom_changed', function(){
                    zoom = GoogleMap.getZoom();
                });
                     
                this.funcSetMarkerScale();
                         
				$.ajax({
				    url: 'http://localhost:8080/newplane'
				});
			}

			// Setting the marker title
			if (this.flight.length == 0) {
				this.marker.setTitle(this.hex);
			} else {
				this.marker.setTitle(this.flight+' ('+this.icao+')');
			}
			return this.marker;
		},

        funcGetContrailAdj: function(){
            if($('input[name="radLines"]:checked').val() != 'contrail') return 0;
       
            var adj = this.altitude * .0000001 + (zoom * .0001);
            //console.log(this.flight + ' adj = ' + adj);
            return adj;         
        },



    // Update our planes tail line,
	// TODO: Make this multi colored based on options
	//		altitude (default) or speed
	funcUpdateLines: function() {
			var adj = this.funcGetContrailAdj();
		    
			if (this.line) {
				var path = this.line.getPath();
		    	path.push(new google.maps.LatLng(this.latitude+adj, this.longitude+adj));
			} else {
                var coords = [new google.maps.LatLng(this.latitude+adj, this.longitude+adj)];
	
	            //var icon = this.funcGetIcon();
	            
	            var color = '#000000';
	            
	            if($('input[name="radLines"]:checked').val() == 'contrail') color = '#E0F5FF';
                
				this.line = new google.maps.Polyline({
					strokeColor: color,
					strokeOpacity: 1.0,
					strokeWeight: 3,
					map: GoogleMap,
					//path: this.trackline
					//geodesic: true,
					path: coords
				});
			}
			return this.line;
		},
		
    funcUpdateLines2: function() {
        if($('input[name="radLines"]:checked').val() != 'contrail') return;
                
        var adj = this.funcGetContrailAdj();
		    
        if (this.line2) {
            var path = this.line2.getPath();
            path.push(new google.maps.LatLng(this.latitude-adj, this.longitude-adj));
        } else {
			var coords = [new google.maps.LatLng(this.latitude-adj, this.longitude-adj)];
			
            this.line2 = new google.maps.Polyline({
                strokeColor: '#E0F5FF',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: GoogleMap,
                //geodesic: true,
                //path: this.trackline
                path: coords
            });
        }
        return this.line2;
    }
};
