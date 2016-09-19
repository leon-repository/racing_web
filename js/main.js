var myApp = angular.module('myApp',['ui.router','LocalStorageModule']);

myApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    


    // 路由部分
    $urlRouterProvider.otherwise('/login');

    //实时开奖
    $stateProvider.state('login',{
        url : '/login',
        templateUrl : './templates/login/login.html'
    }).state('realtime',{
        url : '/realtime',
        templateUrl : './templates/realtime/realtime.html',
    }).state('realtime.status',{
        url : '/status',
        templateUrl : './templates/realtime/status.html',
    }).state('realtime.compluteReslut',{
        url : '/complute',
        templateUrl : './templates/realtime/complute.html',
    }).state('realtime.modifyReslut',{
        url : '/modify',
        templateUrl : './templates/realtime/modify.html',
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
