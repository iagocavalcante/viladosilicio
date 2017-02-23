angular.module('post.controller', [])
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
  
//   Diretiva para adicionar classe na tag <img>
//   function AddClassToImg($sce, $compile){
//     return {
//         restrict: 'A',
//         scope:{
//             addClass: '='
//         },
//         link: function (scope, elem, attrs){

//             var content = scope.addClass.$$unwrapTrustedValue();
//             var newContent = $("<div>").append($(content).find('img').addClass('img-responsive').end()).html();
//             scope.addClass = $sce.trustAsHtml(newContent);
//         }
//     }
// };




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