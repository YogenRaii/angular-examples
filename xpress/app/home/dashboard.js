'use strict';

angular.module('myApp.dashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		/*templateUrl: 'home/dashboard.html',*/
        templateUrl:'html/index.html',
		controller: 'DashboardCtrl'
	});
}])

.controller('DashboardCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
	$scope.username = LoginService.getUser();
	if(!$scope.username){
		$location.path('/login');
	}


	/*var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/articles");
	var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
	$scope.articles = sync.$asArray();*/

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
    var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
    $scope.requests = sync.$asArray();

	$scope.editPost = function(id) {

		var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/articles/" + id);

		var syn = $firebase(firebaseObj);

		$scope.postToUpdate = syn.$asObject();

    	$('#editModal').modal();      // triggers the modal pop up
    }

    $scope.update = function(){
    	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/articles/" + $scope.postToUpdate.$id);
    	var article = $firebase(firebaseObj);
    	article.$update({
    		title: $scope.postToUpdate.title,
    		post: $scope.postToUpdate.post,
    		emailId: $scope.postToUpdate.emailId
    	}).then(function(ref){
    		$('#editModal').modal('hide');
    	},function(error){
    		console.log("Error: ");
    		console.log(error);
    	});
    }

    $scope.confirmDelete = function(id) {
        var fb = new Firebase("https://x-press-yeti.firebaseio.com/articles/" + id);
        var article = $firebase(fb);
        $scope.postToDelete = article.$asObject();
        $('#deleteModal').modal('show');
    }

    $scope.deletePost = function() {
        var fb = new Firebase("https://x-press-yeti.firebaseio.com/articles/" + $scope.postToDelete.$id);
        var article = $firebase(fb);
        article.$remove().then(function(ref) {
            $('#deleteModal').modal('hide');
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.logout = function(){
    	LoginService.logoutUser();
	}
}]);