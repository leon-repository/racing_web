//顶部导航的指令
myApp.directive('navHeader',function() {
    return {
        restrict : 'AE',
        scope : {
            nowSelsect : '@selectActive',
            realtimeSelsect : '@realtimeActive'
        },
        templateUrl : './templates/nav/nav.html',
    }
});

//历史回退
myApp.directive('goback',function(){
    return {
        restrict : 'A',
        link : function(scope,elem){
            $(elem).on('click',function(){
                window.history.back();
            })
        }
    }
})

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


//拼接加密算法
myApp.factory('encrypt', ['$location', 'sha1', function($location, sha1) {
    // console.log($location.url());
    // console.log($location.path());
    // console.log($location.search());
    // console.log(sha1.hash('/sign/check2011{"point":2000}10001123ewqasdcxz').toUpperCase(),'aaa');
    // console.log(sha1.hash('/sign/check2011{\"point\":2000}10001123ewqasdcxz').toUpperCase(),'bbb');


    //var path = $location.path();
    //var path = '/sign/check';
    //var searchObj = $location.search();
    //var searchObj = {'userId':10001,'account':2011};
    //console.log(keyStr);
    return {
        getAuthor: function(urlObj, secretKey) {
            urlObj.searchObj['requestBody'] = JSON.stringify(urlObj.params);
            var keyArr = [];
            angular.forEach(urlObj.searchObj, function(val, key) {
                keyArr.push(key);
            });
            keyArr.sort();
            //console.log(keyArr);
            var keyStr = '';
            angular.forEach(keyArr, function(val, index) {
                keyStr += urlObj.searchObj[val];
            });
            //console.log(urlObj.path + keyStr + secretKey);
            return sha1.hash(urlObj.path + keyStr + secretKey).toUpperCase();
        }
    };
}]);


//在所有请求中添加 配置
myApp.factory('HttpInterceptor', ['$q', 'localStorageService', function($q, localStorageService) {
    return {
        // 请求发出之前，可以用于添加各种身份验证信息
        request: function(config) {
            //对所有的请求添加 验证
            if (localStorageService.get('Authorization')) {
                //console.log(localStorageService.get('Authorization'),'location');
                config.headers.Authorization = localStorageService.get('Authorization');
            }
            return config;
        },
        // 请求发出时出错
        requestError: function(err) {
            //console.log('request config error');
            return $q.reject(err);
        },
        // 成功返回了响应
        response: function(res) {
            //console.log('response config success');
            return res;
        },
        // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
        responseError: function(err) {
            //console.log('response config error');
            return $q.reject(err);
        }
    };
}]);


//时间格式化
myApp.filter('toMinSec', function() {
    return function(time) {
        var totalSec = time / 1000;
        var min = parseInt(totalSec / 60);
        var sec = parseInt(totalSec % 60);
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec;
    }
});

//过滤数据
myApp.filter('splitArrFilter',function(){
    return function(o){
        if(typeof o == 'object'){
            var str ='';
            for(var i=0;i<o.length;i++){
                if(i==0){
                    str += o[i];
                }else{
                    str += '<span class="paddingTips">|</span>'+o[i];
                }
            }
            return str;
        }else{
            return o;
        }
    }
})
