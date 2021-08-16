<?php

// 连接数据库
$dbhost = 'localhost';
$dbuser = 'root';
$dbpwd = 'root';
$conn = mysqli_connect($dbhost,$dbuser,$dbpwd);
if(!$conn){
    die('Could not connect'.mysqli_error($conn));
}

// 选择数据库wxuser
mysqli_select_db($conn,'wxuser');

?>