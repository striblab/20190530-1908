// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();

import dataLoad from '../sources/data/locations.json';

// THIS WILL BE THE JSON FILE HOLDING READER POINTS
import test_data from '../sources/data/test_data.json';

var locations = dataLoad.locations;
var test = test_data.data;

//leaflet map stuff
L.Map.addInitHook('addHandler', 'cursor', L.CursorHandler);

L.Control.Loader = L.Control.extend({
    options: {
    },

    onAdd: function (map) {
        this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');


        this.loaderContainer = L.DomUtil.create('div', 'leaflet-loader-container', this._map._container);
        this.loaderBG = L.DomUtil.create('div', 'leaflet-loader-background', this.loaderContainer);
        this.loader = L.DomUtil.create('div', 'leaflet-loader', this.loaderBG);
        for (var i=0; i<3; i++) {
            L.DomUtil.create('div', '', this.loader);
        }

        this._map.dragging.disable();
        this._map.touchZoom.disable();
        this._map.doubleClickZoom.disable();
        this._map.scrollWheelZoom.disable();

        return this.container;
    },
    hide: function () {
        this.loaderBG.style.animation ="hideLoader 1s";
        this.loaderBG.style.webkitAnimationName ="hideLoader 1s";
        this.loaderBG.style.opacity ="0";

        var _this =this;
        setTimeout(function (){_this.loaderContainer.style.display ="none";},500);
        this._map.dragging.enable();
        this._map.touchZoom.enable();
        this._map.doubleClickZoom.enable();
        this._map.scrollWheelZoom.enable();
    }
});

L.control.loader = function(options) {
  var newControl = new L.Control.Loader(options);
  return newControl;
};

// map options
var map = L.map('image-map', {
    minZoom: 4,
    maxNativeZoom: 12,
    maxZoom: 4,
    center: [0, 0],
    zoom: 7,
    cursor: true,
    crs: L.CRS.Simple,
    zoomControl: false
  });

//image options
  var w = 1460,
      h = 230.461,
      url = 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/panorama_cropped.jpg';

  var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
  var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
  var bounds = new L.LatLngBounds(southWest, northEast).pad(.05);

  L.imageOverlay(url, bounds).addTo(map);

  map.scrollWheelZoom.disable()
  map.setMaxBounds(bounds);

  // icon initialization
  var greenIcon = L.icon({
	   iconUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/green.png',
	   shadowUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/shadow.png',

	   iconSize:     [25, 25],
	   shadowSize:   [1, 1],
     iconAnchor:   [12.5, 25],
	   shadowAnchor: [0, 0],
	   popupAnchor:  [5,0]
  });

  var orangeIcon = L.icon({
	   iconUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/reader.png',
	   shadowUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/shadow.png',

	   iconSize:     [25, 25],
	   shadowSize:   [1, 1],
     iconAnchor:   [12.5, 25],
	   shadowAnchor: [0, 0],
	   popupAnchor:  [5,0]
  });

  var userMarker = L.icon({
	   iconUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/smallorange.png',
	   shadowUrl: 'https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/shadow.png',

	   iconSize:     [40, 40],
	   shadowSize:   [1, 1],
     iconAnchor:   [20, 20],
	   shadowAnchor: [0, 0],
	   popupAnchor:  [5,0]
  });

  var marker;

  map.on('mouseover', function() {
    $('#image-map').css('cursor', 'url(https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/newmouse.png) 20 20, auto')
  });

  map.on('drag', function() {
    $('#image-map').css('cursor', 'move')
  });

  map.on('mousedown', function() {
    $('#image-map').css('cursor', 'url(https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/smallorange.png) 20 20, auto')
  });


  map.on('mouseup', function() {
    $('#image-map').css('cursor', 'url(https://static.startribune.com/news/projects/all/20190530-1908/assets/images/1x/newmouse.png) 20 20, auto')
  });


// register locations on map
  map.on('click', function(e) {

    var popLocation = e.latlng;

    $("#xC").attr("value",popLocation.lat);
    $("#yC").attr("value",popLocation.lng);

    $("#sidebarContent").attr('style', 'display:none');
    $('#form').attr('style', 'display:block');
    $('#completeForm').attr('style', 'display:none');

    if (marker) {
      map.removeLayer(marker);
    }
    marker = new L.Marker(e.latlng, {icon: userMarker}).addTo(map);

    sidebar.show();
    $('.strib-styles.ssa.ssb.ssc .leaflet-container a.close').attr('style', 'display:none');

});

  map.options.maxZoom = 8;

function zoomTo(lat, long, zoom) {
    map.flyTo([lat, long], zoom);
}

var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
        });
        map.addControl(sidebar);

var miniMapOptions = {
  crs: L.CRS.Simple,
  minZoom: 2,
  maxZoom: 4,
  maxBoundsViscosity: 1.0
}

var mmLayer = L.imageOverlay(url, bounds)

var miniMap = new L.Control.MiniMap(mmLayer, {
  width: 500,
  height: 100,
  mapOptions: miniMapOptions
}).addTo(map);

$("#buttons #in").on("click", function(){
    map.setZoom(map.getZoom() + 1);
});

$("#buttons #out").on("click", function(){
    map.setZoom(map.getZoom() - 1);
});

L.Marker.Custom = L.Marker.extend({
  options: {
    name: '',
    description: '',
    lat: 0,
    long: 0
  }
});

// mass populate expert points onto photo
var expert_points = [];
for (var i = 0; i < locations.length; i++) {
  var x = locations[i].x;
  var y = locations[i].y;
  var loc_name = locations[i].name;
  var desc = locations[i].description;
  expert_points.push(new L.Marker.Custom([x,y], {icon: greenIcon, name: loc_name, description: desc, lat: x, long: y}));
}

// loop to create array of reader objects

var reader_points = [];
for (var i = 0; i < test.length; i++) {
  var x = test[i].x2;
  var y = test[i].y2;
  var loc_name = test[i].name;
  var desc = test[i].description;
  reader_points.push(new L.Marker.Custom([x,y], {icon: orangeIcon, name: loc_name, description: desc, lat: x, long: y}));
}

var readers = L.featureGroup(reader_points).on("click", function(event) {
  var source = event.sourceTarget;

  if (marker) {
    map.removeLayer(marker);
  }

  $("#form").attr('style', 'display:none');
  $('#completeForm').attr('style', 'display:none');
  $('#sidebarContent').attr('style', 'display:block');
  $('#sidebarContent #locationName').empty();
  $('#sidebarContent #locationDesc').empty();
  $('#sidebarContent #locationName').append(source.options.name);
  $('#sidebarContent #locationDesc').append(source.options.description);
  $('.strib-styles.ssa.ssb.ssc .leaflet-container a.close').attr('style', 'display:none');

  map.flyTo([source.options.lat, source.options.long], 7);
  sidebar.show();

})
.addTo(map);

var experts = L.featureGroup(expert_points).on("click", function(event) {
  var source = event.sourceTarget;

  if (marker) {
    map.removeLayer(marker);
  }

  $("#form").attr('style', 'display:none');
  $('#completeForm').attr('style', 'display:none');
  $('#sidebarContent').attr('style', 'display:block');
  $('#sidebarContent #locationName').empty();
  $('#sidebarContent #locationDesc').empty();
  $('#sidebarContent #locationName').append(source.options.name);
  $('#sidebarContent #locationDesc').append(source.options.description);
  $('.strib-styles.ssa.ssb.ssc .leaflet-container a.close').attr('style', 'display:none');

  map.flyTo([source.options.lat, source.options.long], 7);
  sidebar.show();

})
.addTo(map);


// button functionality
$("#experts").on("click", function() {
  map.removeLayer(group2);
  group1.addTo(map);
});

$("#readers").on("click", function() {
  map.removeLayer(group1);
  group2.addTo(map);
});

$("button#cancel").on("click", function() {
  if (marker) {
    map.removeLayer(marker);
    sidebar.hide();
    $(this).closest('form').find("input[type=text], textarea").val("");
    $('#dC').css('border', '1px solid #bebebe');
    $('#nC').css('border', '1px solid #bebebe');
    $('#form form #descError').hide();
    $('#form form #locationError').hide();
  }
});

  //form handling
  $.fn.serializeObject = function()
  {
     var o = {};
     var a = this.serializeArray();
     $.each(a, function() {
         if (o[this.name]) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
  };

  $('.submit-form').on('click', function(x) {

    if ($('#nC').val() == '' || $('#dC').val() == '') {
      if ($('#nC').val() == '') {
        $('#nC').css('border', '1px solid red');
        $('#locationError').css('display', 'block');
      }
      else if ($('#nC').val()) {
        $('#nC').css('border', '1px solid #bebebe');
        $('#locationError').css('display', 'none');
      }

      if ($('#dC').val() == '') {
        $('#dC').css('border', '1px solid red');
        $('#descError').css('display', 'block');
      }
      else {
        $('#dC').css('border', '1px solid #bebebe');
        $('#descError').css('display', 'none');
      }
    }
    else {

    var thisThing = $(this).parent();

    console.log(thisThing.serializeObject());

    x.preventDefault();
    var jqxhr = $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxvOIFKfULZyWdztfhh303O5WuBtZEsrvAspTwQ19THfHK8MGc/exec',
      method: "GET",
      dataType: "json",
      data: thisThing.serializeObject()
    })

    $("#nC").attr("value","");
    $("#dC").attr("value","");
    $("#nC").val("");
    $("#dC").val("");
    $("#xC").attr("value","");
    $("#yC").attr("value","");

    x.stopPropagation();

    if (marker) {
      map.removeLayer(marker);
    }

    $("#sidebarContent").attr('style', 'display:none');
    $('#form').attr('style', 'display:none');
    $('#completeForm').attr('style', 'display:block');

    $('#dC').css('border', '1px solid #bebebe');
    $('#nC').css('border', '1px solid #bebebe');
    $('#descError').css('display', 'none');
    $('#locationError').css('display', 'none');

    $(this).closest('form').find("input[type=text], textarea").val("");

  }
});

$('button.cancel').on('click', function() {
  sidebar.hide();
  map.flyTo([-15.783635053489071, 80.45312462904491], 4);
});

$('#all').on('click', function() {
  map.removeLayer(readers);
  map.removeLayer(experts);
  map.addLayer(readers);
  map.addLayer(experts);
});

$('#reader').on('click', function() {
  map.removeLayer(readers);
  map.removeLayer(experts);
  map.addLayer(readers);
});

$('#staff').on('click', function() {
  map.removeLayer(readers);
  map.removeLayer(experts);
  map.addLayer(experts);
});

var acc = document.getElementsByClassName("accordion");
var panel = document.getElementsByClassName('panel');

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
        var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panel, 'show', 'remove');

        if (setClasses) {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
}

function setClass(els, className, fnName) {
    for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
    }
}
