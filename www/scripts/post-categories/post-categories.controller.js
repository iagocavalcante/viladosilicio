angular.module('post-categories.controller', [])
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
});