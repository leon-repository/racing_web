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
            console.log(res);
            var data = res.data;
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
            console.log(err);
        });
    };
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
        [{'key':'3','value':'41','money':'100'},{'key':'4','value':'41','money':'100'},{'key':'5','value':'21','money':'100'},{'key':'6','value':'21','money':'100'}],
        [{'key':'7','value':'12','money':'100'},{'key':'8','value':'12','money':'100'},{'key':'9','value':'10.3','money':'100'},{'key':'10','value':'10.3','money':'100'}],
        [{'key':'11','value':'8.3','money':'100'},{'key':'12','value':'10.3','money':'100'},{'key':'13','value':'10.3','money':'100'},{'key':'14','value':'12','money':'100'}],
        [{'key':'15','value':'12','money':'100'},{'key':'16','value':'21','money':'100'},{'key':'17','value':'21','money':'100'},{'key':'18','value':'41','money':'100'}],
        [{'key':'19','value':'12','money':'100'},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
        [{'key':'冠亚大','value':'2','money':'100'},{'key':'冠亚小','value':'1.63','money':'100'},{'key':'冠亚单','value':'1.63','money':'100'},{'key':'冠亚双','value':'2','money':'100'}]
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

    console.log('res secretKey: '+ localStorageService.get('secretKey'));
    console.log('res Accesskey: '+localStorageService.get('Accesskey'));
    var authoriza = encrypt.getAuthor(urlObj,localStorageService.get('secretKey'));
    localStorageService.set('Authorization',authoriza);
    localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
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
        });
    };


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
    };

}]);



//积分管理
myApp.controller('integralCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('applyCtrl',['$scope','$http',function($scope,$http){
    $scope.text = "分盘申请上下分列表";

    //默认查询状态
    $scope.queryStatus = '';
    $scope.queryPage = 1;

    $http({
        url : 'http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,
        method : 'get',
    }).then(function(res){
        console.log(res);
        var data = res.data;
        // $scope.tableData = [
        //     {"id":1,"appPoints":1,"appComment":"1","appTime":1475677107000,"operationComment":"aaaaaa","operationTime":1475939822000,"status":"AUDIT","userId":1,"userNickName":"测试分盘用户1","userUserName":null},
        //     {"id":2,"appPoints":2,"appComment":"1","appTime":1475677107000,"operationComment":"aaaaaa","operationTime":1475939822000,"status":"REJECT","userId":1,"userNickName":"测试分盘用户1","userUserName":null},
        //     {"id":3,"appPoints":3,"appComment":"1","appTime":1475677107000,"operationComment":"aaaaaa","operationTime":1475939822000,"status":"CANCEL","userId":1,"userNickName":"测试分盘用户1","userUserName":null},
        //     {"id":4,"appPoints":4,"appComment":"1","appTime":1475677107000,"operationComment":"aaaaaa","operationTime":1475939822000,"status":"UNTREATED","userId":1,"userNickName":"测试分盘用户1","userUserName":null},
        //     {"id":5,"appPoints":5,"appComment":"1","appTime":1475677107000,"operationComment":"aaaaaa","operationTime":1475939822000,"status":"UNTREATED","userId":1,"userNickName":"测试分盘用户1","userUserName":null}
        // ];

        $scope.tableData = data.data;
        //分页
        $scope.currentPage = data.page;
        $scope.pageSize = data.pageSize;
        $scope.total = data.totalPage;

    }, function(err){
        console.log(err,'获取用户管理页面失败');
    });

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

        $http.get('http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.page).then(function(res){
            console.log(res);
            var data = res.data;
            //重绘表格
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;
        },function(){
            alert('请求失败，请重试');
        });
    }

    //页面跳转
    $scope.goPage = function(page){
        console.log(page);
        $scope.queryPage = page;
        $http({
            url : 'http://60.205.163.65:8080/manager/pointsapp/status?status='+$scope.queryStatus+'&page='+$scope.queryPage,
            method : 'get',
        }).then(function(res){
            console.log(res);
            var data = res.data;
            //重绘表格
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;
        },function(){
            alert('请求失败，请重试');
        });
    };

    $scope.toRight = function(status,id) {
        //console.log(status,id);
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
        //console.log(status,$scope.modalContent,$scope.modalID,'modal');
        switch (status) {
            case 'ok':
                var url = '/manager/pointsapp/'+$scope.modalID+'/status/audit';
                break;
            case 'danger':
                var url = '/manager/pointsapp/'+$scope.modalID+'/status/reject';
                break;
            case 'cancel':
                var url = '/manager/pointsapp/'+$scope.modalID+'/status/cancel';
                break;
        }

        $http({
            url : 'http://60.205.163.65:8080'+url,
            method : 'put',
            data : {
                comments : $scope.modalContent
            }
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
                //重绘表格
                $scope.tableData = data.data;
                //分页
                $scope.currentPage = data.page;
                $scope.pageSize = data.pageSize;
                $scope.total = data.totalPage;
            }
        },function(){
            alert('请求失败，请重试');
        });

    };

}]).controller('listCtrl',['$scope','$http',function($scope,$http){
    $scope.text = "分盘积分列表";

    $scope.queryNickName = '';
    $scope.queryUserId = '';
    $scope.queryPage = 1;


    $http({
        url : 'http://60.205.163.65:8080/manager/user/points?nickName='+$scope.queryNickName+'&userId='+$scope.queryUserId+'&page='+$scope.queryPage,
        method : 'get',
    }).then(function(res){
        console.log(res);
        var data = res.data;

        $scope.tableData = data.data;
        //分页
        $scope.currentPage = data.page;
        $scope.pageSize = data.pageSize;
        $scope.total = data.totalPage;

    }, function(err){
        console.log(err,'获取用户管理页面失败');
    });

    //分页跳转
    $scope.goPage = function(page){
        console.log(page);
    };


    //搜索
    $scope.search = function(){
        console.log('search list');
        console.log($scope.searchName,$scope.searchId);
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
        switch (status) {
            case 'add':
                var url = '/manager/add/points/user/'+$scope.queryUserId;
                break;
            case 'reduce':
                var url = '/manager/subtract/points/user/'+$scope.queryUserId;
                break;
        }

        console.log(status, url, $scope.money);
        $http({
            url : 'http://60.205.163.65:8080'+url,
            method : 'put',
            data : {
                points : $scope.money
            }
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
                //重绘表格
                $scope.tableData = data.data;
                //分页
                $scope.currentPage = data.page;
                $scope.pageSize = data.pageSize;
                $scope.total = data.totalPage;
            }
        },function(){
            alert('请求失败，请重试');
        });

    };
}]);
//查看积分详情
myApp.controller('integralDetailCtrl',['$scope','$http','$stateParams','$sanitize',function($scope,$http,$stateParams,$sanitize){
    //console.log($stateParams);
    $scope.queryUserId = $stateParams.userId;
    $scope.queryPage = 1;

    $scope.title = '当前的分盘名称为 '+$stateParams.userName;


    $http({
        url : 'http://60.205.163.65:8080/manager/user/'+$scope.queryUserId+'/account/record?page='+$scope.queryPage,
        method : 'get',
    }).then(function(res){
        var data = res.data;
        if(data.result=='ERROR'){
            alert(data.message);
        }
        if(data.result=='SUCCESS'){
            alert('操作成功');
            //重绘表格
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;
        }
    },function(){
        alert('请求失败，请重试');
    });

    //分页
    $scope.goPage = function(page){
        console.log(page);
        $scope.queryPage = page;
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
}]).controller('allPlCtrl',['$scope','$http',function($scope,$http){
    $scope.text = "总体盈亏报表";


    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';


    $scope.selectActive = 'byDate';

    function byDate(){
        $http({
            url : 'http://60.205.163.65:8080/manger/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
        });
    }
    function byIssue(){
        $http({
            url : 'http://60.205.163.65:8080/manger/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'racingNum='+$scope.issue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
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
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = $scope.startTime;
        $scope.queryEndDate = $scope.endTime;
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = $scope.startTimeIssue;
        $scope.queryEndDate = $scope.endTimeIssue;
        byIssue();
    };


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
        if($scope.selectActive = 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';

            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryPage = 1;
            byIssue();
        }
    };


}]).controller('otherPlCtrl',['$scope',function($scope){
    $scope.text = "分盘盈亏报表";
    $scope.tableData = null;
    $scope.selectActive = 'byDate';


    $scope.userId = '';
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.issue = '';


    $scope.selectOptions = [
        {key:'0',value:'选择分盘名称'},
        {key:'1',value:'分盘one'},
        {key:'2',value:'分盘two'},
        {key:'3',value:'分盘three'},
    ];
    $scope.selectName = $scope.selectOptions[0];

    $scope.selectChange = function(){
        console.log($scope.selectName);
        $scope.userId = $scope.selectName.key;
        if($scope.selectActive = 'byDate'){
            byDate();
        }else{
            byIssue();
        }


    }

    function byDate(){
        $http({
            url : 'http://60.205.163.65:8080/manger/user/'+$scope.userId+'/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
        });
    }
    function byIssue(){
        $http({
            url : 'http://60.205.163.65:8080/manger/user/'+$scope.userId+'/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'racingNum='+$scope.issue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
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
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = $scope.startTime;
        $scope.queryEndDate = $scope.endTime;
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = $scope.startTimeIssue;
        $scope.queryEndDate = $scope.endTimeIssue;
        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
        if($scope.selectActive = 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';

            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryPage = 1;
            byIssue();
        }
    };
}]);


//押注报表
myApp.controller('betCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allBetCtrl',['$scope','$http',function($scope,$http){
    $scope.text = "总体押注报表";
    $scope.selectActive = 'byDate';

    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.issue = '';

    function byDate(){
        $http({
            url : 'http://60.205.163.65:8080/manger/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
        });
    }
    function byIssue(){
        $http({
            url : 'http://60.205.163.65:8080/manger/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'racingNum='+$scope.issue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            $scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试')
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
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = $scope.startTime;
        $scope.queryEndDate = $scope.endTime;
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = $scope.startTimeIssue;
        $scope.queryEndDate = $scope.endTimeIssue;
        byIssue();
    };


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
        if($scope.selectActive = 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };
    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';

            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryPage = 1;
            byIssue();
        }
    };

}]).controller('otherBetCtrl',['$scope',function($scope){
    $scope.text = "分盘押注报表";

    $scope.selectActive = 'byDate';
    // 表格数据格式
    $scope.tableData = [
        {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]},
        {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]}
    ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
    };

    //分页
    $scope.currentPage = 1;
    //$scope.pageSize = 5;  //每页显示多少
    $scope.total = 100;
    $scope.goPage = function(page){
        console.log(page);
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';


            //分页
            $scope.currentPage = 1;
            //$scope.pageSize = 5;  //每页显示多少
            $scope.total = 70;
            $scope.goPage = function(page){
                console.log(page);
            };
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';

            //分页
            $scope.currentPage = 30;
            //$scope.pageSize = 5;  //每页显示多少
            $scope.total = 100;
            $scope.goPage = function(page){
                console.log(page);
            };
        }
    };

}]).controller('betDetailCtrl',['$scope','$stateParams',function($scope,$stateParams){
    console.log($stateParams.type);
    $scope.type = $stateParams.type;
    $scope.dateIssue = $stateParams.item1;
    // ....
    $scope.lotteryRestut = '12445555';
    $scope.money = 1000;
    $scope.number = 34;
    $scope.fitloss = 23;
    $scope.allfitloss = 43;



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
        [{'key':'3','value':'41','money':'100'},{'key':'4','value':'41','money':'100'},{'key':'5','value':'21','money':'100'},{'key':'6','value':'21','money':'100'}],
        [{'key':'7','value':'12','money':'100'},{'key':'8','value':'12','money':'100'},{'key':'9','value':'10.3','money':'100'},{'key':'10','value':'10.3','money':'100'}],
        [{'key':'11','value':'8.3','money':'100'},{'key':'12','value':'10.3','money':'100'},{'key':'13','value':'10.3','money':'100'},{'key':'14','value':'12','money':'100'}],
        [{'key':'15','value':'12','money':'100'},{'key':'16','value':'21','money':'100'},{'key':'17','value':'21','money':'100'},{'key':'18','value':'41','money':'100'}],
        [{'key':'19','value':'12','money':'100'},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
        [{'key':'冠亚大','value':'2','money':'100'},{'key':'冠亚小','value':'1.63','money':'100'},{'key':'冠亚单','value':'1.63','money':'100'},{'key':'冠亚双','value':'2','money':'100'}]
    ];


}]);


//用户管理
myApp.controller('userCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allUserCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "总盘用户管理";



    //测试代码，后期删除  ************  注意删除依赖
    // url 参数
    var urlObj = {
        url : 'http://60.205.163.65:8080/manager/user',
        domain : 'http://60.205.163.65:8080',
        path : '/manager/user',
        searchObj : {},
        params : null
    };
    var authoriza = encrypt.getAuthor(urlObj,localStorageService.get('secretKey'));
    localStorageService.set('Authorization',authoriza);
    localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
    console.log(authoriza,'set');
    //测试代码，后期删除  ************


    // 获取 用户列表
    $http({
        url : urlObj.url,
        method : 'get',
    }).then(function(res){
        console.log(res);
        var data = res.data;
        $scope.userArr = data.data;

    }, function(err){
        console.log(err,'获取用户管理页面失败');
    });


    $scope.modify = function(){
        $scope.operation = 'modify';
        $scope.modalTitle = '修改用户信息';
        $scope.nickname = '';
        $scope.password = '';
        $scope.repeatPwd = '';
    };

    $scope.delete = function(){
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
            console.log('modify');
            console.log($scope.nickname);
            console.log($scope.password);
            console.log($scope.repeatPwd);

            // url 参数
            var urlObj = {
                url : 'http://60.205.163.65:8080/manager/user/{userId}',
                domain : 'http://60.205.163.65:8080',
                path : '/manager/user/{userId}',
                searchObj : {nickName:$scope.nickname},
                params : null
            };
            $http({
                url : urlObj.url,
                method : 'put',
                data : {}
            }).then(function(res){
                console.log(res);
            }, function(err){
                console.log(err,'获取用户管理页面失败');
            });
        }
        if($scope.operation == 'delete'){
            console.log('delete');
        }
        if($scope.operation == 'add'){
            console.log('adduser');
            console.log($scope.nickname);
            console.log($scope.username);
            console.log($scope.password);
            console.log($scope.repeatPwd);


            $http({
                url : 'http://60.205.163.65:8080/manager/user',
                method : 'get',
            }).then(function(res){
                console.log(res);
            }, function(err){
                console.log(err,'获取用户管理页面失败');
            });

        }
    };



}]).controller('otherUserCtrl',['$scope',function($scope){
    $scope.text = "分盘用户管理";

    $scope.search = function(){
        console.log($scope.searchName,$scope.searchId);
    };

    $scope.modify = function(){
        $scope.operation = 'modify';
        $scope.modalTitle = '修改用户信息';
        $scope.nickname = '';
    };

    $scope.delete = function(){
        $scope.operation = 'delete';
        $scope.modalTitle = '删除用户';
    };

    $scope.addUser = function(){
        $scope.operation = 'add';
        $scope.modalTitle = '添加新用户';
        $scope.clientsn = '';
        $scope.expire = '';
    };

    $scope.setRobot = function(){
        $scope.operation = 'setRobot';
        $scope.modalTitle = '设置机器人到期时间';
        $scope.expire = '';
    };

    $scope.addRobot = function(){
        $scope.operation = 'addRobot';
        $scope.modalTitle = '添加机器人';
        $scope.expire = '';
    };


    $scope.confirm = function(){
        if($scope.operation == 'modify'){
            console.log('modify');
            console.log($scope.nickname);
        }
        if($scope.operation == 'delete'){
            console.log('delete');
        }
        if($scope.operation == 'add'){
            console.log('adduser');
            console.log($scope.clientsn);
            console.log($scope.expire);
        }
        if($scope.operation == 'addRobot'){
            console.log('addRobot',$scope.expire);
        }
        if($scope.operation == 'setRobot'){
            console.log('setRobot',$scope.expire);
        }
    };
}]);
