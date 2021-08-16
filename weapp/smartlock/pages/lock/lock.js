const utils = require('../../utils/util')
const app = getApp()
import drawQrcode from '../../utils/weapp.qrcode'
import base32 from '../../utils/base32'

let recentUpdated = false

Page({

  data: {
    show: false,  //控制二维码是否显示
    qrtext: '',  //二维码表示的字符串
    PWD: '',
    codes: [],
    accounts: [],
    secondsLeft: 30,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  // 点击"显示二维码"后触发showPop, 将show置为true, 弹出二维码界面
  showPop:function(){
    this.setData({
      show: true
    })
    console.log('codes: '+this.data.codes)
    console.log('PWD: '+this.data.PWD)
    var qrcode = this.data.codes + this.data.PWD
    console.log('qrcode:' + qrcode)
    qrcode = base32.encode(qrcode)
    console.log('qrcode after encode: ' + qrcode)
    this.setData({
      qrtext: qrcode
    })
    console.log('qrtext was setted to: ' + this.data.qrtext)
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'QRCode',
      text: this.data.qrtext,
      /*image: {
        imageResource: '../../images/icon.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      }*/
    })
  },

  // 关闭二维码界面
  onClose:function(){
    this.setData({
      show: false
    })
  },

  onTaptoHelp:function(){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

  onLoad: function (options) {
    var PWD = wx.getStorageSync('PWD')
    console.log('PWD in Storage: '+PWD)
    //console.log('codes: ' + this.data.codes)
    this.setData({
      PWD: PWD,
      //qrtext: 'test'
    })
    console.log('PWD was setted: '+this.data.PWD)
    //console.log('qrtext was setted: '+this.data.qrtext)
  },

  onReady: function () {},

  // 每次切换到此页面时执行
  onShow: function () {
    this.loadAccounts()  // 读取本地缓存
    console.log('current code: ' + this.data.codes)
  },

  // 每次离开此页面时执行
  onHide: function () {
    this.stopTimer()
  },

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {},

  // 读取本地缓存
  loadAccounts: function() {
    const vm = this
    handleLoadingAccounts(function(accounts) {
      vm.setData({
        accounts
      })
      vm.updateCodes()
      vm.startTimer()
    })
  },

  updateCodes: function() {
    const vm = this
    const codes = vm.data.accounts.map(a =>
      utils.getCodeFromSecretKey(a.secret)
    )

    console.log(codes)
    vm.setData({
      codes
    })
  },

  startTimer: function() {
    const vm = this
    vm.stopTimer()

    if (this.data.accounts.length) {
      vm.timer = setInterval(() => {
        const date = new Date()
        const current = date.getSeconds()

        vm.setData({
          secondsLeft:
            ((59 - current) % 30) + (1000 - date.getMilliseconds()) / 1000
        })

        if ((current === 0 || current === 30) && !recentUpdated) {
          vm.updateCodes()
          recentUpdated = true
          setTimeout(() => (recentUpdated = false), 1000)
        }
      }, 16)
    }
  },

  stopTimer: function() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  copyAuthenticationInfo: function(e) {
    wx.showToast({
      title: '已复制验证码'
    })
  },

  // 点击时复制动态码到剪贴板
  onCellTap: function(e) {
    const id = +e.target.id
    const code = this.data.codes[id]

    wx.setClipboardData({
      data: code
    })
    wx.showToast({
      title: '已复制验证码'
    })
  },

  // 删除
  onDelete: function(e) {
    const vm = this
    const id = +e.target.id.replace('account-', '')
    const account = this.data.accounts[id]
    wx.showModal({
      title: '删除账户',
      content: `删除名为 ${account.title} 的账户？`,
      success: function() {
        handleLoadingAccounts(accounts => {
          const deleteIndex = accounts.findIndex(a => a.title === account.title)
          if (deleteIndex !== -1) {
            accounts.splice(deleteIndex, 1)
            wx.setStorage({
              key: 'accounts',
              data: JSON.stringify(accounts)
            })
          }
          vm.loadAccounts()
        })
      }
    })
  },

  /*
  // 扫描二维码
  scanQRCode: function(){
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
  }
  */
})

function handleLoadingAccounts(cb) {
  // handler函数用于将参数传入cb函数执行
  function handler(accounts) {
    cb(JSON.parse(accounts))
  }

  wx.getStorage({
    key: 'accounts',
    // 若本地缓存中存有信息, 则将缓存传入函数handler
    success: function(res) {
      handler(res.data)
    },
    fail: function(res) {
      handler('[]')
    }
  })
}