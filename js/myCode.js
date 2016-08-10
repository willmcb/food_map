//initalising the map
var map;
var markers = [];
var styles = [{"stylers":[{"hue":"#dd0d0d"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
  ];

  // initialize info window.
  var largeInfowindow = new google.maps.InfoWindow();

  //bounds variable which ajusts the screen size to capture all of the markers

  var bounds = new google.maps.LatLngBounds();

  //loop through locations array and create new marker object with parameters assigned to each value
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;

    // new maker object i
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // push each marker into markers array
    markers.push(marker);

    //extends the map 'bounds' with each location property of each marker on the map.
    bounds.extend(marker.position);

    // info windows don't open automatically
    // hence the event listener
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }

  // function to populate the info windows
  function populateInfoWindow(marker, infowindow) {
    // makes sure that infowindow is not already open on this marker
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>' + '<br />' + '<div>' + marker.position + '</div>');
      infowindow.open(map, marker);

      infowindow.addListener('closeclick', function(){
          infowindow.setMarker(null);
      });

      var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.


    }
  }
  function showListings() {

    //bounds variable which ajusts the screen size to capture all of the markers
    //var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    //tells map to fit itself to the values in 'bounds' object
    map.fitBounds(bounds);
  }

  function hideListings(){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      markers[i].setAnimation(null);
    }
  }

  document.getElementById("show-listings").addEventListener('click', showListings);
  document.getElementById("hide-listings").addEventListener('click', hideListings);

}
