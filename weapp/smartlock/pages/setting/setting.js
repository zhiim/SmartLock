// pages/setting/setting.js

const utils = require('../../utils/util')

var app=getApp();  // 用于使用app.js中的全局变量

Page({

  data: {
    show: false,  //表示弹出层是否显示
    userInfo: null  //用户数据
  },

  onLoad: function () {
  },

  onReady: function () {},

  onShow: function () {
    var userInfoStorage = wx.getStorageSync('user');
    this.setData({
      userInfo: userInfoStorage
    })
  },

  onHide: function () {},

  onUnload: function () {},

  // 弹出层显示
  showPopup: function() {
    this.setData({show: true});
  },

  onClose: function() {
    this.setData({show: false});
  },

  onTaptoHelp:function(){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

  // 扫描二维码
  /*scanQRCode: function(){
    wx.scanCode({
      success: res => {
        const result = res.result


        // 两步验证扫描结果以otpauth开头
        if (result.indexOf('otpauth') !== 0) {
          wx.showModal({
            title: '非两步验证码',
            content: '请扫描两步验证码'
          })
        } else {
          app.globalData.accountToAdd = utils.getParametersFromResult(result)  // 将扫码得到的信息解析后, 存在全局变量accountToAdd中, 全局变量定义与app.js

          console.log('account to add', app.globalData.accountToAdd);

          wx.navigateTo({
            // 添加前的信息编辑界面
            url: '/pages/lock/add/add'
          })
        }
      }
    })
  },*/

  onAddPWD:function(){
    wx.navigateTo({
      url: '/pages/setting/addPWD/addPWD',
    })
  },

  // 发送网络请求, 得到两步验证url
  onAddTOTP:function(){
    var userInfoStorage = wx.getStorageSync('user');
    wx.request({
      url: "https://lcokrasp.xyz/smartlock/getTOTP.php",
      data: {
        avatarUrl: userInfoStorage.avatarUrl,
        nickName: userInfoStorage.nickName
      },
      success: function(res){
        const result = unescape(res.data);  // url解码
        console.log('otpauth url: ' + result);

        app.globalData.accountToAdd = utils.getParametersFromResult(result)  // 将扫码得到的信息解析后, 存在全局变量accountToAdd中, 全局变量定义与app.js

          console.log('account to add: ' + app.globalData.accountToAdd);

          wx.navigateTo({
            // 添加前的信息编辑界面
            url: '/pages/lock/add/add'
          })
      }
    })
  },

  //登录
  /*onLogin: function (){
    //微信login,用于获取登录所需的code值
    wx.checkSession({
      success:function(){
        console.log('session is still alive');
      },
      fail:function(){
        wx.login({
          success: function (res) {
            console.log('code:'+res.code);
            wx.request({
              url: "https://lcokrasp.xyz/smartlock/wxlogin.php",  
              data: {
                code: res.code  //  将获取的code传入服务器
              },
              success: function (res) {
                console.log(res.data);
              }
            })
          }
        })
      }
    })
    
  }*/

})