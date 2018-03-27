# gracly开源前端框架

>更新日志

* 2018-02-13
   * 改进通用伪柯里化函数，加入初始参数处理函数，有原来的多function参数变为单个参数。并在改进之后实现了JS元素选择器链式调用：getElement("#div1",".demo")("span")()

* 2018-03-04
   * 改进元素选择器调用形式：query("#demo div span[1] .select")和集合选择器querys(".demo")
    
* 2018-03-13
   * 优化ajax函数，更新page组件    
        
* 2018-03-27
  * 修复cookie操作bug，scrollEvent增加自定义和重复触发功能
