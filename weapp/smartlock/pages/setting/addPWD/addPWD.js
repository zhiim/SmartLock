// pages/setting/addPWD/addPWD.js
Page({

  // 页面的初始数据
  data: {
    PWD: '',
  },

  onChange:function(event){
    // console.log(event.detail);
    // 每次输入框内容变化后, 将输入框的内容储存到data.PWD中
    this.setData({
      PWD: event.detail
    });
  },

  // 点击完成按钮后出发此函数, 将固定密码PWD写入缓存, 同时传送至服务器
  onaddPWD:function(){
    console.log(this.data.PWD);
    let PWD = this.data.PWD;
    wx.setStorageSync('PWD', PWD);  //PWD写入缓存
    // PWD传送到服务器
    var nickName = wx.getStorageSync('nickName');
    wx.request({
      url: "https://lcokrasp.xyz/smartlock/addPWD.php",
      data: {
        PWD: PWD,
        nickName: nickName // 暂时使用nickName来区分用户, 后期优化在换成openid
      },
      success:function(res){
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})