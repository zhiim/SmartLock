<?php

class WXLogin{
    private $loginUrl;
    private $wxAppID;
    private $wxAppSecret;

    // 构造函数, 初始化loginUrl, wxAppID, wxAppSecret
    function __construct(){
        //$config = include('../loginconfig.php');   // 导入关联数组config
        $config = array(
            'WXAPPID' => 'wxb5a1b1a237716656',
            'WXAPPSECRET' => '1aa669535a6376661a7d6885a4751559',
            'LOGINURL' =>  "https://api.weixin.qq.com/sns/jscode2session?".
            "appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
        );
        $this->loginUrl = $config['LOGINURL'];
        $this->wxAppID = $config['WXAPPID'];
        $this->wxAppSecret = $config['WXAPPSECRET'];
    }

    public function login($code){
        $loginUrl = sprintf($this->loginUrl, $this->wxAppID, $this->wxAppSecret,$code);   //合成登录api
        $ch = curl_init();  // 初始化
        $timeout = 10;
        
            curl_setopt ($ch, CURLOPT_URL, $loginUrl);  // 请求api
            curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);  // 返回线程数
            curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);  //设置超时

            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            $res = curl_exec($ch);  // 执行请求
            curl_close($ch);  // 关闭
            $resArray = json_decode($res,true);  // 解码返回值
            return $resArray;
        
        // 异常处理
        /*
        catch (Excetption $e){
            return $e;
        }
        */
    }
}

?>