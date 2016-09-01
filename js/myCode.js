// Google maps event listener to initialize map
// on page load.
// http://localhost:8000/index.html
//  cd /Users/W_McBrien/Desktop/programming/udacity/assessed_projects/"Project 6 - Neighbourhood Map"


function initMap(){

  var mapParameters = {
    center: new google.maps.LatLng(51.441668, 0.149816),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false
    };

  var myMap = new google.maps.Map(document.getElementById("myMap"), mapParameters);

  google.maps.event.addDomListener(window, 'load', initMap);
}

function restaurantListViewRow(resturantObject) {
    // var self = this;
    // self.name = name;
    // self.meal = ko.observable(initialMeal);
}

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
      "hygieneRating": 0
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
      "hygieneRating": 0
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
      "hygieneRating": 0
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
      "hygieneRating": 0
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
      "hygieneRating": 0
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
      "hygieneRating": 0
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
      "hygieneRating": 0
    },
    {
      "title": "Master Fryer",
      "location": {
        "lat": 51.4417722,
        "lng": 0.1504472
      },
      "vicinity": "75 Bexley High Street, Bexley",
      "UKhygieneRatingId": 329214,
      "hygieneRating": 0
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
      "hygieneRating": 0
    }
  ]

var getHygieneDataFromUKFSAandReturnArray = function(restaurantInfo){
  var frontOfUKhygieneAPI_URL = "http://api.ratings.food.gov.uk/Establishments/";
  var hygieneDataArray = []
  var addHygieneDataToArray = function(restaurantTitle, restaurantId, restaurantHygieneRating, lat, lng, dateOfRating, array) {
      array.push({ title: restaurantTitle, id: restaurantId, hygieneRating: restaurantHygieneRating, location:{
        lat: lat,
        lng: lng
      }, dateOfRating: dateOfRating});
  }

  // for loop calls the UK Food Standards Agency (FSA) api once for each restaurant in
  // the restaurantsInfo array using each restaurant's unique FSA id number as
  // a reference
  for(var i = 0; i < restaurantInfo.length; i++) {
      var hygieneId = restaurantInfo[i].UKhygieneRatingId;
      var fullURL = frontOfUKhygieneAPI_URL + hygieneId;
      var hold = 0;
      $.ajax({
        url: fullURL,
        type:'GET',
        dataType: 'json',
        crossDomain : true,
        beforeSend: function (request) {
               request.setRequestHeader("x-api-version", 2);
           },

        success: function(data) {
          console.log("api call successful");

          // success function calls addHygieneDataToArray for each iteration of the loop
          addHygieneDataToArray(data.BusinessName, data.FHRSID, data.RatingValue,data.geocode.longitude,data.geocode.latitude,data.RatingDate, hygieneDataArray);

          },
        });
    }
    //function returns the hygieneDataArray with info on each restaurant.
    return hygieneDataArray;
};

var hygieneDataArray = getHygieneDataFromUKFSAandReturnArray(restaurantInfo);



function neighbourHoodMapVeiwModel(restaurantInfo) {

  var self = this;

  self.selectedHygieneRating = ko.observable();



  self.restaurantInfo = restaurantInfo;

  self.listOfRestaurants = ko.observableArray();

  console.log("this is in the knocockout function: ", self.restaurantInfo);
  self.starRatings = [
        { starRatingName: "Please Select a star rating", numericValue: null},
        { starRatingName: "Zero Stars", numericValue: 0 },
        { starRatingName: "One Star", numericValue: 1 },
        { starRatingName: "Two Stars", numericValue: 2  },
        { starRatingName: "Three Stars", numericValue: 3  },
        { starRatingName: "Four Stars", numericValue: 4  },
        { starRatingName: "Five Stars", numericValue: 5  }
    ];

  self.restaurantListItemDropDown = function(title, hygieneRating, lat, lng, vicinity) {
      var self = this;
      self.title = title;
      self.hyigeneRating = hygieneRating;
      self.lat = lat;
      self.lng = lng;
      self.vicinity = vicinity;
    };

  self.initalLoadOfRestaurants = function(){
    for(var i = 0; i < this.restaurantInfo.length; i++) {
      self.listOfRestaurants.push(new self.restaurantListItemDropDown(self.restaurantInfo[i].title, self.restaurantInfo[i].rating, self.restaurantInfo[i].location.lat, self.restaurantInfo[i].location.lng, self.restaurantInfo[i].vicinity));
    }
  };

  self.filterRestrautantsBasedOnSelectedHyigeneRating = ko.computed(function(){
        self.listOfRestaurants.remove(function(item){
            return item.hygieneRating !== self.selectedHygieneRating.numericValue()});
        });



self.initalLoadOfRestaurants();




console.log("This is the list of restaurants: ", this.listOfRestaurants);
}






ko.applyBindings(new neighbourHoodMapVeiwModel(restaurantInfo));
