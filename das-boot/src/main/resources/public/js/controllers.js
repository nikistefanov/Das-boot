angular.module('app.controllers', []).controller('ShipwreckListController', function($scope, $state, $element, $document, popupService, $window, Shipwreck) {
	$scope.shipwrecks = Shipwreck.query(); //fetch all shipwrecks. Issues a GET to /api/vi/shipwrecks
	
	$scope.isAuthorised = false;
	
	$scope.autorised = function() {
		this.isAuthorised = !this.isAuthorised;
	};
	
	Shipwreck.query().$promise.then(function(data) {
		var bounds = new google.maps.LatLngBounds();
		
		var northAtlanticOcean = {lat: 43.837686, lng: -35.165842};
		
        var map = new google.maps.Map(document.getElementById('map_canvas'), {
          zoom: 3,
          center: northAtlanticOcean
        });
        
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        
        for (var i = 0; i < data.length; i++) {
            var theMarker = data[i];
            
            var image = '';
            switch (theMarker.condition) {
	            case 'United States':
	            	image = 'http://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/US_flag_48_stars.svg/23px-US_flag_48_stars.svg.png';
	                break;
	            case 'United Kingdom':
	                image = 'http://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/23px-Flag_of_the_United_Kingdom.svg.png';
	                break;
	            case 'Nazi Germany':
	            	image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Flag_of_the_German_Reich_%281935%E2%80%931945%29.svg/23px-Flag_of_the_German_Reich_%281935%E2%80%931945%29.svg.png';
	            	break;
	            case 'Japan':
	            	image = 'http://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Merchant_flag_of_Japan_%281870%29.svg/22px-Merchant_flag_of_Japan_%281870%29.svg.png';
	            	break;
	            case 'Italy':
	            	image = 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Italy_%281861-1946%29_crowned.svg/23px-Flag_of_Italy_%281861-1946%29_crowned.svg.png';
	            	break;
	            case 'Australia':
	            	image = 'http://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Flag_of_Australia.svg/23px-Flag_of_Australia.svg.png';
	            	break;
	            case 'Soviet Union':
	            	image = 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Flag_of_the_Soviet_Union_%281923-1955%29.svg/23px-Flag_of_the_Soviet_Union_%281923-1955%29.svg.png';
	            	break;
	            default:
	                image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
	        }
            
            var marker = new google.maps.Marker({
              position: {lat: theMarker.latitude, lng: theMarker.longitude},
              map: map,
              title: theMarker.name,
              icon: image,
              id: theMarker.id,
              content: '<div class="info_content">' +
  	        '<h3>' + theMarker.name + '</h3>' +
  	        '<p>' + theMarker.description + '</p>' + 
  	        '<p>Country: ' + theMarker.condition + '</p>' + 
  	        '<p>Discovered in: ' + theMarker.yearDiscovered + '</p>' + 
  	        '</div>'
            });
            
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infoWindow.setContent(marker.content);
                    infoWindow.open(map, marker);
                }
            })(marker));

            map.fitBounds(bounds);
        }
        
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(3);
            this.setCenter(northAtlanticOcean);
            google.maps.event.removeListener(boundsListener);
        });
	});
  $scope.deleteShipwreck = function(shipwreck) { // Delete a Shipwreck. Issues a DELETE to /api/v1/shipwrecks/:id
    if (popupService.showPopup('Really delete this?')) {
      shipwreck.$delete(function() {
        $scope.shipwrecks = Shipwreck.query(); 
        $state.go('shipwrecks');
      });
    }
  };
}).controller('ShipwreckViewController', function($scope, $stateParams, Shipwreck) {
  $scope.shipwreck = Shipwreck.get({ id: $stateParams.id }); //Get a single shipwreck.Issues a GET to /api/v1/shipwrecks/:id
}).controller('ShipwreckCreateController', function($scope, $state, $stateParams, Shipwreck) {
  $scope.shipwreck = new Shipwreck();  //create new shipwreck instance. Properties will be set via ng-model on UI

  $scope.addShipwreck = function() { //create a new shipwreck. Issues a POST to /api/v1/shipwrecks
    $scope.shipwreck.$save(function() {
      $state.go('shipwrecks'); // on success go back to the list i.e. shipwrecks state.
    });
  };
}).controller('ShipwreckEditController', function($scope, $state, $stateParams, Shipwreck) {
  $scope.updateShipwreck = function() { //Update the edited shipwreck. Issues a PUT to /api/v1/shipwrecks/:id
    $scope.shipwreck.$update(function() {
      $state.go('shipwrecks'); // on success go back to the list i.e. shipwrecks state.
    });
  };

  $scope.loadShipwreck = function() { //Issues a GET request to /api/v1/shipwrecks/:id to get a shipwreck to update
    $scope.shipwreck = Shipwreck.get({ id: $stateParams.id });
  };

  $scope.loadShipwreck(); // Load a shipwreck which can be edited on UI
});
