// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();

import dataLoad from '../sources/data/locations.json';

var locations = dataLoad.locations;

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
    minZoom: 3,
    maxNativeZoom: 12,
    maxZoom: 4,
    center: [0, 0],
    zoom: 6,
    cursor: true,
    crs: L.CRS.Simple,
    zoomControl: false
  });

//image options
  var w = 1460,
      h = 230,
      url = './assets/images/panorama_test3.jpg';

  var southWest = map.unproject([0, h], map.getMaxZoom()-1);
  var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
  var bounds = new L.LatLngBounds(southWest, northEast);

  L.imageOverlay(url, bounds).addTo(map);

  map.scrollWheelZoom.disable()
  map.setMaxBounds(bounds);

  // icon initialization
  var greenIcon = L.icon({
	   iconUrl: './assets/images/1x/green.png',
	   shadowUrl: './assets/images/1x/shadow.png',

	   iconSize:     [10, 10], // size of the icon
	   shadowSize:   [1, 1], // size of the shadow
     iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
	   shadowAnchor: [0, 0],  // the same for the shadow
	   popupAnchor:  [5,0] // point from which the popup should open relative to the iconAnchor
  });

  var orangeIcon = L.icon({
	   iconUrl: './assets/images/1x/orange.png',
	   shadowUrl: './assets/images/1x/shadow.png',

	   iconSize:     [10, 10], // size of the icon
	   shadowSize:   [1, 1], // size of the shadow
     iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
	   shadowAnchor: [0, 0],  // the same for the shadow
	   popupAnchor:  [5,0] // point from which the popup should open relative to the iconAnchor
  });

  var blueIcon = L.icon({
	   iconUrl: './assets/images/1x/blue.png',
	   shadowUrl: './assets/images/1x/shadow.png',

	   iconSize:     [10, 10], // size of the icon
	   shadowSize:   [1, 1], // size of the shadow
     iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
	   shadowAnchor: [0, 0],  // the same for the shadow
	   popupAnchor:  [5,0] // point from which the popup should open relative to the iconAnchor
  });

  var marker;

// register locations on map
// we should look into adding a marker on click so that people know what they're adding
  map.on('click', function(e) {



    var popLocation = e.latlng;

    $("#xC").attr("value",popLocation.lat);
    $("#yC").attr("value",popLocation.lng);

    $("#sidebarContent").attr('style', 'display:none');
    $('#form').attr('style', 'display:block');

    if (marker) {
      map.removeLayer(marker);
    }
    marker = new L.Marker(e.latlng, {icon: blueIcon}).addTo(map);

    sidebar.show();
    $('.strib-styles.ssa.ssb.ssc .leaflet-container a.close').attr('style', 'display:none');


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
      var thisThing = $(this).parent();
    x.preventDefault();
    var jqxhr = $.ajax({
      url: 'https://script.google.com/macros/s/AKfycbxvOIFKfULZyWdztfhh303O5WuBtZEsrvAspTwQ19THfHK8MGc/exec',
      method: "GET",
      dataType: "json",
      data: thisThing.serializeObject()
    });

    $("#nC").attr("value","");
    $("#dC").attr("value","");
    $("#nC").val("");
    $("#dC").val("");
    $("#xC").attr("value","");
    $("#yC").attr("value","");

    x.stopPropagation();
  });

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

var zoom = new L.control.zoom({
  position:'bottomright'
}).addTo(map);

//navigation buttons
// $("#navigation").on("click", function(){
//     zoomTo(-17.10706, 114.23438, 7);
// });
//
// $("#reset").on("click", function(){
//     map.setView([0, 0], 3);
// });
//
// $("#in").on("click", function(){
//     map.setZoom(map.getZoom() + 1);
// });
//
// $("#out").on("click", function(){
//     map.setZoom(map.getZoom() - 1);
// });
//
$("#add").on("click", function(){
    sidebar.toggle();
});

// POIs plus Map toggle control

// var test1 = L.marker([-7.786376953, 137.9375], {icon: greenIcon})
// var test2 = L.marker([-14.72387695, 64.5], {icon: greenIcon})
// var test3 = L.marker([-16.90362549, 106.1328125], {icon: orangeIcon})
// var test4 = L.marker([-16.83068848, 34.234375], {icon: orangeIcon})
//
// var testarray = [test1, test2, test3, test4];

// extend the leaflet marker class to include both a name and a description
L.Marker.Custom = L.Marker.extend({
  options: {
    name: '',
    description: ''
  }
});

// mass populate expert points onto photo
var expert_points = [];
for (var i = 0; i < locations.length; i++) {
  var x = locations[i].x;
  var y = locations[i].y;
  var loc_name = locations[i].name;
  var desc = locations[i].description;
  expert_points.push(new L.Marker.Custom([x,y], {icon: greenIcon, name: loc_name, description: desc}));
}

var experts = L.featureGroup(expert_points).on("click", function(event) {
  var source = event.sourceTarget;
  $("#form").attr('style', 'display:none');
  $('#sidebarContent').attr('style', 'display:block');
  $('#sidebarContent #locationName').append(source.options.name);
  $('#sidebarContent #locationDesc').append(source.options.description);
  $('.strib-styles.ssa.ssb.ssc .leaflet-container a.close').attr('style', 'display:none');
  sidebar.show();

})
.addTo(map);


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
  }
});

$('button.cancel').on('click', function() {
  sidebar.hide();
});

function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.val = '';
    this.index = -1;
    this.initEvents();
}
DropDown.prototype = {
    initEvents: function() {
        var obj = this;

        obj.dd.on('click', function(event) {
            $(this).toggleClass('active');
            return false;
        });

        obj.opts.on('click', function() {
            var opt = $(this);
            obj.val = opt.text();
            obj.index = opt.index();
            obj.placeholder.text(obj.val);
        });
    },
    getValue: function() {
        return this.val;
    },
    getIndex: function() {
        return this.index;
    }
}

$("#test-1").on("click", function() {
  sidebar.hide();
  map.flyTo([-7.786, 137.9375], 6);
});

$("#test-2").on("click", function() {
  sidebar.hide();
  map.flyTo([-14.72387695, 64.5], 6);
});

$("leaflet-marker-icon").on("click", function() {
  sidebar.toggle();
})

$(function() {

    var dd = new DropDown($('#dd'));
    var dd2 = new DropDown($('#ddY'));

    $(document).click(function() {
        // all dropdowns
        $('.wrapper-dropdown-1').removeClass('active');
    });

});
