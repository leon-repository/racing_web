// 切换 class active 指令
myApp.directive('tabActive',function(){
    return {
        restrict : 'A',
        link : function(scope,elem,attr){
            $(elem).on('click',function(ev){
                $(elem).siblings('li').removeClass('active');
                $(this).addClass('active');
            })
        }
    }
});

//在所有请求中添加 token
myApp.factory('HttpInterceptor', ['$q','localStorageService',function($q,localStorageService){
    return {
      // 请求发出之前，可以用于添加各种身份验证信息
      request: function(config){
        if(localStorageService.get('token')) {
          config.headers.token = localStorageService.get('token');
        }
        return config;
      },
      // 请求发出时出错
      requestError: function(err){
        return $q.reject(err);
      },
      // 成功返回了响应
      response: function(res){
        return res;
      },
      // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
      responseError: function(err){
        return $q.reject(err);
      }
    };
}]);
