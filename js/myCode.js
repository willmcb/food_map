// Google maps event listener to initialize map
// on page load.
// http://localhost:8000/index.html
//  cd /Users/W_McBrien/Desktop/programming/udacity/assessed_projects/"Project 6 - Neighbourhood Map"

// function to initialze map.
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
}

//google.maps.event.addDomListener(window, 'load', myMap);



var neighbourHoodMapVeiwModel = function(){
  var self = this;


  // hard coded location data
  self.restaurantInfo = [
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
    ]

  // array to hold values for drop-down selector.
  self.starRatings = [
          { starRatingName: "Please Select a star rating", numericValue: null},
          { starRatingName: "Zero Stars", numericValue: 0 },
          { starRatingName: "One Star", numericValue: 1 },
          { starRatingName: "Two Stars", numericValue: 2  },
          { starRatingName: "Three Stars", numericValue: 3  },
          { starRatingName: "Four Stars", numericValue: 4  },
          { starRatingName: "Five Stars", numericValue: 5  }
      ];

  // getting data from third party api and incoporating it into the model.
  self.getHygieneDataFromUKFSAandReturnArray = function(restaurantInfo){
      // variables to hold the url and other AJAX info.
      var frontOfUKhygieneAPI_URL = "http://api.ratings.food.gov.uk/Establishments/";
      var hygieneDataArray = []

      //callback function to handle data returned from server
      var addHygieneDataToArray = function(data, array) {
          array.push({
            title: data.BusinessName,
            id: data.FHRSID,
            hygieneRating: data.RatingValue,
            dateOfRating: data.RatingDate
        });
      }

      // for loop calls the UK Food Standards Agency (FSA) api once for each restaurant in
      // the restaurantsInfo array using each restaurant's unique FSA id number as a reference
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
              //logs to console to let you know that the API call has been successful
              console.log("api call successful");

              // success function calls addHygieneDataToArray for each iteration of the loop
              // adds data to an array of objects containing data from the returned FSA data.
              addHygieneDataToArray(data, hygieneDataArray);
              },
            });
        }
        //function returns the hygieneDataArray with info on each restaurant from the FSA API.
        return hygieneDataArray;
      };
  // property to hold the array that is created from the data returned from the FSA API.
  self.hygieneDataArray = self.getHygieneDataFromUKFSAandReturnArray(self.restaurantInfo);

  // function updates the hardcoded data in the self.restaurantInfo array.
  // I thought it would be easier to have all the data in one place.
  self.updateRestautantsListWithHygieneData = function() {
    var restaurantlistId;
    var hygieneListId;
    var hygieneData;
    var ratingDate;
    for (var i=0; i < self.restaurantInfo.length; i++) {
      restaurantlistId = self.restaurantInfo[i]["UKhygieneRatingId"];
      for (var k=0; k < self.hygieneDataArray.length; k++) {
        hygieneData = self.hygieneDataArray[k]["hygieneRating"];
        hygieneListId = self.hygieneDataArray[k]["id"];
        ratingDate = self.hygieneDataArray[k]["dateOfRating"];
        if (restaurantlistId === hygieneListId) {
          console.log("Success, restuarants updated with API data!");
          self.restaurantInfo[i]["hygieneRating"] = parseInt(hygieneData);
          self.restaurantInfo[i]["dateOfRating"] = ratingDate;
        };
      };
    };
    console.log(self.hygieneDataArray);
  };

  //allows time for data to return from server before combining arrays.
  setTimeout(function(){ self.updateRestautantsListWithHygieneData(); self.initalLoadOfRestaurants(); }, 800);


  // holds the selected hygiene rating filter value from the <select> tag in the DOM
  self.selectedHygieneRating = function(data){
                 numericValue: ko.observable(data.numericValue);
               };
  self.logsStaRating = function(){console.log(self.selectedHygieneRating.numericValue)};

  // observable array to hold the restuarant info.
  self.listOfRestaurants = ko.observableArray();

  console.log("this is in the knocockout function: ", self.restaurantInfo);


  // class to set up template row objects which get pushed to ko.observableArray (listOfRestaurants)
  self.restaurantListItemDropDown = function(title, hygieneRating, lat, lng, vicinity) {
      var self = this;
      self.title = title;
      self.hyigeneRating = hygieneRating;
      self.lat = lat;
      self.lng = lng;
      self.vicinity = vicinity;
    };

    // load restaurant into observable array to display on screen

  // pushes hardcoded restuarant data into ko.observableArray (listOfRestaurants)
  self.initalLoadOfRestaurants = function(){

    for(var i = 0; i < self.restaurantInfo.length; i++) {
      self.listOfRestaurants.push(new self.restaurantListItemDropDown(self.restaurantInfo[i].title, self.restaurantInfo[i].hygieneRating, self.restaurantInfo[i].location.lat, self.restaurantInfo[i].location.lng, self.restaurantInfo[i].vicinity));
      console.log("Button pressed");
    }
  };

  // called when user presses the reset button.
  self.resetInitalLoadOfRestaurants = function(){
    self.listOfRestaurants = ko.observableArray();
    self.initalLoadOfRestaurants();
    console.log("Button pressed");
  }

//   self.filterRestrautantsBasedOnSelectedHyigeneRating = ko.computed(function(){
//     if(self.selectedHygieneRating() === "One Star") {
//        console.log("Propery has been read");
//     };
//
//     for(var i = 0; i < self.restaurantInfo.length; i++) {
//     if (self.restaurantInfo[i].hygieneRating === self.selectedHygieneRating.numericValue) {
//       self.listOfRestaurants.push(new self.restaurantListItemDropDown(self.restaurantInfo[i].title, self.restaurantInfo[i].hygieneRating, self.restaurantInfo[i].location.lat, self.restaurantInfo[i].location.lng, self.restaurantInfo[i].vicinity));
//     };
//   } http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
// });

// self.filteredItems = function() {
//         var filter = 4;
//         var removeList = ko.utils.arrayFilter(self.listOfRestaurants(), function(restaurant) {
//            return restaurant.hygieneRating !== filter;
//         });
//         return removeList;
//     };

self.removeItemsThatDoNotMatchFilterCriteria = function(){
  var test = self.listOfRestaurants.remove(function(item){item.hygieneRating == 3});
  console.log(test);
}


// ------- functions to update map ------- //

self.myMap = myMap;






};


// fires after page has loaded.
$(function(){
    ko.applyBindings(new neighbourHoodMapVeiwModel());
});
