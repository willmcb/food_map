'use strict;'

localStorage.clear();


var myMap = function(){
  this.mapStyles = [{"stylers":[{"hue":"#dd0d0d"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }]}];

  this.mapParameters = {
    center: new google.maps.LatLng(51.441668, 0.149816),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    disableDefaultUI: true,
    styles: mapStyles
    };

  this.myMap = new google.maps.Map(document.getElementById("myMap"), this.mapParameters);
};

var restaurantInfo = [
    {
      "title": "Baltizer",
      "location": {
        "lat": 51.4408712,
        "lng": 0.1501393
      },
      "rating": 3.7,
      "vicinity": "5 Mill Row, Bexley",
      "UKhygieneRatingId": 329218,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Old Bexley Greek Taverna",
      "location": {
        "lat": 51.44138,
        "lng": 0.150663
      },
      "rating": 4.6,
      "vicinity": "82 Bexley High Street, Bexley",
      "UKhygieneRatingId": 329216,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Flavours Of Morocco",
      "location": {
        "lat": 51.441753,
        "lng": 0.1501886
      },
      "rating": 4,
      "vicinity": "73 Bexley High Street, Bexley",
      "UKhygieneRatingId": 329213,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Alberello",
      "location": {
        "lat": 51.44153249999999,
        "lng": 0.1505709
      },
      "rating": 4.3,
      "vicinity": "80 High Street, Bexley",
      "UKhygieneRatingId": 329215,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "The Kings Head",
      "location": {
        "lat": 51.4417943,
        "lng": 0.1499139
      },
      "rating": 4.2,
      "vicinity": "65 Bexley High Street, Bexley",
      "UKhygieneRatingId": 329211,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "George",
      "location": {
        "lat": 51.441598,
        "lng": 0.1504081
      },
      "rating": 3.9,
      "vicinity": "74 Bexley High Street, Bexley",
      "UKhygieneRatingId": 376328,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Maharajah",
      "location": {
        "lat": 51.44139149999999,
        "lng": 0.1507516
      },
      "rating": 3.1,
      "vicinity": "84 Bexley High St, Kent",
      "UKhygieneRatingId": 329217,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Master Fryer",
      "location": {
        "lat": 51.4417722,
        "lng": 0.1504472
      },
      "vicinity": "75 Bexley High Street, Bexley",
      "UKhygieneRatingId": 329214,
      "hygieneRating": 0,
      "dateOfRating": ""
    },
    {
      "title": "Viceroy Of India",
      "location": {
        "lat": 51.4416555,
        "lng": 0.150723
      },
      "rating": 4,
      "vicinity": "77A Bexley High Street, Bexley",
      "UKhygieneRatingId": 415080,
      "hygieneRating": 0,
      "dateOfRating": ""
    }
  ];

var formattedStringForInfoWindows = function(data){
  var string = '<div class="infoWindowContentString"><div class="title">' + data.title +
      				 '</div><div class="businessType">'+ data.businessType +
       				 '</div><div class="address">'+ data.AddressLine1 + data.AddressLine2 + data.AddressLine3 + data.AddressLine4 + data.PostCode +
      				 '</div><div class="hygieneRating">'+ data.hygieneRating +'</div><div class="dateOfRating">'+ data.dateOfRating +'</div></div>';

  return string;
};

var newMarker = function(data) {
      var marker = new google.maps.Marker({
			     position: new google.maps.LatLng(data.lat, data.lng),
           animation: google.maps.Animation.DROP,
			     map: myMap,
			     title: data.name
      });
      return marker;
};

var newInfoWindow = function(data) {
   var infoWindow = new google.maps.InfoWindow(
     {
       content: data.formatStringForInfoWindows
     });
	 return infoWindow;
};

var shouldMarkerBeVisible = function(data) {
    if(data.visible() === true) {
  			data.restaurantMarker.setMap(myMap);
  		} else {
  			data.restaurantMarker.setMap(null);
  		}
  		//return true;
  	};



var restaurantObject = function(data) {
    var self = this;
    var frontOfUKhygieneAPI_URL = "http://api.ratings.food.gov.uk/Establishments/";

    self.visible = ko.observable(true);

    self.title = data.title;
    self.businessType = "";
    self.UKhygieneRatingId = data.UKhygieneRatingId;
    self.lat = data.location.lat;
    self.lng = data.location.lng;
    self.hygieneRating = "";
    self.AddressLine1 = "";
    self.AddressLine2 = "";
    self.AddressLine3 = "";
    self.AddressLine4 = "";
    self.PostCode = "";
    self.dateOfRating = "";


    var fullURL = frontOfUKhygieneAPI_URL + self.UKhygieneRatingId;

    $.ajax({
      url: fullURL,
      type:'GET',
      dataType: 'json',
      crossDomain : true,
      beforeSend: function (request) {
             request.setRequestHeader("x-api-version", 2);
         },

      success: function(returnedData) {
        console.log('API has fired');
        self.hygieneRating = returnedData.RatingValue;
        self.AddressLine1 = returnedData.AddressLine1;
        self.AddressLine2 = returnedData.AddressLine2;
        self.AddressLine3 = returnedData.AddressLine3;
        self.AddressLine4 = returnedData.AddressLine4;
        self.PostCode = returnedData.PostCode;
        self.dateOfRating = returnedData.RatingDate;
        self.businessType = returnedData.BusinessType;
        },
      });

      setTimeout(function(){
      self.FormattedStringForInfoWindow = formattedStringForInfoWindows(self);

      self.restaurantMarker = newMarker(self);

      self.shouldMarkerBeVisible = shouldMarkerBeVisible(self);

      console.log("Markers are on map");
      }, 800);
    };

var setRestaurantLocations = function(restaurantInfo, data) {
    restaurantInfo.forEach(function(restuarant){
    data.restaurantLocations().push(new restaurantObject(restuarant));
  });

};

var neighbourHoodMapVeiwModel = function(){
    var self = this;

    self.starRatings = [
            { starRatingName: "Please Select a star rating", numericValue: null},
            { starRatingName: "Zero Stars", numericValue: 0 },
            { starRatingName: "One Star", numericValue: 1 },
            { starRatingName: "Two Stars", numericValue: 2  },
            { starRatingName: "Three Stars", numericValue: 3  },
            { starRatingName: "Four Stars", numericValue: 4  },
            { starRatingName: "Five Stars", numericValue: 5  }
        ];

    self.restaurantLocations = ko.observableArray();

    self.setRestaurantLocations = ko.computed(function(){
      setRestaurantLocations(restaurantInfo, self);
    });

    console.log("These are restaurant locations: ", self.restaurantLocations());

    self.selectedHygieneRating = function(data){
               numericValue: ko.observable(data.numericValue);
            };

  };
setTimeout(function(){
  ko.applyBindings(new neighbourHoodMapVeiwModel);
}, 2000);
