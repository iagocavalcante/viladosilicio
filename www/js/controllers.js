angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PostsCtrl', function($scope, $http,$timeout, $ionicLoading) {
  // Setup the loader
  $ionicLoading.show({
    content: 'Carregando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
 
  // You can change this url to experiment with other endpoints
  var postsApi = 'http://viladosilicio.com.br/wp-json/wp/v2/posts?per_page=16&_jsonp=JSON_CALLBACK';
 
  // This should go in a service so we can reuse it
  
  $http.jsonp( postsApi ).
    success(function(data, status, headers, config) {
      $timeout(function () {
        $ionicLoading.hide();
        $scope.posts = data;
        console.log( data );
      }, 5000);
    }).
    error(function(data, status, headers, config) {
      console.log( 'Post load error.' );
    });
   
})

.controller('PostCtrl', function($scope, $stateParams, $sce, $http) {
  // we get the postID from $stateParams.postId, the query the api for that post
  var singlePostApi = 'http://viladosilicio.com.br/wp-json/wp/v2/posts/' + $stateParams.postId + '?_jsonp=JSON_CALLBACK';
 
  $http.jsonp( singlePostApi ).
    success(function(data, status, headers, config) {
      $timeout(function () {
        $ionicLoading.hide();
        $scope.post = data;
        // must use trustAsHtml to get raw HTML from WordPress
        $scope.content = $sce.trustAsHtml(data.content.rendered);
      }, 5000);
    }).
    error(function(data, status, headers, config) {
      console.log( 'Single post load error.' );
    });
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
 

