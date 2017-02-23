angular.module('about.controller', [])
	.controller('AboutCtrl', function($scope, $stateParams, $http) {
		//urls para pegar os autores do blog
		var api = "http://viladosilicio.com.br/wp-json/wp/v2/users/";
		var api_author = $stateParams.authorId+'?_embed&_jsonp=JSON_CALLBACK';
		var url = api + api_author;

		//chamada da api utilizando json e tratando as respostas
		$http.jsonp(url)
			.success(function(data, status, headers, config) {
				$scope.user = data;
				console.log(data);
			})
			.error(function(data, status, headers, config){
				console.log( 'Erro: ', data);
		});
});