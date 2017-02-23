angular.module('posts.controller', [])
	.controller('PostsCtrl', function($scope, $ionicListDelegate, $http,$timeout, $ionicLoading, $state, $cordovaSocialSharing) {
		// Setup the loader
		$scope.search = function(tag) {
			alert('Aqui vai pesquisar pela tag: ', tag);
		}
		
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
						done();
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
});