// custom-tab-bar/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    active: '',
    list: [{
        icon: 'home-o',
        text: '首页',
        url: '/pages/home/home'
      },
      {
        icon: 'passed',
        text: '解锁',
        url: '/pages/lock/lock'
      },
      {
        icon: 'setting-o',
        text: '设置',
        url: '/pages/setting/setting'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
            // this.setData({ active: event.detail });
            wx.switchTab({
                url: this.data.list[event.detail].url
            });
        },
    init() {
            const page = getCurrentPages().pop();
            this.setData({
                active: this.data.list.findIndex(item => item.url === `/${page.route}`)
            });
        }

  }
})