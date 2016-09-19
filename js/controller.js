//用户登录
myApp.controller('loginCtrl',['$scope','$http','localStorageService',function($scope,$http,localStorageService){
    //登录请求获取 token
    $scope.loginSubmit = function(){
        console.log($scope.username);
        console.log($scope.password);
        console.log($scope.remember);
        $http({
            url : '',
            method : 'post',
            data : {}
        }).then(function(res){
            if(localStorageService.isSupported) {
                localStorageService.set('token','aa')
            }else{
                alert('您的浏览器版本太低，请升级高版本浏览器');
            }
        },function(err){
            console.log(err);
        });
    }
}]);


//实时开奖
myApp.controller('statusCtrl',['$scope',function($scope){
    $scope.text = "当前开奖情况";
}]).controller('compluteCtrl',['$scope',function($scope){
    $scope.text = "计算比赛结果";
}]).controller('modifyCtrl',['$scope',function($scope){
    $scope.text = "修改比赛结果";
}]);

//开奖列表
myApp.controller('lotterylistCtrl',['$scope','$http',function($scope,$http){
    $scope.text = '开奖列表页';

    $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}]

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

}]);



//积分管理
myApp.controller('applyCtrl',['$scope',function($scope){
    $scope.text = "分盘申请上下分列表";
}]).controller('listCtrl',['$scope',function($scope){
    $scope.text = "分盘积分列表";
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
