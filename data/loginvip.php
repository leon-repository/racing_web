<?php

    $data = $_POST;

    //echo var_dump($data);

    $arr = array(
        'Accesskey' => 'aaa',
        'secretKey' => 'bbb',
        'type' => 'vip'    //type 用户类型
    );


    echo json_encode($arr);


 ?>
