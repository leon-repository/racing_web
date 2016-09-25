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
    }
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
            username : $scope.username,
            password : $scope.password,
            remember : $scope.remember
        };
        $http({
            url : './data/loginvip.php',
            method : 'post',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            },
            data: $.param(params)
        }).then(function(res){
            console.log(res);

            var userType = true; // 用户的级别

            $rootScope.username = $scope.username;
            if(localStorageService.isSupported) {
                localStorageService.set('Accesskey',res.Accesskey);
                localStorageService.set('secretKey',res.secretKey);
                localStorageService.set('username',$scope.username);
                localStorageService.set('userType',userType);
            }else{
                alert('您的浏览器版本太低，请升级高版本浏览器');
            }

            $state.go('realtime');


        },function(err){
            console.log(err);
        });
    }
}]);


//实时开奖
myApp.controller('realtimeCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','encrypt','localStorageService',function($scope,$rootScope,$http,$timeout,$filter,$state,encrypt,localStorageService){

    //1-10 表格数据
    $scope.table1 = [
        //1
        [
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'}
        ],
        //2
        [
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'}
        ],
        //3
        [
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'}
        ],
        //4
        [
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'}
        ],
        //5
        [
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //6
        [
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //7
        [
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'}
        ],
        //8
        [
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'}
        ],
        //9
        [
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'}
        ],
        //10
        [
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'}
        ],
        //11
        [
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'}
        ],
        //12
        [
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'}
        ],
        //13
        [
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'}
        ],
        //14
        [
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'}
        ],
        //15
        [
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'}
        ],
        //16
        [
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'}
        ],
    ];


    //冠亚组 表格数据
    $scope.table2 = [
        [{'key':'3','value':'41'},{'key':'4','value':'41'},{'key':'5','value':'21'},{'key':'6','value':'21'}],
        [{'key':'7','value':'12'},{'key':'8','value':'12'},{'key':'9','value':'10.3'},{'key':'10','value':'10.3'}],
        [{'key':'11','value':'8.3'},{'key':'12','value':'10.3'},{'key':'13','value':'10.3'},{'key':'14','value':'12'}],
        [{'key':'15','value':'12'},{'key':'16','value':'21'},{'key':'17','value':'21'},{'key':'18','value':'41'}],
        [{'key':'19','value':'12'},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
        [{'key':'冠亚大','value':'2'},{'key':'冠亚小','value':'1.63'},{'key':'冠亚单','value':'1.63'},{'key':'冠亚双','value':'2'}]
    ];


    //拖拽配置项 jQuery ui
    $scope.sortableOptions = {
        axis: "x"
    };

    //未登录先登录
    if(!localStorageService.get('username')){
        $state.go('login');
        return;
    }

    //每次请求的 url
    var urlObj = {
        url : './data/data.php',
        domain : 'http://120.26.75.31:8080',
        path : '/data/data.php',
        searchObj : {},
        params : null
    };

    //修改比赛结果的url
    var modifyUrl = 'http://192.168.5.109:8080/stake/result';

    var modifyflag = true;

    //全局配置控制
    //var config = {
        // racingNum : '',  //本次期号
        // setInterval : 2000,  //多少时间请求一次
        // url : 'http://192.168.5.109:8080/stake/config', //实时请求url
        //yazhuUrl : 'http://192.168.5.109:8080/stake/invoke',  //押注url
        //modifyUrl : 'http://192.168.5.109:8080/stake/result?racingNum=',
        //newflag : true,  //是否为新一轮开始
        //stage : false  //是否所处于修改结果阶段，控制重复渲染
    //};

    var authoriza = encrypt.getAuthor(urlObj,localStorageService.get('secretKey'));
    localStorageService.set('Authorization',authoriza);
    localStorageService.set('Accesskey',localStorageService.get('Accesskey'))
    console.log(authoriza,'set');


    $timeout.cancel($rootScope.timer);
    function action(){
        $http({
            url : urlObj.url,
            method : 'get',
            dataType : 'json',
        }).then(function(res){
            //console.log(res.data,'res');
            var resData = res.data;

            var json = resData.data;
            $scope.racingNum = json.racingNum;
            $scope.stopTime= $filter('toMinSec')(json.endStakeTime);
            $scope.startTime = $filter('toMinSec')(json.startRacingTime);
            $scope.todayIncome = json.todayIncome;
            $scope.preResult = json.preResult;
            $scope.nowStatus = json.nowStatus;
            $scope.preRacingNum = json.preRacingNum;

            // if(resData.result==='验签失败'){
            //     $state.go('login');
            //     return;
            // }

            if(resData.result==='ERROR'){
                console.log('暂无比赛结果');

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
                console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;

                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
                console.log('计算最优结果中..');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = true;
                $scope.modifying = false;
                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 3){ //改比赛结果
                console.log('修改比赛结果');
                // config.racingNum = resData.data.racingNum;
                // $('.toast').hide();
                // $('.table-box').addClass('disabled');
                // $('.notice-info').html('现在可以修改比赛结果');
                //modifyResult(resData.data.result);
                // return;

                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
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
                console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            console.log(err);
        });
        $rootScope.timer = $timeout(action,3000);
    }
    $rootScope.timer = $timeout(action,3000);



    //修改比赛结果
    $scope.modifyReslut = function(){
        console.log($scope.arrResult,'drag end');
        return;
        $http({
            url : modifyUrl,
            method : 'put',
            dataType : 'json',
            data : {'racingNum':$scope.racingNum,racingResult:$scope.arrResult}
        }).then(function(res){
            console.log(res,'modifyReslut');
        },function(err){
            console.log(err);
            $scope.modifyNotice = '请求失败请重试';
        })
    }


}]);

//开奖列表
myApp.controller('lotterylistCtrl',['$scope','$http',function($scope,$http){
    $scope.text = '开奖列表页';

    // $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}]

    /*
    // var params = $.param({
    //     email: 'blue@qq.com',
    //     password: '123456'
    // });
    $http({
        url : './data/lotterylist.php',
        method : 'POST',
        // headers : {
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        // },
        //data : params
    }).then(function(res){
        if(res.status==200){
            $scope.tableRows = res.data;
        }
    },function(err){
        console.log(err);
    });
    */

    $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}];


    $scope.currentPage = 30;
    //$scope.pageSize = 5;  //每页显示多少
    $scope.total = 100;
    $scope.goPage = function(a,b){
        console.log(a,b);
    }

}]);



//积分管理
myApp.controller('integralCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('applyCtrl',['$scope','$sanitize',function($scope,$sanitize){
    $scope.text = "分盘申请上下分列表";

    $scope.tableData = [
        {'code':1,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'ok'},
        {'code':2,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'danger'},
        {'code':3,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'ee','ff':'cancel'},
    ];

    //分页
    $scope.currentPage = 30;
    //$scope.pageSize = 5;  //每页显示多少
    $scope.total = 100;
    $scope.goPage = function(page){
        console.log(page);
    };

    $scope.toRight = function(item) {
        console.log(item);
        $scope.modalContent = '';
        switch (item) {
            case 'ok':
                $scope.modalTitle = '批准';
                $scope.modalStatus = 'ok';
                break;
            case 'danger':
                $scope.modalTitle = '拒绝';
                $scope.modalStatus = 'danger';
                break;
            case 'cancel':
                $scope.modalTitle = '取消';
                $scope.modalStatus = 'cancel';
                break;
        }
    };

    //确认发送数据
    $scope.confirm = function(status) {
        console.log(status,$scope.modalContent,'modal');
    };

}]).controller('listCtrl',['$scope',function($scope){
    $scope.text = "分盘积分列表";

    //分页
    $scope.currentPage = 30;
    //$scope.pageSize = 5;  //每页显示多少
    $scope.total = 100;
    $scope.goPage = function(page){
        console.log(page);
    };

    $scope.tableData = [
        {'code':1,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'add'},
        {'code':2,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'reduce'},
        {'code':3,'aa':'aa','bb':'bb','cc':'cc','dd':'dd','ee':'detail'},
    ];

    //弹层
    $scope.toModal = function(item){
        $scope.money = '';
        if(item == 'add'){
            $scope.modalTitle = '加积分';
            $scope.modalStatus = 'add';
        }
        if(item == 'reduce'){
            $scope.modalTitle = '减积分';
            $scope.modalStatus = 'reduce';
        }
    }
    // 弹层确定
    $scope.confirm = function(status){
        console.log(status, $scope.money);
    }
}]);
//查看积分详情
myApp.controller('integralDetailCtrl',['$scope','$stateParams','$sanitize',function($scope,$stateParams,$sanitize){
    console.log($stateParams);

    $scope.title = $stateParams.item1+'==='+ $stateParams.item2;

    $scope.tableData = [
        {'code':1,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]},
        {'code':2,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]}
    ];

}]);




//盈亏报表
myApp.controller('allPlCtrl',['$scope',function($scope){
    $scope.text = "总体盈亏报表";
}]).controller('otherPlCtrl',['$scope',function($scope){
    $scope.text = "其他盈亏报表";
}]);


//押注报表
myApp.controller('allBetCtrl',['$scope',function($scope){
    $scope.text = "总体押注报表";
}]).controller('otherBetCtrl',['$scope',function($scope){
    $scope.text = "其他押注报表";
}]);


//用户管理
myApp.controller('allUserCtrl',['$scope',function($scope){
    $scope.text = "总盘用户管理";
}]).controller('otherUserCtrl',['$scope',function($scope){
    $scope.text = "分盘用户管理";
}]);
