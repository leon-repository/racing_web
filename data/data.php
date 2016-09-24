<?php
/*
    $json = '{
      "result" : "SUCCESS",
      "data" : {
        "racingNum" : "201609020172",//当前比赛期号
        "preRacingNum" : "201609020171",//上一场比赛期号
        "result" : [ 3, 4, 7, 2, 6, 5, 8, 10, 1, 9 ],//当前比赛结果
        "preResult" : [ 9, 6, 7, 5, 4, 1, 2, 10, 8, 3 ],//上期比赛结果
        "endStakeTime" : 184000,//封盘倒计时
        "startRacingTime" : 244000,//开奖倒计时
        "stage" : 1,//当前所处阶段，1：下注阶段    2：计算阶段    3：修改比赛结果阶段    4：停止操作阶段
        "todayIncome" : 1000.23//今日盈亏金额
      },
      "message" : null
    }';

    {
      "result" : "ERROR",
      "data" : null,
      "message" : "暂无比赛"
    }
*/
  $json = '{
    "result" : "SUCCESS",
    "data" : {
        "racingNum" : "201609020172",
        "preRacingNum" : "201609020171",
        "result" : [  2, 4, 9, 5, 6 ,8, 10, 3, 1, 7],
        "preResult" : [ 9, 6, 7, 5, 4, 1, 2, 10, 8, 3 ],
        "endStakeTime" : 184000,
        "startRacingTime" : 244000,
        "stage" : 1,
        "todayIncome" : 1000.23,
        "nowStatus":"修改比赛结果"
    },
    "message" : "暂无比赛结果"
  }';

  $str = '{
  "result" : "SUCCESS",
  "data" : [ {
    "day" : "2016-08-22 星期一",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-23 星期二",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-24 星期三",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-25 星期四",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-26 星期五",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-27 星期六",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-28 星期日",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "上周",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-29 星期一",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-30 星期二",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-08-31 星期三",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-09-01 星期四",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-09-02 星期五",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-09-03 星期六",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0,
    "totalDeficitAmount" : 0,
    "totalCommissionAmount" : 0
  }, {
    "day" : "2016-09-04 星期日",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0.00,
    "totalDeficitAmount" : 0.00,
    "totalCommissionAmount" : 0
  }, {
    "day" : "本周",
    "totalStakeCount" : 0,
    "totalStakeAmount" : 0.00,
    "totalDeficitAmount" : 0.00,
    "totalCommissionAmount" : 0
  } ],
  "message" : null
}';

  echo $json;
/*
  $arr = array(
      'result' => 'SUCCESS',
      'data' => array(
          'racingNum' => '201609010137',
          'preRacingNum'=> '201609010137',
          'result' => [ 6, 2, 7, 5, 10, 4, 8, 3, 1, 9 ],
          'preResult' => [ 5, 10, 4, 8,6, 2, 7, 3, 1, 9 ],
          'startTime' => 1472732820000,
          'serverTime' => 1472732820000,
          'endStakeTime' => 1472732760000,
          'startModifyTime' => 1472732780000,
          'endModifyTime' => 1472732800000,
          'isCanStake' => true,
          'isCanModifyResult' =>false
      )
  )
    echo json_decode($arr);
  */




 ?>
