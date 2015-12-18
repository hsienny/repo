// Load Google Maps Javascript API with a callback that calls search()
var ready = function(fn) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&'+'libraries=places&'+'callback=' + fn;
  document.body.appendChild(script);
};

var containerDiv = document.getElementById('postco');
var imageUrl = "http://www.postco.com.my/public/postco-map-pin.png";
var map;

var image = {
  url: imageUrl,
  scaledSize = new google.maps.Size(27, 36)
};

var addMarkersFromArray = function(markersArray, map) {
  for (i = 0; i < markersArray.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(markersArray[i][0], markersArray[i][1]),
      map: map,
      // icon: image
    });
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function() {
        infowindow.setContent(markersArray[i][2]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
};

var init = function() {
  // Create search box ("#searchBox") and map ("#map") within containerDiv
  $(containerDiv).append("<div id='searchBox'></div>");
  $(containerDiv).append("<div id='map'></div>");

  var searchBoxElement = document.getElementById('searchBox');
  var mapElement = document.getElementById('map');
  var center = new google.maps.LatLng(3.134109, 101.686671);
  var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f4d2c5"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#f4f4f4"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}];
  var url = "/agents/widget"

  // Load the map within #map
  map = new google.maps.Map(mapElement, {
    center: center,
    styles: styles,
    scrollwheel: false,
    zoom: 12
  });

  // Load the search box within #searchBox
  var searchBox = new google.maps.places.SearchBox(searchBoxElement);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
          return;
      }
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
          if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
          } else {
              bounds.extend(place.geometry.location);
          }
      });
      map.fitBounds(bounds);
  });

  // Make an AJAX request to the server
  $.ajax({
    type: "POST",
    url: url,
    // Add markers
    success: function(d, t, j) { addMarkersFromArray(d, map); }
  });
};

// On page reload/first load
$(document).ready(function() {
  ready("init");
});

// When page is loaded via turbolinks
$(document).on('page:load', function() {
  init();
});