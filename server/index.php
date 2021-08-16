<?php
require_once 'class/two-factor-authenticator.php';

$ga = new authenticator();
$secret = $ga->createSecret();
echo "Secret is: ".$secret."\n\n";
echo "<br>";

$qrCodeUrl = $ga->getQRCodeGoogleUrl('Blog', $secret);
echo "Google Charts URL for the QR-Code: ".$qrCodeUrl."\n\n";
echo "<br>";

$oneCode = $ga->getCode($secret);
echo "Checking Code '$oneCode' and Secret '$secret':\n";
echo "<br>";

$checkResult = $ga->verifyCode($secret, $oneCode, 2);    // 2 = 2*30sec clock tolerance
if ($checkResult) {
    echo 'OK';
} else {
    echo 'FAILED';
}