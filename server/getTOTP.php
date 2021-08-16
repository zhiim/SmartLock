<?php

// echo "test";

require_once 'class/two-factor-authenticator.php';
require_once 'connectDB.php';


$avatarUrl = $_GET['avatarUrl'];
$nickName = $_GET['nickName'];

$ga = new authenticator();
$secret = $ga->createSecret();


$qrCodeUrl = $ga->getQRCodeGoogleUrl('test', $secret);
// echo "Google Charts URL for the QR-Code: ".$qrCodeUrl."\n\n";
echo $qrCodeUrl;


// 将生成的密钥放入数据库
$sql_check = "SELECT * FROM user WHERE nickName='$nickName'";
$check = mysqli_query($conn,$sql_check);
// 若数据库中为存储此用户信息,添加信息
if($check){
    // 写入数据
    $sql_insert = "UPDATE user SET totp_secret='$secret' WHERE nickName='$nickName'";
    $insert = mysqli_query($conn,$sql_insert);
    if(!$insert){
        die("failed to insert".mysqli_error($conn));
    }
}
else{
    die("failed to check".mysqli_error($conn));
}




?>
