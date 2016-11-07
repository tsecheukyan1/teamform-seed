$(document).ready(function(){
	
	$('#admin_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
	}

});

angular.module('teamform-admin-app', ['firebase'])
.controller('AdminCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of AdminCtrl
	
	// Initialize $scope.param as an empty JSON object
	$scope.param = {};
	
	var refPath, ref, eventName;

	eventName = getURLParameter("q");
	refPath = eventName + "/admin/param";
	ref = firebase.database().ref(refPath);
		
	// Link and sync a firebase object	
	$scope.param = $firebaseObject(ref);
	$scope.param.$loaded().then(function(data) {
		if(typeof $scope.param.maxTeamSize == "undefined"){
			$scope.param.maxTeamSize = 10;
		}
		if(typeof $scope.param.minTeamSize == "undefined"){
			$scope.param.minTeamSize = 1;
		}
		if($scope.param.eventAdmin !== firebase.auth().currentUser.uid) {
			$("#admin_page_controller button").hide();
		}
		$('#admin_page_controller').show();
	});
	
	refPath = eventName + "/team";
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));

	refPath = eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));

	$scope.retrieveNamesFromJSON = function(jsonObj) {
		var result = [];
		angular.forEach(jsonObj, function(member) {
			$.each($scope.member, function(i, obj) {
				if(member == obj.$id) {
					result.push(obj.name);
				}
			});
		});
		return result;
	};

	$scope.changeMinTeamSize = function(delta) {
		var newVal = $scope.param.minTeamSize + delta;
		if (newVal >=1 && newVal <= $scope.param.maxTeamSize ) {
			$scope.param.minTeamSize = newVal;
		}
		$scope.param.$save();
	};

	$scope.changeMaxTeamSize = function(delta) {
		var newVal = $scope.param.maxTeamSize + delta;
		if (newVal >=1 && newVal >= $scope.param.minTeamSize ) {
			$scope.param.maxTeamSize = newVal;
		}
		$scope.param.$save();
	};

	$scope.saveFunc = function() {
		$scope.param.$save();
		// Finally, go back to the front-end
		window.location.href= "index.html";
	};
}]);