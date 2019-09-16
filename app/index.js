/**
 * Main JS file for project.
 */

/**
 * Define globals that are added through the js.globals in
 * the config.json file, here, mostly so linting won't get triggered
 * and its a good queue of what is available:
 */
// /* global $, _ */

// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();

/**
 * Adding dependencies
 * ---------------------------------
 * Import local ES6 or CommonJS modules like this:
 * import utilsFn from './shared/utils.js';
 *
 * Or import libraries installed with npm like this:
 * import module from 'module';
 */


/**
 * Adding Svelte templates in the client
 * ---------------------------------
 * We can bring in the same Svelte templates that we use
 * to render the HTML into the client for interactivity.  The key
 * part is that we need to have similar data.
 *
 * First, import the template.  This is the main one, and will
 * include any other templates used in the project.
 *
 *   `import Content from '../templates/_index-content.svelte.html';`
 *
 * Get the data parts that are needed.  There are two ways to do this.
 * If you are using the buildData function to get data, then add make
 * sure the config for your data has a `local: "content.json"` property
 *
 *  1. For smaller datasets, just import them like other files.
 *     `import content from '../assets/data/content.json';`
 *  2. For larger data points, utilize window.fetch.
 *     `let content = await (await window.fetch('../assets/data/content.json')).json();`
 *
 * Once you have your data, use it like a Svelte component:
 *
 * const app = new Content({
 *  target: document.querySelector('.article-lcd-body-content'),
 *  hydrate: true,
 *  data: {
 *    content
 *  }
 * });
 */



// Common code to get svelte template loaded on the client and hack-ishly
// handle sharing
//
// import Content from '../templates/_index-content.svelte.html
//
// $(document).ready(() => {
//   // Hack to get share back
//   let $share = $('.share-placeholder').size()
//     ? $('.share-placeholder')
//       .children()
//       .detach()
//     : undefined;
//   let attachShare = !$share
//     ? undefined
//     : () => {
//       $('.share-placeholder').append($share);
//     };

//   // Main component
//   const app = new Content({
//     target: document.querySelector('.article-lcd-body-content'),
//     hydrate: true,
//     data: {
//       attachShare
//     }
//   });
// });

import dataLoad from '../sources/data/locations.json';

var locations = dataLoad.locations;

for (var i=0; i < locations.length; i++) {
    $("#switches").append("<li class='switch' x='" + locations[i].x + "' y='" + locations[i].y + "'>" + locations[i].name + "</li>");
}


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

var map = L.map('image-map', {
    minZoom: 3,
    maxNativeZoom: 12,
    maxZoom: 4,
    center: [0, 0],
    zoom: 3,
    cursor: true,
    crs: L.CRS.Simple
  });

  var w = 1460,
      h = 230,
      url = './assets/images/panorama_test3.jpg';

  var southWest = map.unproject([0, h], map.getMaxZoom()-1);
  var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
  var bounds = new L.LatLngBounds(southWest, northEast);

  L.imageOverlay(url, bounds).addTo(map);

  // var sidebar = L.Control.Sidebar('sidebar', {
  //           closeButton: true,
  //           position: 'left'
  //       });
  // map.addControl(sidebar);


  // map.scrollWheelZoom.disable()
  map.setMaxBounds(bounds);

  var greenIcon = L.icon({
	iconUrl: './assets/images/leaf-green.png',
	shadowUrl: './assets/images/leaf-shadow.png',

	iconSize:     [15, 15], // size of the icon
	shadowSize:   [1, 1], // size of the shadow
	iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
	shadowAnchor: [0, 0],  // the same for the shadow
	popupAnchor:  [7.5,0] // point from which the popup should open relative to the iconAnchor
});

  map.on('click', function(e) {
    var popLocation = e.latlng;

    $("#xC").attr("value",popLocation.lat);
    $("#yC").attr("value",popLocation.lng);


    // var popup = L.popup()
    // .setLatLng(popLocation)
    // .setContent(form)
    // .openOn(map);

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

  var newMarker = new L.marker(e.latlng, {icon: greenIcon}).addTo(map);

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

var test = L.marker([-13.62, 76.37], {icon: greenIcon}).bindPopup('this is a test').addTo(map);
var test2 = L.marker([-20.876953125, 157.75], {icon: greenIcon}).bindPopup('this is another test').addTo(map);

var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
        });
        map.addControl(sidebar);

        // setTimeout(function () {
        //     sidebar.show();
        // }, 500);

        // sidebar.on('show', function () {
        //     console.log('Sidebar will be visible.');
        // });
        //
        // sidebar.on('shown', function () {
        //     console.log('Sidebar is visible.');
        // });
        //
        // sidebar.on('hide', function () {
        //     console.log('Sidebar will be hidden.');
        // });
        //
        // sidebar.on('hidden', function () {
        //     console.log('Sidebar is hidden.');
        // });

        L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
            console.log('Close button clicked.');
        });


//navigation buttons
// $("#navigation").on("click", function(){
//     zoomTo(-17.10706, 114.23438, 7);
// });

$("#reset").on("click", function(){
    map.setView([0, 0], 3);
});

$("#in").on("click", function(){
    map.setZoom(map.getZoom() + 1);
});

$("#out").on("click", function(){
    map.setZoom(map.getZoom() - 1);
});

$("#add").on("click", function(){
    sidebar.toggle();
});

$(".switch").on("click", function(){
    var thisSwitch = $(this);
    console.log(thisSwitch.text());
    zoomTo(thisSwitch.attr('x'),thisSwitch.attr('y'), 7);
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

$(function() {

    var dd = new DropDown($('#dd'));
    var dd2 = new DropDown($('#ddY'));

    $(document).click(function() {
        // all dropdowns
        $('.wrapper-dropdown-1').removeClass('active');
    });

});
