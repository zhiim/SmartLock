<?php

// 保存微信小程序appid和secret
return array(
    'WXAPPID' => 'wxb5a1b1a237716656',
    'WXAPPSECRET' => '1aa669535a6376661a7d6885a4751559',
    'LOGINURL' =>  "https://api.weixin.qq.com/sns/jscode2session?".
                    "appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
);