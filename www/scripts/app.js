// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('viladosilicio', ['ionic', 'about.controller', 'menu.controller', 'post.controller',
'post-categories.controller', 'posts.controller', 'ngCordova'])

.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    var notificationOpenedCallback = function(jsonData) {
      var postid = jsonData.payload.additionalData.postid;
      console.log(postid);
      $state.go('app.post', {postId:postid});
    };

    window.plugins.OneSignal
      .startInit("71db1e27-ed39-4ebb-96c6-78316efc05b7")
      .handleNotificationReceived(notificationOpenedCallback)
      .endInit();
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'scripts/components/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.posts', {
    url: "/posts",
    views: {
      'menuContent': {
        templateUrl: "scripts/posts/posts.html",
        controller: 'PostsCtrl'
      }
    }
  })

  .state('app.postsCategories', {
    url: "/posts/:idCategoria",
    views: {
      'menuContent': {
        templateUrl: "scripts/post-categories/post-categories.html",
        controller: 'PostsCategoriesCtrl'
      }
    }
  })

  .state('app.about', {
    url: "/about/:authorId",
    views: {
      'menuContent': {
        templateUrl: "scripts/about/about.html",
        controller: 'AboutCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/posts/:postId",
    views: {
      'menuContent': {
        templateUrl: "scripts/post/post.html",
        controller: 'PostCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/posts');
});
