angular.module('app.controllers', []).controller('ShipwreckListController', function($scope, $state, $element, $document, popupService, $window, Shipwreck) {
	$scope.shipwrecks = Shipwreck.query(); //fetch all shipwrecks. Issues a GET to /api/vi/shipwrecks
	
	Shipwreck.query().$promise.then(function(data) {
		var bounds = new google.maps.LatLngBounds();
		
		var randomPlaceOnMap = {lat: 17.18, lng: 83.33};
		
        var map = new google.maps.Map(document.getElementById('map_canvas'), {
          zoom: 3,
          center: randomPlaceOnMap
        });
        
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        
        for (var i = 0; i < data.length; i++) {
            var theMarker = data[i];
            var infoWindowContent = '<div class="info_content">' +
	        '<h3>' + theMarker.name + '</h3>' +
	        '<p>' + theMarker.description + '</p>' + 
	        '<p>Discovered in: ' + theMarker.yearDiscovered + '</p>' + 
	        '</div>';
            
            var marker = new google.maps.Marker({
              position: {lat: theMarker.latitude, lng: theMarker.longitude},
              map: map,
              title: theMarker.name
            });
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            map.fitBounds(bounds);
        }
        
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(2);
            google.maps.event.removeListener(boundsListener);
        });
	});
	
	$(document).ready(function() {
		
		
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
