//学生列表
let student = Mock.mock({
  'data|100' : [{
    'id|+1' : 1,
    'name' : '@cname',
    'birth' : '@date("yyyy")',
    'sex|1' : [0,1],
    'sNo|+1' : 10000,
    'email' : '@email',
    'phone' : '@integer(12000000000,19000000000)',
    'address' : '@county(true)',
    'appkey' : '@word(16)'
  }]
})

//查询所有数据
Mock.mock(RegExp('/api/student/findAll?[\w\W]*'),'get',function (options) {
  //获取前端给我们的数据
  let queryObj = formatQuery(options)
  //过滤数据，把相应的数据过滤出来
  let studentList = student.data.filter((item,index) => {
    return index >= (queryObj.page - 1) * queryObj.size && index < queryObj.page * queryObj.size
  })

  //返回数据
  return {
    'status' : 'success',
    'msg' : '查询成功',
    'data' : {
      result :studentList,
      total : student.data.length
    }
  }

})



//修改学生数据
Mock.mock(RegExp('/api/student/updateStudent?[\w\W]*'),'get',options => {
  let queryStr = formatQuery(options)
  student.data.forEach(item => {
    if (item.sNo == queryStr.sNo) {
      for (const key in queryStr) {
        item[key] = queryStr[key]
      }
    }
  })
  return {
            'msg' : '修改成功',
            'status' : 'success'
          }
})

//删除学生数据
Mock.mock(RegExp('/api/student/delBySno?[\w\W]*'),'get',options => {
  let queryStr = formatQuery(options)
  student.data = student.data.filter(item => {
    return item.sNo != parseInt(queryStr.sNo)
  })
  return {
    'msg' : '删除成功',
    'status' : 'success'
  }
})


//添加学生数据
Mock.mock(RegExp('/api/student/addStudent?[\w\W]*'),'get',options => {
  let queryStr = formatQuery(options)
  //push到学生列表中
  student.data.push(queryStr)
  return {
    'msg' : '添加成功',
    'status' : 'success'
  }
})



//是把字符串 key=value&key1=value1  ===》  {key: value, key1: value1}
function formatQuery(options) {
  let queryStr = decodeURIComponent(options.url.slice(options.url.indexOf('?') + 1))
  let queryAll = queryStr.split('&')
  let queryObj = {}
  queryAll.forEach(item => {
    queryObj[item.split('=')[0]] = item.split('=')[1]
  })
  return queryObj
}