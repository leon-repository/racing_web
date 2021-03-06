var myApp = angular.module('myApp',['ui.router','ui.sortable','bw.paging','ngSanitize','moment-picker','LocalStorageModule','angular-sha1']);

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
        url : '/integralDetail/?userId&userName',
        templateUrl : './templates/integral/integralDetail.html',
    })
    //盈亏报表
    .state('profitlose',{
        url : '/profitlose',
        templateUrl : './templates/profitlose/profitlose.html',
    }).state('profitlose.all',{
        url : '/profitloseAll',
        templateUrl : './templates/profitlose/all.html',
    }).state('profitlose.other',{
        url : '/profitloseOther',
        templateUrl : './templates/profitlose/other.html',
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
    }).state('betDetail',{
        url : '/betDetail/:type&:category&:id',
        templateUrl : './templates/bet/betDetail.html'
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
    });

}]);
//监控所有路由 清除 实时监控的 请求定时器
myApp.run(['$state','$rootScope','$timeout','localStorageService',function($state,$rootScope,$timeout,localStorageService){
    $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams,options){
        //console.log('url router change');
        $timeout.cancel($rootScope.timer);
        if(toState.name=='login')return;// 如果是进入登录界面则允许
        if(!localStorageService.get('username')){
    		event.preventDefault();// 取消默认跳转行为
    		$state.go("login");//跳转到登录界面
    	}
    });
}]);

// mainctrl
// myApp.controller('mainctrl',['$scope',function($scope){
//
// }]);
//
// //导航控制器
// myApp.controller('navLoginCtrl',['$scope',function($scope){
//
// }]);

//顶部导航的 用户登录显示
myApp.controller('userLoginedCtrl',['$scope','$state','$rootScope','localStorageService',function($scope,$state,$rootScope,localStorageService){
    $scope.username = localStorageService.get('username');
    $scope.logout = function(){
        localStorageService.clearAll();
        $state.go('login');
    };
}]);


//用户登录
myApp.controller('loginCtrl',['$scope','$http','$state','$rootScope','localStorageService',function($scope,$http,$state,$rootScope,localStorageService){


    if(!localStorageService.isSupported){
        alert('您的浏览器版本太低，请升级高版本浏览器');
        return;
    }

    if(localStorageService.get('username')){
        $rootScope.username = localStorageService.get('username');
        $state.go('realtime');
        return;
    }

    //登录请求获取 Accesskey 和 secretKey
    $scope.loginSubmit = function(){
        var params = {
            userName : $scope.username,
            password : $scope.password
        };
        $http({
            url : 'http://60.205.163.65:8080/manager/login',
            method : 'post',
            headers : {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            data: params
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result == 'SUCCESS'){
                //var userType = true; // 用户的级别
                $rootScope.username = $scope.username;
                if(localStorageService.isSupported) {
                    localStorageService.set('Accesskey',data.data.accessKey);
                    localStorageService.set('secretKey',data.data.securityKey);
                    localStorageService.set('username',$scope.username);
                    //localStorageService.set('userType',userType);
                }else{
                    alert('您的浏览器版本太低，请升级高版本浏览器');
                }
                $state.go('realtime');
            }else{
                alert('用户名或密码有误请重试');
            }
        },function(err){
            //console.log(err);
        });
    };
}]);


//实时开奖
myApp.controller('realtimeCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','encrypt','localStorageService',function($scope,$rootScope,$http,$timeout,$filter,$state,encrypt,localStorageService){
    $scope.table1 = [];
    $scope.table2 = [];
    function maketableDate(json){
        //1-10 表格数据
        $scope.table1 = [
            //1
            [
                {key:'大',value:1.988,money:json.rankingStakeList[0].big},
                {key:'大',value:1.988,money:json.rankingStakeList[1].big},
                {key:'大',value:1.988,money:json.rankingStakeList[2].big},
                {key:'大',value:1.988,money:json.rankingStakeList[3].big},
                {key:'大',value:1.988,money:json.rankingStakeList[4].big},
                {key:'大',value:1.988,money:json.rankingStakeList[5].big},
                {key:'大',value:1.988,money:json.rankingStakeList[6].big},
                {key:'大',value:1.988,money:json.rankingStakeList[7].big},
                {key:'大',value:1.988,money:json.rankingStakeList[8].big},
                {key:'大',value:1.988,money:json.rankingStakeList[9].big}
            ],
            //2
            [
                {key:'小',value:1.988,money:json.rankingStakeList[0].small},
                {key:'小',value:1.988,money:json.rankingStakeList[1].small},
                {key:'小',value:1.988,money:json.rankingStakeList[2].small},
                {key:'小',value:1.988,money:json.rankingStakeList[3].small},
                {key:'小',value:1.988,money:json.rankingStakeList[4].small},
                {key:'小',value:1.988,money:json.rankingStakeList[5].small},
                {key:'小',value:1.988,money:json.rankingStakeList[6].small},
                {key:'小',value:1.988,money:json.rankingStakeList[7].small},
                {key:'小',value:1.988,money:json.rankingStakeList[8].small},
                {key:'小',value:1.988,money:json.rankingStakeList[9].small}
            ],
            //3
            [
                {key:'单',value:1.988,money:json.rankingStakeList[0].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[1].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[2].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[3].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[4].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[5].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[6].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[7].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[8].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[9].odd}
            ],
            //4
            [
                {key:'双',value:1.988,money:json.rankingStakeList[0].even},
                {key:'双',value:1.988,money:json.rankingStakeList[1].even},
                {key:'双',value:1.988,money:json.rankingStakeList[2].even},
                {key:'双',value:1.988,money:json.rankingStakeList[3].even},
                {key:'双',value:1.988,money:json.rankingStakeList[4].even},
                {key:'双',value:1.988,money:json.rankingStakeList[5].even},
                {key:'双',value:1.988,money:json.rankingStakeList[6].even},
                {key:'双',value:1.988,money:json.rankingStakeList[7].even},
                {key:'双',value:1.988,money:json.rankingStakeList[8].even},
                {key:'双',value:1.988,money:json.rankingStakeList[9].even}
            ],
            //5
            [
                {key:'龙',value:1.988,money:json.commonStake.firstUp},
                {key:'龙',value:1.988,money:json.commonStake.secondUp},
                {key:'龙',value:1.988,money:json.commonStake.thirdUp},
                {key:'龙',value:1.988,money:json.commonStake.fourthUp},
                {key:'龙',value:1.988,money:json.commonStake.fifthUp},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //6
            [
                {key:'虎',value:1.988,money:json.commonStake.firstDowm},
                {key:'虎',value:1.988,money:json.commonStake.secondDowm},
                {key:'虎',value:1.988,money:json.commonStake.thirdDowm},
                {key:'虎',value:1.988,money:json.commonStake.fourthDowm},
                {key:'虎',value:1.988,money:json.commonStake.fifthDowm},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //7
            [
                {key:1,value:9.94,money:json.appointStakeList[0].first},
                {key:1,value:9.94,money:json.appointStakeList[0].second},
                {key:1,value:9.94,money:json.appointStakeList[0].third},
                {key:1,value:9.94,money:json.appointStakeList[0].fourth},
                {key:1,value:9.94,money:json.appointStakeList[0].fifth},
                {key:1,value:9.94,money:json.appointStakeList[0].sixth},
                {key:1,value:9.94,money:json.appointStakeList[0].seventh},
                {key:1,value:9.94,money:json.appointStakeList[0].eighth},
                {key:1,value:9.94,money:json.appointStakeList[0].ninth},
                {key:1,value:9.94,money:json.appointStakeList[0].tenth}
            ],
            //8
            [
                {key:2,value:9.94,money:json.appointStakeList[1].first},
                {key:2,value:9.94,money:json.appointStakeList[1].second},
                {key:2,value:9.94,money:json.appointStakeList[1].third},
                {key:2,value:9.94,money:json.appointStakeList[1].fourth},
                {key:2,value:9.94,money:json.appointStakeList[1].fifth},
                {key:2,value:9.94,money:json.appointStakeList[1].sixth},
                {key:2,value:9.94,money:json.appointStakeList[1].seventh},
                {key:2,value:9.94,money:json.appointStakeList[1].eighth},
                {key:2,value:9.94,money:json.appointStakeList[1].ninth},
                {key:2,value:9.94,money:json.appointStakeList[1].tenth}
            ],
            //9
            [
                {key:3,value:9.94,money:json.appointStakeList[2].first},
                {key:3,value:9.94,money:json.appointStakeList[2].second},
                {key:3,value:9.94,money:json.appointStakeList[2].third},
                {key:3,value:9.94,money:json.appointStakeList[2].fourth},
                {key:3,value:9.94,money:json.appointStakeList[2].fifth},
                {key:3,value:9.94,money:json.appointStakeList[2].sixth},
                {key:3,value:9.94,money:json.appointStakeList[2].seventh},
                {key:3,value:9.94,money:json.appointStakeList[2].eighth},
                {key:3,value:9.94,money:json.appointStakeList[2].ninth},
                {key:3,value:9.94,money:json.appointStakeList[2].tenth}
            ],
            //10
            [
                {key:4,value:9.94,money:json.appointStakeList[3].first},
                {key:4,value:9.94,money:json.appointStakeList[3].second},
                {key:4,value:9.94,money:json.appointStakeList[3].third},
                {key:4,value:9.94,money:json.appointStakeList[3].fourth},
                {key:4,value:9.94,money:json.appointStakeList[3].fifth},
                {key:4,value:9.94,money:json.appointStakeList[3].sixth},
                {key:4,value:9.94,money:json.appointStakeList[3].seventh},
                {key:4,value:9.94,money:json.appointStakeList[3].eighth},
                {key:4,value:9.94,money:json.appointStakeList[3].ninth},
                {key:4,value:9.94,money:json.appointStakeList[3].tenth}
            ],
            //11
            [
                {key:5,value:9.94,money:json.appointStakeList[4].first},
                {key:5,value:9.94,money:json.appointStakeList[4].second},
                {key:5,value:9.94,money:json.appointStakeList[4].third},
                {key:5,value:9.94,money:json.appointStakeList[4].fourth},
                {key:5,value:9.94,money:json.appointStakeList[4].fifth},
                {key:5,value:9.94,money:json.appointStakeList[4].sixth},
                {key:5,value:9.94,money:json.appointStakeList[4].seventh},
                {key:5,value:9.94,money:json.appointStakeList[4].eighth},
                {key:5,value:9.94,money:json.appointStakeList[4].ninth},
                {key:5,value:9.94,money:json.appointStakeList[4].tenth}
            ],
            //12
            [
                {key:6,value:9.94,money:json.appointStakeList[5].first},
                {key:6,value:9.94,money:json.appointStakeList[5].second},
                {key:6,value:9.94,money:json.appointStakeList[5].third},
                {key:6,value:9.94,money:json.appointStakeList[5].fourth},
                {key:6,value:9.94,money:json.appointStakeList[5].fifth},
                {key:6,value:9.94,money:json.appointStakeList[5].sixth},
                {key:6,value:9.94,money:json.appointStakeList[5].seventh},
                {key:6,value:9.94,money:json.appointStakeList[5].eighth},
                {key:6,value:9.94,money:json.appointStakeList[5].ninth},
                {key:6,value:9.94,money:json.appointStakeList[5].tenth}
            ],
            //13
            [
                {key:7,value:9.94,money:json.appointStakeList[6].first},
                {key:7,value:9.94,money:json.appointStakeList[6].second},
                {key:7,value:9.94,money:json.appointStakeList[6].third},
                {key:7,value:9.94,money:json.appointStakeList[6].fourth},
                {key:7,value:9.94,money:json.appointStakeList[6].fifth},
                {key:7,value:9.94,money:json.appointStakeList[6].sixth},
                {key:7,value:9.94,money:json.appointStakeList[6].seventh},
                {key:7,value:9.94,money:json.appointStakeList[6].eighth},
                {key:7,value:9.94,money:json.appointStakeList[6].ninth},
                {key:7,value:9.94,money:json.appointStakeList[6].tenth}
            ],
            //14
            [
                {key:8,value:9.94,money:json.appointStakeList[7].first},
                {key:8,value:9.94,money:json.appointStakeList[7].second},
                {key:8,value:9.94,money:json.appointStakeList[7].third},
                {key:8,value:9.94,money:json.appointStakeList[7].fourth},
                {key:8,value:9.94,money:json.appointStakeList[7].fifth},
                {key:8,value:9.94,money:json.appointStakeList[7].sixth},
                {key:8,value:9.94,money:json.appointStakeList[7].seventh},
                {key:8,value:9.94,money:json.appointStakeList[7].eighth},
                {key:8,value:9.94,money:json.appointStakeList[7].ninth},
                {key:8,value:9.94,money:json.appointStakeList[7].tenth}
            ],
            //15
            [
                {key:9,value:9.94,money:json.appointStakeList[8].first},
                {key:9,value:9.94,money:json.appointStakeList[8].second},
                {key:9,value:9.94,money:json.appointStakeList[8].third},
                {key:9,value:9.94,money:json.appointStakeList[8].fourth},
                {key:9,value:9.94,money:json.appointStakeList[8].fifth},
                {key:9,value:9.94,money:json.appointStakeList[8].sixth},
                {key:9,value:9.94,money:json.appointStakeList[8].seventh},
                {key:9,value:9.94,money:json.appointStakeList[8].eighth},
                {key:9,value:9.94,money:json.appointStakeList[8].ninth},
                {key:9,value:9.94,money:json.appointStakeList[8].tenth}
            ],
            //16
            [
                {key:10,value:9.94,money:json.appointStakeList[9].first},
                {key:10,value:9.94,money:json.appointStakeList[9].second},
                {key:10,value:9.94,money:json.appointStakeList[9].third},
                {key:10,value:9.94,money:json.appointStakeList[9].fourth},
                {key:10,value:9.94,money:json.appointStakeList[9].fifth},
                {key:10,value:9.94,money:json.appointStakeList[9].sixth},
                {key:10,value:9.94,money:json.appointStakeList[9].seventh},
                {key:10,value:9.94,money:json.appointStakeList[9].eighth},
                {key:10,value:9.94,money:json.appointStakeList[9].ninth},
                {key:10,value:9.94,money:json.appointStakeList[9].tenth}
            ],
        ];
        //冠亚组 表格数据
        $scope.table2 = [
            [{'key':'3','value':'41','money':json.commonStake.firstSecond3},{'key':'4','value':'41','money':json.commonStake.firstSecond4},{'key':'5','value':'21','money':json.commonStake.firstSecond5},{'key':'6','value':'21','money':json.commonStake.firstSecond6}],
            [{'key':'7','value':'12','money':json.commonStake.firstSecond7},{'key':'8','value':'12','money':json.commonStake.firstSecond8},{'key':'9','value':'10.3','money':json.commonStake.firstSecond9},{'key':'10','value':'10.3','money':json.commonStake.firstSecond10}],
            [{'key':'11','value':'8.3','money':json.commonStake.firstSecond11},{'key':'12','value':'10.3','money':json.commonStake.firstSecond12},{'key':'13','value':'10.3','money':json.commonStake.firstSecond13},{'key':'14','value':'12','money':json.commonStake.firstSecond14}],
            [{'key':'15','value':'12','money':json.commonStake.firstSecond15},{'key':'16','value':'21','money':json.commonStake.firstSecond16},{'key':'17','value':'21','money':json.commonStake.firstSecond17},{'key':'18','value':'41','money':json.commonStake.firstSecond18}],
            [{'key':'19','value':'12','money':json.commonStake.firstSecond19},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
            [{'key':'冠亚大','value':'2','money':json.commonStake.firstSecondBig},{'key':'冠亚小','value':'1.63','money':json.commonStake.firstSecondSmall},{'key':'冠亚单','value':'1.63','money':json.commonStake.firstSecondOdd},{'key':'冠亚双','value':'2','money':json.commonStake.firstSecondOdd}]
        ];
    }



    //拖拽配置项 jQuery ui
    $scope.sortableOptions = {
        axis: "x"
    };

    //未登录先登录
    // if(!localStorageService.get('username')){
    //     $state.go('login');
    //     return;
    // }

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    //修改比赛结果的url
    var modifyUrl = 'http://60.205.163.65:8080/manager/stake/configer';

    var modifyflag = true;

    $timeout.cancel($rootScope.timer);
    function action(){
        initEncrypt('http://60.205.163.65:8080/manager/stake/configer',null);
        $http({
            url : 'http://60.205.163.65:8080/manager/stake/configer',
            //url : './data/data.php',
            method : 'get',
            dataType : 'json',
        }).then(function(res){
            var resData = res.data;
            //console.log(res,'res data');
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }

            $scope.racingNum = resData.data.racingNum;
            $scope.stopTime= $filter('toMinSec')(resData.data.endStakeTime);
            $scope.startTime = $filter('toMinSec')(resData.data.startRacingTime);
            $scope.todayIncome = resData.data.todayIncome;
            $scope.preResult = resData.data.preResult;
            $scope.nowStatus = resData.data.stageName;
            $scope.preRacingNum = resData.data.preRacingNum;
            $scope.money = resData.data.totalRacingStakeAmount;

            maketableDate(resData.data.stakeVo);


            if(resData.result==='ERROR'){
                //console.log('暂无比赛结果');
                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = true;
                $scope.toastMessage = '暂无比赛结果';
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                return;
            }
            if(resData.result==='SUCCESS' && resData.data.stage == 4){ // 不可押注
                //console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                modifyflag = true;
                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
                //console.log('计算最优结果中..');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = true;
                $scope.modifying = false;
                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 3 ){ //改比赛结果
                //console.log('修改比赛结果');
                // config.racingNum = resData.data.racingNum;
                // $('.toast').hide();
                // $('.table-box').addClass('disabled');
                // $('.notice-info').html('现在可以修改比赛结果');
                //modifyResult(resData.data.result);
                // return;

                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = true;
                if(modifyflag){
                    $scope.arrResult = resData.data.result;
                    modifyflag = false;
                }

                $scope.modifyNotice = '';
                return;

            }


            if(resData.result==='SUCCESS' && resData.data.stage == 1){          //押注阶段
                //console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            //console.log(err);
        });
        $rootScope.timer = $timeout(action,1000);
    }
    $rootScope.timer = $timeout(action,1000);



    //修改比赛结果
    $scope.modifyReslut = function(){
        //console.log($scope.arrResult,'drag end');
        initEncrypt(modifyUrl,{
          "racingNum": $scope.racingNum,
          "result": $scope.arrResult
        });
        //return;
        $http({
            url : modifyUrl,
            method : 'put',
            data : {'racingNum':$scope.racingNum,'result':$scope.arrResult}
        }).then(function(res){
            //console.log(res,'modifyReslut');
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
            }
        },function(err){
            //console.log(err);
            $scope.modifyNotice = '请求失败请重试';
        });
    };


}]);

//开奖列表
myApp.controller('lotterylistCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = '开奖列表页';

    $scope.queryPage = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function initData(){
        initEncrypt('http://60.205.163.65:8080/manager/racing/result?page='+$scope.queryPage ,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/racing/result?page='+$scope.queryPage ,
            method : 'get',
        }).then(function(res){
            //console.log(res,'开奖列表');
            var data = res.data;
            //console.log(data.data,'开奖列表');
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;
        },function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    initData();


    //页面跳转
    $scope.goPage = function(page){
        //console.log(page);
        $scope.queryPage = page;
        initData();
    };

    // $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}];
    //
    //
    // $scope.currentPage = 30;
    // //$scope.pageSize = 5;  //每页显示多少
    // $scope.total = 100;
    // $scope.goPage = function(a,b){
    //     //console.log(a,b);
    // };

}]);



//积分管理
myApp.controller('integralCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('applyCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "分盘申请上下分列表";

    //默认查询状态
    $scope.queryStatus = 'UNTREATED';
    $scope.queryPage = 1;

    //console.log('res secretKey: '+ localStorageService.get('secretKey'));
    //console.log('res Accesskey: '+localStorageService.get('Accesskey'));

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }
    initEncrypt('http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,null);

    function initData(){
        $http({
            url : 'http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,
            method : 'get',
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;

        }, function(err){
            //console.log(err,'获取用户管理页面失败');
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    initData();

    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'ok'},
    //     {'code':2,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'danger'},
    //     {'code':3,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'cancel'},
    // ];

    //select
    $scope.selectOptions =[{key:'UNTREATED',value:'待处理'},{key:'AUDIT',value:'已批准'},{key:'REJECT',value:'已拒绝'},{key:'CANCEL',value:'已取消'}];
    $scope.selection = $scope.selectOptions[0];
    $scope.selectChange = function(){
        $scope.queryStatus = $scope.selection.key;
        $scope.queryPage = 1;
        initEncrypt('http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        initData();
    };

    //页面跳转
    $scope.goPage = function(page){
        //console.log(page);
        $scope.queryPage = page;
        initEncrypt('http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        initData();
    };

    $scope.toRight = function(status,id) {
        ////console.log(status,id);
        $scope.modalContent = '';
        $scope.modalID = id;
        $scope.modalStatus = status;
        switch (status) {
            case 'ok':
                $scope.modalTitle = '批准';
                break;
            case 'danger':
                $scope.modalTitle = '拒绝';
                break;
            case 'cancel':
                $scope.modalTitle = '取消';
                break;
        }
    };

    //确认发送数据
    $scope.confirm = function(status) {
        ////console.log(status,$scope.modalContent,$scope.modalID,'modal');
        var url = '';
        switch (status) {
            case 'ok':
                url = '/manager/pointsapp/'+$scope.modalID+'/status/audit';
                break;
            case 'danger':
                url = '/manager/pointsapp/'+$scope.modalID+'/status/reject';
                break;
            case 'cancel':
                url = '/manager/pointsapp/'+$scope.modalID+'/status/cancel';
                break;
        }
        initEncrypt('http://60.205.163.65:8080'+url,{
            comments : $scope.modalContent
        });
        $http({
            url : 'http://60.205.163.65:8080'+url,
            method : 'put',
            data : {
                comments : $scope.modalContent
            }
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
                //重绘表格
                initData();
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });

    };

}]).controller('listCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "分盘积分列表";

    $scope.queryNickName = '';
    $scope.queryUserId = '';
    $scope.queryPage = 1;


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function initData(){
        initEncrypt('http://60.205.163.65:8080/manager/user/points?nickName='+$scope.queryNickName+'&userId='+$scope.queryUserId+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user/points?nickName='+$scope.queryNickName+'&userId='+$scope.queryUserId+'&page='+$scope.queryPage,
            method : 'get',
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;

        }, function(err){
            //console.log(err,'获取用户管理页面失败');
        });
    }

    initData();

    //分页跳转
    $scope.goPage = function(page){
        //console.log(page);
        $scope.queryPage = page;
        initData();
    };


    //搜索
    $scope.search = function(){
        //console.log('search list');
        //console.log($scope.searchName,$scope.searchId);
        $scope.queryNickName = $scope.searchName ? $scope.searchName : '';
        $scope.queryUserId = $scope.searchId ? $scope.searchId : '';
        initData();
    };

    //弹层
    $scope.toModal = function(status,userId){
        $scope.money = '';
        $scope.queryUserId = userId;
        if(status == 'add'){
            $scope.modalTitle = '加积分';
            $scope.modalStatus = 'add';
        }
        if(status == 'reduce'){
            $scope.modalTitle = '减积分';
            $scope.modalStatus = 'reduce';
        }
    };
    // 弹层确定
    $scope.confirm = function(status){
        var url = '';
        switch (status) {
            case 'add':
                url = '/manager/add/points/user/'+$scope.queryUserId;
                break;
            case 'reduce':
                url = '/manager/subtract/points/user/'+$scope.queryUserId;
                break;
        }
        initEncrypt('http://60.205.163.65:8080'+url,{
            points : $scope.money
        });
        //console.log(status, url, $scope.money);
        $http({
            url : 'http://60.205.163.65:8080'+url,
            method : 'put',
            data : {
                points : $scope.money
            }
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                $scope.queryNickName = '';
                $scope.queryUserId = '';
                $scope.queryPage = 1;
                initData();
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });

    };
}]);
//查看积分详情
myApp.controller('integralDetailCtrl',['$scope','$http','$state','$stateParams','$sanitize','localStorageService','encrypt',function($scope,$http,$state,$stateParams,$sanitize,localStorageService,encrypt){
    ////console.log($stateParams);
    $scope.queryUserId = $stateParams.userId;
    $scope.queryPage = 1;

    $scope.title = '当前的分盘名称为 '+$stateParams.userName;


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function initData(){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.queryUserId+'/account/record?page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+$scope.queryUserId+'/account/record?page='+$scope.queryPage,
            method : 'get',
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                //重绘表格
                $scope.tableData = data.data;
                //分页
                $scope.currentPage = data.page;
                //$scope.pageSize = data.pageSize;
                $scope.total = data.totalPage;
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });

    }

    initData();

    //分页
    $scope.goPage = function(page){
        //console.log(page);
        $scope.queryPage = page;
        initData();
    };



    // $scope.tableData = [
    //     {'code':1,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]},
    //     {'code':2,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]}
    // ];
}]);


//盈亏报表
myApp.controller('profitCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allPlCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "总体盈亏报表";


    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.queryIssue = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    $scope.selectActive = 'byDate';

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/manager/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/manager/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    byDate();


    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee'},
    //     {'code':1,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee'},
    // ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }

        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }

        $scope.queryIssue = $scope.issue;
        byIssue();
    };


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };


}]).controller('otherPlCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "分盘盈亏报表";
    $scope.tableData = null;
    $scope.selectActive = 'byDate';


    $scope.userId = '';
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.queryIssue = '';



    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    //加载select 列表
    initEncrypt('http://60.205.163.65:8080/manager/user?nicName=&userId=',null);
    $http({
        url : 'http://60.205.163.65:8080/manager/user?nicName=&userId=',
        methoed : 'get'
    }).then(function(res){
        //console.log(res,'select');
        var resData = res.data;
        if(resData.result == 'ERROR'){
            alert('获取分盘名称列表失败，请重新刷新页面');
            return;
        }
        if(res.data.result == 'NO_LOGIN'){
            localStorageService.clearAll();
            $state.go('login');
            return;
        }
        $scope.selectOptions = [{key:'0',value:'选择分盘名称'}];
        angular.forEach(resData.data,function(item){
            var json = {};
            json.key = item.id;
            json.value = item.nickName;
            $scope.selectOptions.push(json);
        });

        $scope.selectName = $scope.selectOptions[0];
    },function(){
        alert('请求失败，请重试或缺失必要内容');
    });

    $scope.selectChange = function(){
        //console.log($scope.selectName);
        $scope.userId = $scope.selectName.key;
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.userId+'/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.userId+'/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    // 表格数据格式
    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]},
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]}
    // ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }
        $scope.queryIssue = $scope.issue;
        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(!$scope.userId){
            alert('请先选择分盘名称');
            return;
        }
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };
}]);


//押注报表
myApp.controller('betCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allBetCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "总盘押注报表";
    $scope.selectActive = 'byDate';

    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.queryIssue = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/manager/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/manager/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    byDate();

    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':'bb','cc':'cc'},
    //     {'code':2,'aa':'kk','bb':'bb','cc':'cc'},
    // ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }
        $scope.queryIssue = $scope.issue;
        byIssue();
    };


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };
    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };

}]).controller('otherBetCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "分盘押注报表";
    $scope.tableData = null;
    $scope.selectActive = 'byDate';


    $scope.userId = '';
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.queryIssue = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }


    //加载select 列表
    initEncrypt('http://60.205.163.65:8080/manager/user?nicName=&userId=',null);
    $http({
        url : 'http://60.205.163.65:8080/manager/user?nicName=&userId=',
        methoed : 'get'
    }).then(function(res){
        //console.log(res,'select');
        var resData = res.data;
        if(resData.result == 'ERROR'){
            alert('获取分盘名称列表失败，请重新刷新页面');
            return;
        }
        if(res.data.result == 'NO_LOGIN'){
            localStorageService.clearAll();
            $state.go('login');
            return;
        }
        $scope.selectOptions = [{key:'0',value:'选择分盘名称'}];
        angular.forEach(resData.data,function(item){
            var json = {};
            json.key = item.id;
            json.value = item.nickName;
            $scope.selectOptions.push(json);
        });

        $scope.selectName = $scope.selectOptions[0];
    },function(){
        alert('请求失败，请重试或缺失必要内容');
    });

    $scope.selectChange = function(){
        //console.log($scope.selectName);
        $scope.userId = $scope.selectName.key;
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }


    };

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.userId+'/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url :  'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.userId+'/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    // 表格数据格式
    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]},
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]}
    // ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }
        $scope.queryIssue = $scope.issue;
        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(!$scope.userId){
            alert('请先选择分盘名称');
            return;
        }
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };

}]).controller('betDetailCtrl',['$scope','$stateParams','$http','encrypt','localStorageService',function($scope,$stateParams,$http,encrypt,localStorageService){
    //console.log($stateParams.type);
    $scope.userId = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.dateIssue = $stateParams.category;


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function maketableDate(json){
        //1-10 表格数据
        $scope.table1 = [
            //1
            [
                {key:'大',value:1.988,money:json.rankingStakeList[0].big},
                {key:'大',value:1.988,money:json.rankingStakeList[1].big},
                {key:'大',value:1.988,money:json.rankingStakeList[2].big},
                {key:'大',value:1.988,money:json.rankingStakeList[3].big},
                {key:'大',value:1.988,money:json.rankingStakeList[4].big},
                {key:'大',value:1.988,money:json.rankingStakeList[5].big},
                {key:'大',value:1.988,money:json.rankingStakeList[6].big},
                {key:'大',value:1.988,money:json.rankingStakeList[7].big},
                {key:'大',value:1.988,money:json.rankingStakeList[8].big},
                {key:'大',value:1.988,money:json.rankingStakeList[9].big}
            ],
            //2
            [
                {key:'小',value:1.988,money:json.rankingStakeList[0].small},
                {key:'小',value:1.988,money:json.rankingStakeList[1].small},
                {key:'小',value:1.988,money:json.rankingStakeList[2].small},
                {key:'小',value:1.988,money:json.rankingStakeList[3].small},
                {key:'小',value:1.988,money:json.rankingStakeList[4].small},
                {key:'小',value:1.988,money:json.rankingStakeList[5].small},
                {key:'小',value:1.988,money:json.rankingStakeList[6].small},
                {key:'小',value:1.988,money:json.rankingStakeList[7].small},
                {key:'小',value:1.988,money:json.rankingStakeList[8].small},
                {key:'小',value:1.988,money:json.rankingStakeList[9].small}
            ],
            //3
            [
                {key:'单',value:1.988,money:json.rankingStakeList[0].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[1].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[2].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[3].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[4].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[5].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[6].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[7].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[8].odd},
                {key:'单',value:1.988,money:json.rankingStakeList[9].odd}
            ],
            //4
            [
                {key:'双',value:1.988,money:json.rankingStakeList[0].even},
                {key:'双',value:1.988,money:json.rankingStakeList[1].even},
                {key:'双',value:1.988,money:json.rankingStakeList[2].even},
                {key:'双',value:1.988,money:json.rankingStakeList[3].even},
                {key:'双',value:1.988,money:json.rankingStakeList[4].even},
                {key:'双',value:1.988,money:json.rankingStakeList[5].even},
                {key:'双',value:1.988,money:json.rankingStakeList[6].even},
                {key:'双',value:1.988,money:json.rankingStakeList[7].even},
                {key:'双',value:1.988,money:json.rankingStakeList[8].even},
                {key:'双',value:1.988,money:json.rankingStakeList[9].even}
            ],
            //5
            [
                {key:'龙',value:1.988,money:json.commonStake.firstUp},
                {key:'龙',value:1.988,money:json.commonStake.secondUp},
                {key:'龙',value:1.988,money:json.commonStake.thirdUp},
                {key:'龙',value:1.988,money:json.commonStake.fourthUp},
                {key:'龙',value:1.988,money:json.commonStake.fifthUp},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //6
            [
                {key:'虎',value:1.988,money:json.commonStake.firstDowm},
                {key:'虎',value:1.988,money:json.commonStake.secondDowm},
                {key:'虎',value:1.988,money:json.commonStake.thirdDowm},
                {key:'虎',value:1.988,money:json.commonStake.fourthDowm},
                {key:'虎',value:1.988,money:json.commonStake.fifthDowm},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //7
            [
                {key:1,value:9.94,money:json.appointStakeList[0].first},
                {key:1,value:9.94,money:json.appointStakeList[0].second},
                {key:1,value:9.94,money:json.appointStakeList[0].third},
                {key:1,value:9.94,money:json.appointStakeList[0].fourth},
                {key:1,value:9.94,money:json.appointStakeList[0].fifth},
                {key:1,value:9.94,money:json.appointStakeList[0].sixth},
                {key:1,value:9.94,money:json.appointStakeList[0].seventh},
                {key:1,value:9.94,money:json.appointStakeList[0].eighth},
                {key:1,value:9.94,money:json.appointStakeList[0].ninth},
                {key:1,value:9.94,money:json.appointStakeList[0].tenth}
            ],
            //8
            [
                {key:2,value:9.94,money:json.appointStakeList[1].first},
                {key:2,value:9.94,money:json.appointStakeList[1].second},
                {key:2,value:9.94,money:json.appointStakeList[1].third},
                {key:2,value:9.94,money:json.appointStakeList[1].fourth},
                {key:2,value:9.94,money:json.appointStakeList[1].fifth},
                {key:2,value:9.94,money:json.appointStakeList[1].sixth},
                {key:2,value:9.94,money:json.appointStakeList[1].seventh},
                {key:2,value:9.94,money:json.appointStakeList[1].eighth},
                {key:2,value:9.94,money:json.appointStakeList[1].ninth},
                {key:2,value:9.94,money:json.appointStakeList[1].tenth}
            ],
            //9
            [
                {key:3,value:9.94,money:json.appointStakeList[2].first},
                {key:3,value:9.94,money:json.appointStakeList[2].second},
                {key:3,value:9.94,money:json.appointStakeList[2].third},
                {key:3,value:9.94,money:json.appointStakeList[2].fourth},
                {key:3,value:9.94,money:json.appointStakeList[2].fifth},
                {key:3,value:9.94,money:json.appointStakeList[2].sixth},
                {key:3,value:9.94,money:json.appointStakeList[2].seventh},
                {key:3,value:9.94,money:json.appointStakeList[2].eighth},
                {key:3,value:9.94,money:json.appointStakeList[2].ninth},
                {key:3,value:9.94,money:json.appointStakeList[2].tenth}
            ],
            //10
            [
                {key:4,value:9.94,money:json.appointStakeList[3].first},
                {key:4,value:9.94,money:json.appointStakeList[3].second},
                {key:4,value:9.94,money:json.appointStakeList[3].third},
                {key:4,value:9.94,money:json.appointStakeList[3].fourth},
                {key:4,value:9.94,money:json.appointStakeList[3].fifth},
                {key:4,value:9.94,money:json.appointStakeList[3].sixth},
                {key:4,value:9.94,money:json.appointStakeList[3].seventh},
                {key:4,value:9.94,money:json.appointStakeList[3].eighth},
                {key:4,value:9.94,money:json.appointStakeList[3].ninth},
                {key:4,value:9.94,money:json.appointStakeList[3].tenth}
            ],
            //11
            [
                {key:5,value:9.94,money:json.appointStakeList[4].first},
                {key:5,value:9.94,money:json.appointStakeList[4].second},
                {key:5,value:9.94,money:json.appointStakeList[4].third},
                {key:5,value:9.94,money:json.appointStakeList[4].fourth},
                {key:5,value:9.94,money:json.appointStakeList[4].fifth},
                {key:5,value:9.94,money:json.appointStakeList[4].sixth},
                {key:5,value:9.94,money:json.appointStakeList[4].seventh},
                {key:5,value:9.94,money:json.appointStakeList[4].eighth},
                {key:5,value:9.94,money:json.appointStakeList[4].ninth},
                {key:5,value:9.94,money:json.appointStakeList[4].tenth}
            ],
            //12
            [
                {key:6,value:9.94,money:json.appointStakeList[5].first},
                {key:6,value:9.94,money:json.appointStakeList[5].second},
                {key:6,value:9.94,money:json.appointStakeList[5].third},
                {key:6,value:9.94,money:json.appointStakeList[5].fourth},
                {key:6,value:9.94,money:json.appointStakeList[5].fifth},
                {key:6,value:9.94,money:json.appointStakeList[5].sixth},
                {key:6,value:9.94,money:json.appointStakeList[5].seventh},
                {key:6,value:9.94,money:json.appointStakeList[5].eighth},
                {key:6,value:9.94,money:json.appointStakeList[5].ninth},
                {key:6,value:9.94,money:json.appointStakeList[5].tenth}
            ],
            //13
            [
                {key:7,value:9.94,money:json.appointStakeList[6].first},
                {key:7,value:9.94,money:json.appointStakeList[6].second},
                {key:7,value:9.94,money:json.appointStakeList[6].third},
                {key:7,value:9.94,money:json.appointStakeList[6].fourth},
                {key:7,value:9.94,money:json.appointStakeList[6].fifth},
                {key:7,value:9.94,money:json.appointStakeList[6].sixth},
                {key:7,value:9.94,money:json.appointStakeList[6].seventh},
                {key:7,value:9.94,money:json.appointStakeList[6].eighth},
                {key:7,value:9.94,money:json.appointStakeList[6].ninth},
                {key:7,value:9.94,money:json.appointStakeList[6].tenth}
            ],
            //14
            [
                {key:8,value:9.94,money:json.appointStakeList[7].first},
                {key:8,value:9.94,money:json.appointStakeList[7].second},
                {key:8,value:9.94,money:json.appointStakeList[7].third},
                {key:8,value:9.94,money:json.appointStakeList[7].fourth},
                {key:8,value:9.94,money:json.appointStakeList[7].fifth},
                {key:8,value:9.94,money:json.appointStakeList[7].sixth},
                {key:8,value:9.94,money:json.appointStakeList[7].seventh},
                {key:8,value:9.94,money:json.appointStakeList[7].eighth},
                {key:8,value:9.94,money:json.appointStakeList[7].ninth},
                {key:8,value:9.94,money:json.appointStakeList[7].tenth}
            ],
            //15
            [
                {key:9,value:9.94,money:json.appointStakeList[8].first},
                {key:9,value:9.94,money:json.appointStakeList[8].second},
                {key:9,value:9.94,money:json.appointStakeList[8].third},
                {key:9,value:9.94,money:json.appointStakeList[8].fourth},
                {key:9,value:9.94,money:json.appointStakeList[8].fifth},
                {key:9,value:9.94,money:json.appointStakeList[8].sixth},
                {key:9,value:9.94,money:json.appointStakeList[8].seventh},
                {key:9,value:9.94,money:json.appointStakeList[8].eighth},
                {key:9,value:9.94,money:json.appointStakeList[8].ninth},
                {key:9,value:9.94,money:json.appointStakeList[8].tenth}
            ],
            //16
            [
                {key:10,value:9.94,money:json.appointStakeList[9].first},
                {key:10,value:9.94,money:json.appointStakeList[9].second},
                {key:10,value:9.94,money:json.appointStakeList[9].third},
                {key:10,value:9.94,money:json.appointStakeList[9].fourth},
                {key:10,value:9.94,money:json.appointStakeList[9].fifth},
                {key:10,value:9.94,money:json.appointStakeList[9].sixth},
                {key:10,value:9.94,money:json.appointStakeList[9].seventh},
                {key:10,value:9.94,money:json.appointStakeList[9].eighth},
                {key:10,value:9.94,money:json.appointStakeList[9].ninth},
                {key:10,value:9.94,money:json.appointStakeList[9].tenth}
            ],
        ];
        //冠亚组 表格数据
        $scope.table2 = [
            [{'key':'3','value':'41','money':json.commonStake.firstSecond3},{'key':'4','value':'41','money':json.commonStake.firstSecond4},{'key':'5','value':'21','money':json.commonStake.firstSecond5},{'key':'6','value':'21','money':json.commonStake.firstSecond6}],
            [{'key':'7','value':'12','money':json.commonStake.firstSecond7},{'key':'8','value':'12','money':json.commonStake.firstSecond8},{'key':'9','value':'10.3','money':json.commonStake.firstSecond9},{'key':'10','value':'10.3','money':json.commonStake.firstSecond10}],
            [{'key':'11','value':'8.3','money':json.commonStake.firstSecond11},{'key':'12','value':'10.3','money':json.commonStake.firstSecond12},{'key':'13','value':'10.3','money':json.commonStake.firstSecond13},{'key':'14','value':'12','money':json.commonStake.firstSecond14}],
            [{'key':'15','value':'12','money':json.commonStake.firstSecond15},{'key':'16','value':'21','money':json.commonStake.firstSecond16},{'key':'17','value':'21','money':json.commonStake.firstSecond17},{'key':'18','value':'41','money':json.commonStake.firstSecond18}],
            [{'key':'19','value':'12','money':json.commonStake.firstSecond19},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
            [{'key':'冠亚大','value':'2','money':json.commonStake.firstSecondBig},{'key':'冠亚小','value':'1.63','money':json.commonStake.firstSecondSmall},{'key':'冠亚单','value':'1.63','money':json.commonStake.firstSecondOdd},{'key':'冠亚双','value':'2','money':json.commonStake.firstSecondOdd}]
        ];
    }


    var url = '';
    if( $scope.userId === 'all'){ //总盘详情
        if($scope.type == 'byDate'){
            // /manager/stake/day/info?day=
            url = 'http://60.205.163.65:8080/manager/stake/day/info?day='+$scope.dateIssue;
        }
        if($scope.type == 'byIssue'){
            url = 'http://60.205.163.65:8080/manager/stake/racingnum/info?racingNum='+$scope.dateIssue;
        }
    }else{
        if($scope.type == 'byDate'){
            // /manager/user/{userId/stake/day/info?day=
            url = 'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/stake/day/info?day='+$scope.dateIssue;
        }
        if($scope.type == 'byIssue'){
            url = 'http://60.205.163.65:8080/manager/user/'+$scope.userId+'/stake/racingnum/info?racingNum='+$scope.dateIssue;
        }
    }



    initEncrypt(url,null);
    $http({
        url :  url,
        method : 'get'
    }).then(function(res){
        // //console.log(res,'详情结果');

        var resData = res.data;
        if(resData.result == 'NO_LOGIN'){
            $state.go('login');
            return;
        }
        if(resData.result=='ERROR'){
            alert(resData.message);
            return;
        }

        if($scope.type == 'byIssue'){
            $scope.lotteryRestut = resData.data.result ? resData.data.result.join('-'):'';
        }
        $scope.money = resData.data.stakeAmount;
        $scope.number = resData.data.stakeCount;
        $scope.fitloss = resData.data.incomeAmount;
        $scope.allfitloss = resData.data.deficitAmount;
        maketableDate(resData.data.stakeVo);

    },function(){
        alert('请求失败，请重试或缺失必要内容');
    });


}]);


//用户管理
myApp.controller('userCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allUserCtrl',['$scope','$http','$state','encrypt','localStorageService',function($scope,$http,$state,encrypt,localStorageService){
    $scope.text = "总盘用户管理";

    $scope.queryManagerId = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    // 获取 用户列表
    function initData(){
        initEncrypt('http://60.205.163.65:8080/manager',null);
        $http({
            url : 'http://60.205.163.65:8080/manager',
            method : 'get',
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.userArr = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;
        }, function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    initData();


    //启用
    $scope.enable = function(id){
        initEncrypt('http://60.205.163.65:8080/manager/'+id+'/status/enable',null);
        $http({
            url : 'http://60.205.163.65:8080/manager/'+id+'/status/enable',
            method : 'put'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result == 'ERROR'){
                alert(data.message);
            }
            if(data.result == 'SUCCESS'){
                alert('操作成功');
                initData();
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    };
    //禁用
    $scope.disable = function(id){
        initEncrypt('http://60.205.163.65:8080/manager/'+id+'/status/disable',null);
        $http({
            url : 'http://60.205.163.65:8080/manager/'+id+'/status/disable',
            method : 'put'
        }).then(function(res){
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result == 'ERROR'){
                alert(data.message);
            }
            if(data.result == 'SUCCESS'){
                alert('操作成功');
                initData();
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    };

    //修改
    $scope.modify = function(id){
        $scope.queryManagerId = id;
        $scope.operation = 'modify';
        $scope.modalTitle = '修改用户信息';
        $scope.nickname = '';
        $scope.password = '';
        $scope.repeatPwd = '';
    };
    //删除
    $scope.delete = function(id){
        $scope.queryManagerId = id;
        $scope.operation = 'delete';
        $scope.modalTitle = '删除用户';
    };

    $scope.addUser = function(){
        $scope.operation = 'add';
        $scope.modalTitle = '添加新用户';
        $scope.nickname = '';
        $scope.password = '';
        $scope.repeatPwd = '';
        $scope.username = '';
    };


    $scope.confirm = function(){
        if($scope.operation == 'modify'){
            //console.log('modify');
            //console.log($scope.nickname);
            //console.log($scope.password);
            //console.log($scope.repeatPwd);
            if($scope.password != $scope.repeatPwd){
                alert('两次密码不一致');
                return;
            }

            initEncrypt('http://60.205.163.65:8080/manager/'+$scope.queryManagerId,{
                nickName : $scope.nickname,
                password : $scope.password
            });
            $http({
                url : 'http://60.205.163.65:8080/manager/'+$scope.queryManagerId,
                method : 'put',
                data : {
                    nickName : $scope.nickname,
                    password : $scope.password
                }
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
        if($scope.operation == 'delete'){
            //console.log('delete');
            initEncrypt('http://60.205.163.65:8080/manager/'+$scope.queryManagerId,null);
            $http({
                url : 'http://60.205.163.65:8080/manager/'+$scope.queryManagerId,
                method : 'delete',
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
        if($scope.operation == 'add'){
            //console.log('adduser');
            //console.log($scope.nickname);
            //console.log($scope.username);
            //console.log($scope.password);
            //console.log($scope.repeatPwd);
            if($scope.password != $scope.repeatPwd){
                alert('两次密码不一致');
                return;
            }
            initEncrypt('http://60.205.163.65:8080/manager/'+$scope.queryManagerId,{
                nickName : $scope.nickname,
                password : $scope.password,
                userName : $scope.username,
            });
            $http({
                url : 'http://60.205.163.65:8080/manager/'+$scope.queryManagerId,
                method : 'post',
                data : {
                    nickName : $scope.nickname,
                    password : $scope.password,
                    userName : $scope.username,
                }
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });

        }
    };



}]).controller('otherUserCtrl',['$scope','$http','$state','localStorageService','encrypt',function($scope,$http,$state,localStorageService,encrypt){
    $scope.text = "分盘用户管理";

    $scope.queryNickName = '';
    $scope.queryNumber = '';

    $scope.queryUserId = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }


    // 获取 用户列表
    function initData(){
        initEncrypt('http://60.205.163.65:8080/manager/user?nickName='+$scope.queryNickName+'&userId='+$scope.queryNumber,null);
        $http({
            url : 'http://60.205.163.65:8080/manager/user?nickName='+$scope.queryNickName+'&userId='+$scope.queryNumber,
            method : 'get',
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.userArr = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;
        }, function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    initData();


    $scope.search = function(){
        //console.log($scope.searchName,$scope.searchNumber);
        $scope.queryNickName = $scope.searchName || '';
        $scope.queryNumber = $scope.searchNumber || '';

        initData();
    };

    $scope.modify = function(id){
        $scope.operation = 'modify';
        $scope.modalTitle = '修改用户信息';
        $scope.nickname = '';
        $scope.queryUserId = id;
    };

    $scope.delete = function(id){
        $scope.operation = 'delete';
        $scope.modalTitle = '删除用户';
        $scope.queryUserId = id;
    };

    $scope.addUser = function(){
        $scope.operation = 'add';
        $scope.modalTitle = '添加新用户';
        $scope.username = '';
        $scope.nickname = '';
        $scope.password = '';
        $scope.repeatPwd = '';
    };

    // $scope.setRobot = function(id){
    //     $scope.operation = 'setRobot';
    //     $scope.modalTitle = '设置机器人到期时间';
    //     $scope.expire = '';
    //     $scope.queryUserId = id;
    // };

    $scope.addSetRobot = function(id,title){
        $scope.operation = 'addSetRobot';
        $scope.modalTitle = title;
        $scope.expire = '';
        $scope.queryUserId = id;
        if(title == '添加机器人'){
            $scope.statusOperate = 'addRobot';
            $scope.clientsn = new UUID().id;
        }else{
            $scope.statusOperate = 'setRobot';
        }

    };

    $scope.userCanAble = function(id,flage){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+id+'/available',{
            isEnable : flage
        });
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+id+'/available',
            method : 'put',
            data : {
                isEnable : flage
            }
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result == 'ERROR'){
                alert(data.message);
            }
            if(data.result == 'SUCCESS'){
                initData();
            }
        }, function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    };


    $scope.robotCanAble = function(id,flage){
        initEncrypt('http://60.205.163.65:8080/manager/user/'+id+'/robot/available',{
            clientIsEnable : flage
        });
        $http({
            url : 'http://60.205.163.65:8080/manager/user/'+id+'/robot/available',
            method : 'put',
            data : {
                clientIsEnable : flage
            }
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(res.data.result == 'NO_LOGIN'){
                localStorageService.clearAll();
                $state.go('login');
                return;
            }
            if(data.result == 'ERROR'){
                alert(data.message);
            }
            if(data.result == 'SUCCESS'){
                initData();
            }
        }, function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    };

    // $scope.disableRoot = function(id){
    //     initEncrypt('http://60.205.163.65:8080/manager/user/'+id+'/robot/available',null);
    //     $http({
    //         url : 'http://60.205.163.65:8080/manager/user/'+id+'/robot/available',
    //         method : 'put',
    //     }).then(function(res){
    //         //console.log(res);
    //         var data = res.data;
    //         if(data.result == 'ERROR'){
    //             alert(data.message);
    //         }
    //         if(data.result == 'SUCCESS'){
    //             initData();
    //         }
    //     }, function(err){
    //         alert('请求失败，请重试或缺失必要内容');
    //     });
    // };

    //查看 clientsn
    $scope.lookSn = function(clientsn){
        $scope.lookClientSn = clientsn;
    }

    $scope.confirm = function(){
        if($scope.operation == 'modify'){
            //console.log('modify');
            //console.log($scope.nickname);

            if($scope.password != $scope.repeatPwd){
                alert('两次密码不一致');
                return;
            }

            initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.queryUserId,{
                nickName : $scope.nickname,
                password : $scope.password,
                //repassword : $scope.repeatPwd,
            });
            $http({
                url : 'http://60.205.163.65:8080/manager/user/'+$scope.queryUserId,
                method : 'put',
                data : {
                    nickName : $scope.nickname,
                    password : $scope.password,
                    //repassword : $scope.repeatPwd,
                }
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
        if($scope.operation == 'delete'){
            //console.log('delete');
            initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.queryUserId,null);
            $http({
                url : 'http://60.205.163.65:8080/manager/user/'+$scope.queryUserId,
                method : 'delete',
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
        if($scope.operation == 'add'){
            //console.log('adduser');
            //console.log($scope.nickname,$scope.username,$scope.password,$scope.repeatPwd);

            if($scope.password != $scope.repeatPwd){
                alert('两次密码不一致');
                return;
            }
            initEncrypt('http://60.205.163.65:8080/manager/user/',{
                nickName : $scope.nickname,
                password : $scope.password,
                //repassword : $scope.repeatPwd,
                userName : $scope.username,
            });
            $http({
                url : 'http://60.205.163.65:8080/manager/user/',
                method : 'post',
                data : {
                    nickName : $scope.nickname,
                    password : $scope.password,
                    //repassword : $scope.repeatPwd,
                    userName : $scope.username,
                }
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
        if($scope.operation == 'addSetRobot'){
            //console.log('addSetRobot',$scope.expire);
            // if( $scope.statusOperate == 'addRobot'){
            //
            // }

            initEncrypt('http://60.205.163.65:8080/manager/user/'+$scope.queryUserId+'/robot',{
                clientSn : $scope.clientsn,
                clientExpireDate : new Date($scope.expire).getTime()
            });
            $http({
                url : 'http://60.205.163.65:8080/manager/user/'+$scope.queryUserId+'/robot',
                method : 'post',
                data : {
                    clientSn : $scope.clientsn,
                    clientExpireDate : new Date($scope.expire).getTime()
                }
            }).then(function(res){
                //console.log(res);
                var data = res.data;
                if(res.data.result == 'NO_LOGIN'){
                    localStorageService.clearAll();
                    $state.go('login');
                    return;
                }
                if(data.result == 'ERROR'){
                    alert(data.message);
                }
                if(data.result == 'SUCCESS'){
                    initData();
                }
            }, function(err){
                alert('请求失败，请重试或缺失必要内容');
            });
        }
    };
}]);

//顶部导航的指令
myApp.directive('navHeader',function() {
    return {
        restrict : 'AE',
        scope : {
            nowSelsect : '@selectActive',
            realtimeSelsect : '@realtimeActive'
        },
        templateUrl : './templates/nav/nav.html',
    };
});

//历史回退
myApp.directive('goback',function(){
    return {
        restrict : 'A',
        link : function(scope,elem){
            $(elem).on('click',function(){
                window.history.back();
            });
        }
    };
});

// 切换 class active 指令
myApp.directive('tabActive',function(){
    return {
        restrict : 'A',
        link : function(scope,elem,attr){
            $(elem).on('click',function(ev){
                $(elem).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        }
    };
});


//拼接加密算法
myApp.factory('encrypt', ['$location', 'sha1', function($location, sha1) {

    function getUrlInfo(url,bodyQuery) {
        var arrUrl = url.split("//");
        var queryObj = {};
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);
        var path = null;
        //console.log(relUrl,'relUrl');

        if (relUrl.indexOf("?") != -1) {
            path = relUrl.split("?")[0];
        }else{
            path = relUrl;
        }
        if (url.indexOf("?") != -1) {
            var searchStr = '?'+relUrl.split("?")[1];
            var str = searchStr.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                queryObj[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return {url: url, domain: arrUrl[1].substring(0,start), path: path, searchObj:queryObj,params:bodyQuery};
    }

    return {
        getAuthor: function(url, bodyQuery,secretKey) {
            var urlObj = getUrlInfo(url,bodyQuery);
            //console.log(urlObj,'urlObj');
            //return;
            if(angular.isObject(urlObj.params)){
                urlObj.searchObj.requestBody = JSON.stringify(urlObj.params);
            }
            var keyArr = [];
            angular.forEach(urlObj.searchObj, function(val, key) {
                keyArr.push(key);
            });
            keyArr.sort();
            ////console.log(keyArr);
            var keyStr = '';
            angular.forEach(keyArr, function(val, index) {
                keyStr += urlObj.searchObj[val];
            });
            //console.log(urlObj.path + keyStr + secretKey,'加密的字串');
            //console.log(secretKey,'secretKey');
            return sha1.hash(urlObj.path + keyStr + secretKey).toUpperCase();
        }
    };
}]);

//loading
myApp.directive('loading',['$http' ,function ($http){
    return {
        restrict: 'A',
        link: function (scope, elm, attrs){
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading,function(v){
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
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
                ////console.log(localStorageService.get('Authorization'),'location');
                config.headers.Authorization = localStorageService.get('Authorization');
                config.headers.Accesskey = localStorageService.get('Accesskey');
            }
            return config;
        },
        // 请求发出时出错
        requestError: function(err) {
            ////console.log('request config error');
            return $q.reject(err);
        },
        // 成功返回了响应
        response: function(res) {
            return res;
        },
        // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
        responseError: function(err) {
            ////console.log('response config error');
            return $q.reject(err);
        }
    };
}]);


//时间格式化
myApp.filter('toMinSec', function() {
    return function(time) {
        if(time<0){
            return '00:00';
        }
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
    };
});

//过滤数据
myApp.filter('splitArrFilter',function(){
    return function(o){
        if(typeof o == 'object'){
            var str ='';
            for(var i=0;i<o.length;i++){
                if(i === 0){
                    str += o[i];
                }else{
                    str += '<span class="paddingTips">|</span>'+o[i];
                }
            }
            return str;
        }else{
            return o;
        }
    };
});
