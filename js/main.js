//initalising the map
var map;
//var markers = [];
var mapStyles = [{"stylers":[{"hue":"#dd0d0d"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}];

function initMap() {
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: mapStyles,
    mapTypeControl: false
  });
  self.markers = [];

  self.restaurantLocations = [
      {name: 'Park Ave Penthouse', locationPosition: {lat: 40.7713024, lng: -73.9632393}},
      {name: 'Chelsea Loft', locationPosition: {lat: 40.7444883, lng: -73.9949465}},
      {name: 'Union Square Open Floor Plan', locationPosition: {lat: 40.7347062, lng: -73.9895759}},
      {name: 'East Village Hip Studio', locationPosition: {lat: 40.7281777, lng: -73.984377}},
      {name: 'TriBeCa Artsy Bachelor Pad', locationPosition: {lat: 40.7195264, lng: -74.0089934}},
      {name: 'Chinatown Homey Space', locationPosition: {lat: 40.7180628, lng: -73.9961237}}
    ];


    var markerPosition = null;
    var markerName = null;

    for (var i = 0; i < self.restaurantLocations.length; i++) {
      markerPosition = self.restaurantLocations[i].locationPosition;
      markerName = self.restaurantLocations[i].name;

      // new maker object i
      var marker = new google.maps.Marker({
        position: markerPosition,
        title: markerName,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // push each marker into markers array
      self.markers.push(marker);

      //extends the map 'bounds' with each location property of each marker on the map.
      self.bounds.extend(marker.position);

      // info windows don't open automatically
      // hence the event listener
      marker.addListener('click', function() { populateInfoWindow(this, self.largeInfowindow);});

      // method to populate the info windows
      self.populateInfoWindow = function(marker, infowindow) {
        // makes sure that infowindow is not already open on this marker
        if(infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>' + '<br />' + '<div>' + marker.position + '</div>');
          infowindow.open(map, marker);
          infowindow.addListener('closeclick', function() {infowindow.setMarker(null);});
        }
      };
      // initialize info window.
      self.largeInfowindow = new google.maps.InfoWindow();

      //bounds property which ajusts the screen size to capture all of the markers

      self.bounds = new google.maps.LatLngBounds();



      self.showListings = function() {

        //bounds variable which ajusts the screen size to capture all of the markers
        //var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < self.markers.length; i++) {
          self.markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        //tells map to fit itself to the values in 'bounds' object
        map.fitBounds(self.bounds);
      }

      self.hideListings = function (){
        for (var i = 0; i < self.markers.length; i++) {
          self.markers[i].setMap(null);
          self.markers[i].setAnimation(null);
        }
      }

      document.getElementById("show-listings").addEventListener('click', showListings);
      document.getElementById("hide-listings").addEventListener('click', hideListings);

  };


};

function mapViewModel(){

      }





console.log(mapViewModel.markers);
//ko.applyBindings(new mapViewModel())
