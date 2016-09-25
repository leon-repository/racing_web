var myApp = angular.module('myApp',['ui.router','ui.sortable','bw.paging','ngSanitize','LocalStorageModule','angular-sha1']);

myApp.config(['$stateProvider','$urlRouterProvider','$httpProvider','localStorageServiceProvider',function($stateProvider,$urlRouterProvider,$httpProvider,localStorageServiceProvider){

    //所有请求添加header配置
    $httpProvider.interceptors.push('HttpInterceptor');


    // 路由部分
    $urlRouterProvider.otherwise('/login');


    //实时开奖
    $stateProvider.state('login',{
        url : '/login',
        templateUrl : './templates/login/login.html'
    }).state('realtime',{
        url : '/realtime',
        templateUrl : './templates/realtime/realtime.html',
    })
    //开奖列表
    .state('lottery',{
        url : '/lottery',
        templateUrl : './templates/lottery/lottery.html',
    }).state('lottery.list',{
        url : '/list',
        templateUrl : './templates/lottery/lotterylist.html',
        controller : 'lotterylistCtrl'
    })
    //积分管理
    .state('integral',{
        url : '/integral',
        templateUrl : './templates/integral/integral.html',
    }).state('integral.apply',{
        url : '/apply',
        templateUrl : './templates/integral/apply.html',
    }).state('integral.list',{
        url : '/list',
        templateUrl : './templates/integral/list.html',
    }).state('integralDetail',{
        url : '/integralDetail/?item1&item2',
        templateUrl : './templates/integral/integralDetail.html',
    })
    //押注报表
    .state('bet',{
        url : '/bet',
        templateUrl : './templates/bet/bet.html',
    }).state('bet.allbet',{
        url : '/allBet',
        templateUrl : './templates/bet/all.html',
    }).state('bet.otherbet',{
        url : '/otherBet',
        templateUrl : './templates/bet/other.html',
    })
    //盈亏报表
    .state('profitloss',{
        url : '/profitloss',
        templateUrl : './templates/profitloss/profitloss.html',
    }).state('profitloss.all',{
        url : '/profitlossAll',
        templateUrl : './templates/profitloss/all.html',
    }).state('profitloss.other',{
        url : '/profitlossOther',
        templateUrl : './templates/profitloss/other.html',
    })
    //用户管理
    .state('users',{
        url : '/users',
        templateUrl : './templates/users/users.html',
    }).state('users.all',{
        url : '/allUser',
        templateUrl : './templates/users/all.html',
    }).state('users.other',{
        url : '/otherUser',
        templateUrl : './templates/users/other.html',
    })

}]);
//监控所有路由 清除 实时监控的 请求定时器
myApp.run(['$state','$rootScope','$timeout',function($state,$rootScope,$timeout){
    $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams,options){
        console.log('url router change');
        $timeout.cancel($rootScope.timer);
    })
}]);
