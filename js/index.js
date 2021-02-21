let studentList = []  //请求的学生数据
let total = 10 //总共页数
let page = 1  //当前页数
let size = 10 //一页显示多少数量


//左边菜单点事件
function leftClick() {
  $('#left').on('click','dd',function (e) {
    //左边菜单切换
    $(e.target).addClass('active').siblings().removeClass('active')
    //右边内容切换
    $('.' + $(e.target).data('id')).fadeIn().siblings().fadeOut()
  
    //如果点击的是学生列表会请求数据
    if ($(e.target).data('id') == 'student-list'){
      //请求并渲染数据
      getData()
    }
  })
  //添加右边所有按钮事件
  btnClick()
}

//请求学生数据
function getData() {
  $.ajax({
    url :'/api/student/findAll',
    type : 'get',
    dataType : 'json',
    data : {
      page : page,
      size : size
    },
    success(res) {
      //渲染列表
      if (res.status= "success") {
        total = Math.ceil(res.data.total / size)
        addList(res.data.result)
        studentList = res.data
      }else {
        alert(res.msg)
      }
    }
  })
}

//渲染列表
function addList(res) {
  let str = ''
  res.forEach((item,index) => {
    str += `<tr class="body">
                      <th>${item.sNo}</th>
                      <th>${item.name}</th>
                      <th>${item.sex ==0 ? '男' : '女'}</th>
                      <th>${item.email}</th>
                      <th>${new Date().getFullYear() - item.birth}</th>
                      <th>${item.phone}</th>
                      <th>${item.address}</th>
                      <th>
                        <button class="btn change" data-id = '${index}'>编辑</button>
                        <button class="btn del" data-id ='${item.sNo}' data-name ='${item.name}' >删除</button>
                      </th>
                    </tr>`
  },'')
  $('#right tbody').html(str)

  //创建翻页
  $('#right .page').page({
    total : total,  //总页数
    current : page, //当前页
    change(current) { //回调函数
      page = current
      getData()
    }
  })
}





//添加右边所有按钮事件
function btnClick() {

  //编辑按钮绑定事件
  $('#right tbody').on('click','.change',function () {
    //表单回填
    returnMsg(studentList.result[$(this).data('id')])
    //表单显示
    $('#right .modal').slideDown()
  })

  //删除按钮绑定事件
  $('#right tbody').on('click','.del',function () {
    let sNo = $(this).data('id')
    let name = $(this).data('name')
    //请求删除学生信息
    let flag = confirm(`确认删除 ${sNo} ${name} 的信息？`)
    if (flag) {
      removeMsg(sNo)
    }
  })
  
  //表单按钮事件绑定
  $('#right .modal').click(function (e) {
    //点击灰色区域影藏
    if (e.target === this) {
      $(this).slideUp()
    }
  }).find('.submit').click(e => {
    e.preventDefault()
    //验证数据准确性
    let msg =  studentMsg($('#right .modal form')[0])
    if (msg.status == 'success') {
      //发送修改请求
      changeMsg(msg.data)
    }else {
      alert(msg.msg)
    }
  })


  //新增学生
  $('#right .student-add form').on('click','.submit',function (e) {
      e.preventDefault()
      let msg = studentMsg($('#right .student-add form')[0])
      if (msg.status == 'success') {
        $(this).siblings().trigger('click')
        addMsg(msg.data)
      }else {
        alert(msg.msg)
      }
  })
}


//回填表单
function returnMsg(data) {
  for (const key in data) {
    if ($('#right .modal form')[0][key]){
      $('#right .modal form')[0][key].value = data[key]
    }
  }
}

//发送修改请求
function changeMsg(res) {
  $.ajax({
    url : '/api/student/updateStudent',
    type : 'get',
    dataType : 'json',
    data : res,
    success(res) {
      if (res.status == 'success') {
        alert(res.msg)
        $('#right .modal').trigger('click')
        getData()
      }else {
        alert(res.msg)
      }
    }
  })
}

//发送删除信息请求
function removeMsg(sNo) {
  $.ajax({
    url : '/api/student/delBySno',
    type : 'get',
    data : {
      'sNo' : sNo
    },
    dataType : 'json',
    success(res) {
        alert(res.msg)
        getData()
    }
  })
}

//发送添加信息请求
function addMsg(res) {
  $.ajax({
    url : '/api/student/addStudent',
    type : 'get',
    data : res,
    dataType : 'json',
    success(res) {
      alert(res.msg)
      if (res.status == 'success') {
        $('#left dd:eq(0)').trigger('click')
      }
    }
  })
}





//获取表单信息并且验证是否符合规则
function studentMsg(form) {
  //获取表单的信息
  let name = form.name.value,
      sex = form.sex.value,
      email = form.email.value,
      sNo = form.sNo.value,
      birth = form.birth.value,
      phone = form.phone.value,
      address = form.address.value
  if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
      return {
          status : 'fail',
          msg : '信息填写不完全，请填写完整'
      }
  }

  //性别 0/1
  let sexReg = /^[01]$/
  if(!sexReg.test(sex)){
      return {
          status : 'fail',
          msg : '性别只能选择男或女'
      }
  }
  //邮箱 xxxx@xxxx.com/.cn
  let emailReg = /^\w+@\w+\.(com|cn)$/
  if (!emailReg.test(email)){
      return {
          status : 'fail',
          msg : '邮箱不正确！'
      }
  }
  //出生年份 年龄在10-80之间
  if (birth < 1940 || birth > 2010) {
      return {
          status : 'fail',
          msg : '年龄不正确'
      }
  }
  //电话 11位 开头1  第二位不是1/2
  let phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(phone)) {
      return {
          status : 'fail',
          msg : '电话不对！'
      }
  }
  //学号必须是 4-16位数字组成
  let sNoReg = /^\d{4,16}$/
  if (!sNoReg.test(sNo)) {
      return {
          status : 'fail',
          msg : '学号不对！'
      }
  }
  
  return {
      status : 'success',
      msg : '信息都正确',
      data : {
          name,
          sex,
          email,
          sNo,
          birth,
          phone,
          address
      }
  }
}




//开启链式函数执行
leftClick()
//手动调用点击学生列表
$('#left dd:eq(0)').trigger('click')