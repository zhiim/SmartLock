<?php

include_once('class/wxLoginClass.php');
include('connectDB.php');

$code = $_GET['code'];
$avatarUrl = $_GET['avatarUrl'];
$nickName = $_GET['nickName'];
$city = $_GET['city'];

$login = new WXLogin();
$user = $login->login($code);

// 不明所以
$t = json_encode($user);
$user = json_decode($t);

/*
$json = '{"session_key":"jwP4\/n1IDgQxUvSMBDd8cw==","openid":"o-H1-5aEk-GunGzRr4Fx_s2ag3zE"}';
$user = json_decode($json);
*/

$openid = $user->openid;
$session_key = $user->session_key;

// 连接数据库
$dbhost = 'localhost';
$dbuser = 'root';
$dbpwd = 'root';
$conn = mysqli_connect($dbhost,$dbuser,$dbpwd);
if(!$conn){
    die('Could not connect'.mysqli_error($conn));
}
echo 'success to connect';

// 选择数据库wxuser
mysqli_select_db($conn,'wxuser');

// 查询数据库中用户信息是否存在
$sql_check = 'SELECT * FROM user
             WHERE openid=$openid';
$check = mysqli_query($conn,$sql_check);
// 若数据库中为存储此用户信息,添加信息
if(!$check){
    // 写入数据
    $sql_insert = "INSERT INTO user (openid,session_key,avatarUrl,nickName,city) VALUES ('$openid','$session_key','$avatarUrl','$nickName','$city')";
    $insert = mysqli_query($conn,$sql_insert);
    if(!$insert){
        die("failed to insert".mysqli_error($conn));
    }
    echo 'success to insert';
}
// 若数据库中已存有用户信息
else{
echo 'user already exist';
}

// 关闭数据库
mysqli_close($conn);

?>