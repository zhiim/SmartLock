// app.js
App({
  // 获取用户信息,存在全局变量userInfo中
  _getUserInfo:function(){
    var userInfoStorage = wx.getStorageSync('user');  // 检查缓存中是否存在用户信息,若存在则返回值为true
    // 返回值为false时获取用户信息存在userInfo中
    if (!userInfoStorage) {
      var that = this;
      // 调用wx.getUserInfo前需要先调用wxwx.login
      wx.login({
        success: function (res) {
          let code = res.code;  // 获取传至服务器的code
          // 得到用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              // 获取成功后将信息存在userInfo中
              that.globalData.g_userInfo = res.userInfo;
              // 用户信息存入缓存
              wx.setStorageSync('user', res.userInfo);
              let avatarUrl = res.userInfo.avatarUrl;
              let nickName = res.userInfo.nickName;
              let city = res.userInfo.city;  

              wx.request({
                url: "https://lcokrasp.xyz/smartlock/wxlogin.php",  
                data: {
                  code: code,  //  将获取的code传入服务器
                  avatarUrl: avatarUrl,
                  nickName: nickName,
                  city: city
                },
                success: function (res) {
                  console.log(res.data);
                }
              })

              /*wx.checkSession({
                success:function(){
                  console.log('session is still alive');
                },
                fail:function(){
                      wx.request({
                        url: "https://lcokrasp.xyz/smartlock/wxlogin.php",  
                        data: {
                          code: res.code,  //  将获取的code传入服务器
                          avatarUrl: avatarUrl,
                          nickName: nickName,
                          city: city
                        },
                        success: function (res) {
                          console.log(success);
                          console.log(res.data);
                        }
                      })
                }
              })*/

              /* let info = {"avatarUrl":res.userInfo.avatarUrl,
                         "nickName":res.userInfo.nickName,
                         "city":res.userInfo.city};  // 此处将获取到的用户信息存入数组, 作为返回值, 用于传到服务器保存
              */

              return true;
            },
            fail: function (res) {
              console.log(res);
              return false;
            }
          })
        }
      })
    }
    // 如果缓存中有用户信息则将缓存中数据保存到userInfo
    else {
      this.globalData.g_userInfo = userInfoStorage;
    }
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 全局变量
  globalData: {
    g_userInfo: null,
    accountToAdd: null
  }
})
