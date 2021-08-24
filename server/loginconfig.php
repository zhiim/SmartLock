<?php

// 保存微信小程序appid和secret
return array(
    'WXAPPID' => '',
    'WXAPPSECRET' => '',
    'LOGINURL' =>  "https://api.weixin.qq.com/sns/jscode2session?".
                    "appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
);