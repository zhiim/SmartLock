// pages/setting/login/login.js

var app=getApp();

Page({

  data: {},

  //登录
  onLogin: function (){
    let info = new Array();
    info = app._getUserInfo();  // 微信要求获取用户信息的函数必须由<button>组件触发, 所以此处的登录仅为获取用户信息, 登录已setting界面点击登录时完成

      wx.switchTab({
        url: "../../home/home",
        success: function () {
            console.log("jump success")
        },
        fail: function () {
            console.log("jump failed")
        },
        complete: function () {
            console.log("jump complete")
        }
      });
    //微信login,用于获取登录所需的code值
    /*wx.checkSession({
      success:function(){
        console.log('session is still alive');
      },
      fail:function(){
        wx.login({
          success: function (res) {
            console.log('code:'+res.code);
            wx.request({
              url: "https://lcokrasp.xyz/smartlock/wxlogin.php",  //本地服务器
              data: {
                code: res.code  //将获取的code传入服务器
              },
              success: function (res) {
                console.log(res.data);
              }
            })
          }
        })
      }
    })*/
  }

})