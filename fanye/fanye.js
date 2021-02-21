(function() {
  function TurnPage(options,_this){
    //总页数
    this.total = options.total || 1
    //当前页数
    this.current = options.current || 1
    //回调函数
    this.change = options.change || function() {}
    //保存实例对象
    this._this = _this
  }

  TurnPage.prototype.init = function  () {
    //创建结构
    this.addHtml()
    //添加样式
    this.addEvent()
  }


  //创建结构
  TurnPage.prototype.addHtml = function () {
    const Wrapper = $('<ul class="my-page"></ul>')
    //上一页
    if (this.current > 1) {
      $('<li class="page-left">上一页</li>').appendTo(Wrapper);
    }
    //第一页
    $('<li class="page-num">1</li>').appendTo(Wrapper)
                                    .addClass(this.current == 1 ? 'current' : '')
    //省略号
    if (this.current - 2 - 1 > 1) {
      $("<span>...</span>").appendTo(Wrapper);
    }
    //中间五个
    for(let i = this.current - 2 ; i <= this.current + 2 ; i ++) {
      if (i > 1 && i < this.total)
      $(`<li class="page-num">${i}</li>`).appendTo(Wrapper)
                                        .addClass(this.current == i ? 'current' : '')
    }
    //省略号
    if (this.total - (this.current + 2) > 1) {
      $("<span>...</span>").appendTo(Wrapper);
    }
    //最后一页
    $(`<li class="page-num">${this.total}</li>`).appendTo(Wrapper)
                                                .addClass(this.current == this.total ? 'current' : '')
    //下一页
    if (this.current < this.total) {
      $('<li class="page-right">下一页</li>').appendTo(Wrapper)
    }
    this._this.html(Wrapper)
  }


  //添加事件
  TurnPage.prototype.addEvent = function () {
    let _this = this
    $('.page ')
    .find('.page-right')
    .click(item => {
      this.current ++
      this.change(this.current)
    }).end()
    .find('.page-left').click(item => {
      this.current --
      this.change(this.current)
    }).end()
    .find('.page-num').click(function () {
      _this.current = parseInt($(this).text())
      _this.change(_this.current)
    })
  }

  $.fn.extend({
    page(options) {
      var p = new TurnPage(options,this)
      p.init()
    }
  })
} ())