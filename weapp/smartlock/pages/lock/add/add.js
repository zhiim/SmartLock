// pages/lock/add/add.js

const app=getApp();

Page({
  data: {
    accountToAdd: null,
    title: ''
  },

  onLoad: function (options) {
    // accountToAdd用于传递信息, 使用后重置为null
    const data = app.globalData.accountToAdd;
    app.globalData.accountToAdd = null;

    this.setData({
      accountToAdd: data
    });
  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {},

  onAdd:function(){
    const wm=this;

    // 提示信息
    wx.showLoading({
      title: '添加中',
    });
    
    // 检查本地缓存中是否已经存在信息
    wx.getStorage({
      key: 'accounts',
      fail: function (e) {
        handleAdd({}, wm.data);
      },
      success: function(res) {
        handleAdd(res, wm.data);
      },
    });
  }
})

function handleAdd(res, data) {
  console.log(res, data);
  res = JSON.parse(res.data || '[]');  // 将json转换为类
  res.push({
    title: data.title || data.accountToAdd.issuer,   // issuer表示用户所属的服务商, titile用于区分不同的账户
    secret: data.accountToAdd.secret.toUpperCase(),  // toUpperCase将小写字母转换为大写
    issuer: data.accountToAdd.issuer
  });
  console.log(res);
  wx.hideLoading();  // 隐藏加载提示框
  // 存入缓存
  wx.setStorage({
    key: 'accounts',
    data: JSON.stringify(res),
    success: function () {
      wx.switchTab({
        url: "../../lock/lock",
        success: function () {
            console.log("jump success")
        },
        fail: function () {
            console.log("jump failed")
        },
        complete: function () {
            console.log("jump complete")
        }
      })
      wx.showToast({
        title: '账户已添加',
      });
    }
  });
}