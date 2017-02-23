angular.module('menu.controller', [])
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
});