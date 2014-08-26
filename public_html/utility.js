$(document).ready(function(){
    getSettings();
});

function toggleSideBar(){
    var side = $('#sidebar_container');
    var sideBarWidth = side.width();

    var newSideBarWidth = 0;
     
    if(sideBarWidth > 100) {
        newSideBarWidth = 100;
    }
    else{
        newSideBarWidth = 410;
    }

    side.width(newSideBarWidth);
    var map = $('#map_container');
    var mapWidth = map.width();
    
    map.width(mapWidth + sideBarWidth - newSideBarWidth);
    
    google.maps.event.trigger(GoogleMap, "resize");
}

function showSettings(){
    getSettings();
    $("#dialog-modal").dialog("open");
}

function saveSettings(){
    
    var settings = '&radLines=' + $('input[name="radLines"]:checked').val();
    settings += '&chkCollapse=' + $('#chkCollapse').prop('checked');
    settings += '&chkSound=' + $('#chkSound').prop('checked');
    settings += '&chkInfo=' + $('#chkInfo').prop('checked');
    settings += '&chkLinesRemain=' + $('#chkLinesRemain').prop('checked');
    settings += '&ddlMarkerScale=' + $('#ddlMarkerScale').val();
    
    $.ajax({
        url: "http://localhost:8080/savesettings" + settings,
        type: "POST",
        error: function(xhr, options, err){
            alert('Failed ' + err);
        }
    });
    
    $("#dialog-modal").dialog("close");
    getSettings(); //updates ui
      
}

function getSettings(){ //todo have server return json, even better use angularjs model binding
    $.ajax({
        url: "http://localhost:8080/settings.txt",
        type: "GET",
        success: function(data, status, xhr){
            var parms = data.split('&');
            
            for(i =0; i < parms.length; i++){
                var data = parms[i];
                var kvp = data.split('=');
        
                 if(typeof(kvp[0]) != 'undefined') { 
                    if(kvp[0].substring(0,3) == 'rad') {
                        $('input[name="radLines"][value="' + kvp[1] +'"]').prop('checked', true);
                    }
                    else if(kvp[1] == 'true' || kvp[1] == 'false') {
                        if(kvp[1] == 'true') {
                            $('#' + kvp[0]).prop('checked', true);
                        }
                        else {
                            $('#' + kvp[0]).prop('checked', false);
                        }
                    }
                    else {
                        $('#' + kvp[0]).val(kvp[1]);
                    }
                }
            }
            
            if($('#chkCollapse').prop('checked')) toggleSideBar();
        },
        error: function(xhr, options, err){
            alert('Failed ' + err);
        }
    });
}
