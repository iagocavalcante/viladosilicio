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

.controller('MenuCtrl', function($scope, $http, $state) {
  let categories = 'http://viladosilicio.com.br/wp-json/wp/v2/categories/?_jsonp=JSON_CALLBACK';
  $http.jsonp(categories)
    .success(function(data, status, headers, config){
      $scope.categorias = data;
      console.log(data);
    })
    .error(function(data, status, headers, config){
      console.log('Erro :', data)
    });

    $scope.listPostCategorie = function(id){
      $state.go('app.postsCategories', {idCategoria:id});
    }
})

.controller('AboutCtrl', function($scope, $stateParams, $http) {
  var author = 'http://viladosilicio.com.br/wp-json/wp/v2/users/'+$stateParams.authorId+'?_embed&_jsonp=JSON_CALLBACK';
  $http.jsonp(author).success(function(data, status, headers, config) {
        $scope.user = data;
        console.log(data);
  }).error(function(data, status, headers, config){
      console.log( 'Erro: ', data);
  });
})

.controller('PostsCtrl', function($scope, $ionicListDelegate, $http,$timeout, $ionicLoading, $state, $cordovaSocialSharing) {
  // Setup the loader

  $scope.share = function(message, image, link) {
    $ionicListDelegate.closeOptionButtons();
    window.plugins.socialsharing.share(message, image, null, link);
  } 
  
  function padDateTime(dt) { //Add a preceding zero to months and days < 10
    return dt < 10 ? "0"+dt : dt;
  }

  function htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  $scope.parseDateServer = function(date){
    var dateParsed = new Date(Date.parse(date));
    var dd = padDateTime(dateParsed.getDate());
    var mm = padDateTime(dateParsed.getMonth()+1);
    var yyyy = dateParsed.getFullYear();
    var hrs = padDateTime(dateParsed.getHours());
    var mins = padDateTime(dateParsed.getMinutes());

    var myDateTimeString = "Publicado "+dd+"/"+mm+"/"+yyyy+" às "+hrs+":"+mins;  
    return myDateTimeString;  
  }

  $ionicLoading.show({
    content: 'Carregando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
 
  // You can change this url to experiment with other endpoints
  var postsApi = 'http://viladosilicio.com.br/wp-json/wp/v2/posts?per_page=3&_embed&_jsonp=JSON_CALLBACK';
  var dados = [];
  // This should go in a service so we can reuse it
  var paginaAtual = 2;
  $http.jsonp(postsApi).
    success(function(data, status, headers, config) {
      $timeout(function () {
        $ionicLoading.hide();
        for(var i=0; i < data.length; i++){
            dados.push(data[i]);
        }
        $scope.posts = dados;
      }, 3000);
    }).
    error(function(data, status, headers, config) {
      console.log( 'Post load error.' );
    });
  
  $scope.aboutAuthor = function(id){
    $state.go('app.about', {authorId:id});
  }
  
  $scope.carregarMais = function(){
    var postsApiPage = 'http://viladosilicio.com.br/wp-json/wp/v2/posts?per_page=3&page='+paginaAtual+'&_embed&_jsonp=JSON_CALLBACK';
    $http.jsonp(postsApiPage).success(function(data, status, headers, config) {
        if(data != null){
          for(var i=0; i < data.length; i++){
            dados.push(data[i]);
          }
          $scope.posts = dados;
          paginaAtual += 1;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          alert('Não existem mais postagens!');
        }
    }).error(function(data, status, headers, config){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        console.log( 'Erro: ', data);
    }); 
  };

  $scope.doRefresh = function() {
    $http.jsonp(postsApi).success(function(data, status, headers, config) {
        $scope.posts = data;
    }).
    error(function(data, status, headers, config) {
      console.log( 'Post load error.' );
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  $scope.abrirPost = function(id){
    $state.go('app.post', {postId: id});
  };
})

.controller('PostsCategoriesCtrl', function($ionicListDelegate, $scope, $http,$timeout, $ionicLoading, $state, $stateParams, $cordovaSocialSharing) {
  // Setup the loader
  $scope.share = function(message, image, link) {
    $ionicListDelegate.closeOptionButtons();
    window.plugins.socialsharing.share(message, image, null, link);
  } 

  function htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }


  function padDateTime(dt) { //Add a preceding zero to months and days < 10
    return dt < 10 ? "0"+dt : dt;
  }

  $scope.parseDateServer = function(date){
    var dateParsed = new Date(Date.parse(date));
    var dd = padDateTime(dateParsed.getDate());
    var mm = padDateTime(dateParsed.getMonth()+1);
    var yyyy = dateParsed.getFullYear();
    var hrs = padDateTime(dateParsed.getHours());
    var mins = padDateTime(dateParsed.getMinutes());

    var myDateTimeString = "Publicado "+dd+"/"+mm+"/"+yyyy+" às "+hrs+":"+mins;  
    return myDateTimeString;  
  }

  $ionicLoading.show({
    content: 'Carregando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
 
  // You can change this url to experiment with other endpoints
  var postsApiCategorie = 'http://viladosilicio.com.br/wp-json/wp/v2/posts?per_page=3&categories='+$stateParams.idCategoria+'&_embed&_jsonp=JSON_CALLBACK';
  var dadosCategorie = [];
  console.log(postsApiCategorie);
  // This should go in a service so we can reuse it
  var paginaAtual = 2;
  $http.jsonp(postsApiCategorie).
    success(function(data, status, headers, config) {
      $timeout(function () {
        $ionicLoading.hide();
        for(var i=0; i < data.length; i++){
            if(data[i].categories[0] == $stateParams.idCategoria)
              dadosCategorie.push(data[i]);
        }
        $scope.posts = dadosCategorie;
      }, 3000);
    }).
    error(function(data, status, headers, config) {
      console.log( 'Post load error.' );
    });
  
  $scope.aboutAuthor = function(id){
    $state.go('app.about', {authorId:id});
  }
  
  $scope.carregarMais = function(){
    var postsApiPage = 'http://viladosilicio.com.br/wp-json/wp/v2/posts?per_page=3&categories='+$stateParams.idCategoria+'&page='+paginaAtual+'&_embed&_jsonp=JSON_CALLBACK';
    $http.jsonp(postsApiPage).success(function(data, status, headers, config) {
        if(data != null){
          for(var i=0; i < data.length; i++){
            if(data[i].categories[0] == $stateParams.idCategoria)
              dadosCategorie.push(data[i]);
          }
          $scope.posts = dadosCategorie;
          paginaAtual += 1;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          alert('Não existem mais postagens!');
        }
    }).error(function(data, status, headers, config){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        console.log( 'Erro: ', data);
    }); 
  };

  $scope.doRefresh = function() {
    $http.jsonp(postsApiCategorie).success(function(data, status, headers, config) {
        for(var i=0; i < data.length; i++){
            if(data[i].categories[0] == $stateParams.idCategoria)
              dadosCategorie.push(data[i]);
        }
        $scope.posts = data;
    }).
    error(function(data, status, headers, config) {
      console.log( 'Post load error.' );
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  $scope.abrirPost = function(id){
    $state.go('app.post', {postId: id});
  };
})

.controller('PostCtrl', function($scope, $state, $stateParams, $sce, $http, $timeout, $ionicLoading) {
  // we get the postID from $stateParams.postId, the query the api for that post
  // Setup the loader
  $ionicLoading.show({
    content: 'Carregando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  function htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  $scope.reset = function (newIdentifier, newUrl, newTitle, newLanguage) {
    DISQUS.reset({
        reload: true,
        config: function () {
            this.page.identifier = newIdentifier;
            this.page.url = newUrl;
            this.page.title = newTitle;
            this.language = newLanguage;
        }
    });
  };

  var singlePostApi = 'http://viladosilicio.com.br/wp-json/wp/v2/posts/' + $state.params.postId + '?_jsonp=JSON_CALLBACK';
 
  $http.jsonp( singlePostApi ).
    success(function(data, status, headers, config) {
      $timeout(function () {
        $ionicLoading.hide();
        console.log(data);
        $scope.post = data;
        $scope.reset(data.slug, data.link, data.title.rendered, 'pt');
        // must use trustAsHtml to get raw HTML from WordPress
        $scope.content = $sce.trustAsHtml(data.content.rendered);
      }, 5000);
    }).
    error(function(data, status, headers, config) {
      console.log( 'Single post load error.' );
    });
    
  (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = 'http://viladosilicio.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();

});
 

