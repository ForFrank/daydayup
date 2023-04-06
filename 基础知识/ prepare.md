### 0.1+0.2 为什么!=0.3

- 计算机中所有的数据都是以二进制存储的，所以在计算时要把数据先转换成二进制进行计算，然后把计算结果转换成十进制
  但在计算时由于 JS 采用 IEEE754 双精度 64 位浮点数存储数字，只能保存小数点 52 位，并按照 舍 0 补 1，0.1+0.2 二进制理论相加结果第 53 位为 1，进 1 后的值大于 0.3
- 最大安全整数的出现也是这个原因

- [参考 1](https://blog.csdn.net/m0_52743009/article/details/129027679?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EAD_ESQUERY%7Eyljh-2-129027679-blog-119610620.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EAD_ESQUERY%7Eyljh-2-129027679-blog-119610620.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=5)

### 如何解决 0.1+0.2!=0.3 的问题

- 1、先转换成整数，再相加之后转回小数
- 2、使用 es6 新增的 Number.EPSILON 方法
- 3、使用 number 对象的 toFixed 方法，toFixed 方法可以指定运算结果的小数点后的指定位数的数字，使保留一位小数就是 toFixed(1)
  parseFloat((0.1+0.2).toFixed(1))

### 原型/原型链

- 原型的作用：原型被定义为对象提供共享属性的对象，函数的实例可以共享原型上的属性和方法
- **proto**:原型指针，指向构造函数的原型属性
- prototype:原型属性
- 原型链的作用：当访问一个对象上属性时，如果该对象内部不存在这个属性，就会去**proto**属性所指向的原型对象上查找，如果原型对象依旧不存在这个属性，那么就会去其原型对象中**proto**所指向的原型对象上去查找。以此类推，直到找到 null，而这个查找线路，也就构成了我们常说的原型链
- 原型链和作用域的区别：原型链是查找对象上的属性，作用域链是查找当前上下文的变量

#### instanceof

- instanceof 的基本用法，可以判断一个对象的原型链上是否包含该构造函数的原型，经常用来判断对象是否为构造函数的实例

##### 手写 instanceof

```
function myInstanceOf(obj,fn){
  let proto = obj.__proto__;
  if(proto){
    if(proto === fn.prototype){
      return true
    }else{
      return myInstanceOf(proto,fn)
    }
  }else{
    return false
  }
}
// test
function Test(){}
let test = new Test()
console.log(myInstanceOf(test,Test), myInstanceOf(test,Object)) // true, true
```

##### instanceof 和 typeof 的区别

- type 一般被用来判断一个变量的类型，type 可以用来判断 number、undefined、symbol、string、function、boolean、object 这七种类型，特殊情况：typeof null === 'object'

#### new

**new 一个对象，到底发生了什么**
1、创建一个对象
2、该对象的原型指针指向构造函数的原型
3、构造函数的 this 指向这个新对象
4、判断构造函数是否有返回值，如果有返回值且返回值是一个对象或一个方法，，则返回该值；否则返回新生成的对象
**手写 new**

```
function selfNew(fn, ...args) {
  // 创建一个instance对象，该对象的原型是fn.prototype
  let instance = Object.create(fn.prototype);
  //let instance = {}
  //instance.__proto__ = Fun.prototype;
  // 调用构造函数，使用apply，将this指向新生成的对象
  let res = fn.apply(instance, args);
  // 如果fn函数有返回值，并且返回值是一个对象或方法，则返回该对象，否则返回新生成的instance对象
  //return typeof res === "object" || typeof res === "function" ? res : instance;
  if (res instanceof Object) {
        return res;
    } else {
        return instance;
    }
}
```

#### 继承

1、原型链继承，缺点：引用类型的属性被所有实例共享，在创建 child 实例时，不能向 parent 传参

2、借用构造函数继承，优点：1、避免了引用类型的属性被所有实例共享 2、可以在 child 中向 parent 传参 缺点：方法都在构造函数中定义，每次创建实例都会创建一遍方法

3、原型式继承，缺点：包含引用类型的属性值始终都会共享相应的值

4、寄生式继承，缺点：和借用构造函数模式一样，每次创建对象都会创建一遍方法

5、组合式继承，优点：融合原型链继承和构造函数的优点

6、寄生组合式继承，优点：1、这种方式的高效率体现在它只调用了一次 parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的多余的属性 2、原型链保持不变 3、能够正常使用 instanceof 和 isPrototypeOf

**class**

ES6 的 Class 内部是基于寄生组合式继承，它是目前最理想的继承方式

ES6 的 Class 允许子类继承父类的静态方法和静态属性

#### 原始值和引用值

原始值存储在栈中

引用值得指针存储在栈中，指针所指向的对象存储在堆中
**执行上下文**
执行上下文指的是执行环境中的变量、函数声明、作用域链、this 等信息

全局上下文
函数上下文
eval（）调用内部存在第三种上下文
**执行上下文生命周期**
1、创建阶段
生成变量对象、建立作用域链、确定 this 指向
2、执行阶段

变量赋值、函数引用、执行其他代码

**执行上下文的特点**

1、单线程，只在主线程上运行

2、同步执行，从上向下按顺序执行

3、全局上下文只有一个，也就是 window 对象

4、函数每调用一次就会

**执行栈**

1、当 JS 引擎第一次遇到 js 脚本时，会创建一个全局的执行上下文并且压入当前执行栈

2、每当 JS 引擎遇到一个函数调用，它会为函数创建一个新的执行上下文并压入栈的顶部

3、当函数执行结束时，执行上下文从文中弹出，控制流程到达当前栈中的下一个上下文

4、一旦所有代码执行完毕，JS 引擎从当前栈中移除全局执行上下文

**var、let、const**

const 申明只应用到顶级原语或对象。换句话说，赋值为对象的

const 变量不能再被赋值为其他引用值，但对象的键则不受影响

如果想让整个对象都不能修改，可以用 Object.freeze()

let 和 const 不可以重复申明，暂时性死区

let 和 const 变量不会绑定到 window 上

const 使用时必须赋值

**作用域**

作用域是可访问变量的集合，最大的用处就是隔离变量，不同作用域下

同名变量不会有冲突

**作用域类型**

全局作用域

函数作用域：指声明在函数内部的变量，函数的作用域在函数定义的时候就决定了

块级作用域（ES6 新增）：

1、块级作用域由{}包括，if 和 for 语句里面的{}也属于块级作用域

#### this

**this 的 5 种绑定方式**

1、默认绑定（非严格模式下 this 指向全局对象，严格模式下函数内的 this 指向 undefined）

2、隐式绑定（当函数引用有上下文对象时，如 obj.foo()的调用方式，foo 内的 this 指向 obj）

3、显示绑定（通过 call，apply，bind 绑定对象）

4、new 构造函数绑定，this 指向新生成的对象

5、箭头函数，this 指向的是定义该函数时，外层环境的 this，箭头函数的 this 在定义时就决定了，不能改变

#### call、apply、bind

**三者的区别**
1、三者都可以显示绑定函数的 this 指向

2、三者第一个参数（必须是对象）都是 this 要指向的对象，若该参数为 undefined 或 null，this 会默认指向全局 window

3、传参不同：apply 是数组、call 是参数列表，bind 可以分为多次传入，实现参数合并

4、call、apply 是立即执行，bind 是返回绑定 this 之后的函数，如果这个新的函数被调用，那么 this 不再指向传入的 bind 的第一个参数，而是指向新生成的对象

5、实际应用：继承、改变函数执行上下文

```
/ 手写call
Function.prototype.Call = function(context, ...args) {
  // context为undefined或null时，则this默认指向全局window
  if (context === undefined || context === null) {
    context = window;
  }
  // 利用Symbol创建一个唯一的key值，防止新增加的属性与obj中的属性名重复
  let fn = Symbol();
  // this指向调用call的函数
  context[fn] = this;
  // 隐式绑定this，如执行obj.foo(), foo内的this指向obj
  let res = context[fn](...args);
  // 执行完以后，删除新增加的属性
  delete context[fn];
  return res;
};

// apply与call相似，只有第二个参数是一个数组，
Function.prototype.Apply = function(context, args) {
  if (context === undefined || context === null) {
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  delete context[fn];
  return res;
};
// bind
Function.prototype.myBind = function(thisArg, ...args) {
  const fn = this; // 保存原函数
  // 判断调用 bind() 的对象是否为函数，不是则抛出错误
  if (typeof fn !== 'function') {
    throw new TypeError('Function.prototype.bind - ' +
                        'what is trying to be bound is not callable');
  }
  // 保存当前函数和调用 bind() 传入的参数
  const boundFn = function(...boundArgs) {
    // 当作为构造函数时，this 指向实例对象，通过 new 关键字调用
    if (new.target) {
      const result = fn.apply(this, boundArgs.concat(args));
      if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
      }
      return this;
    } else {
      // 当作为普通函数时，this 指向传入的 thisArg 或全局对象
      return fn.apply(thisArg, boundArgs.concat(args));
    }
  }
  // 维护原型关系
  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
  }
  return boundFn;
}
```

#### js 中类数组转为数组

1、Array.from

2、使用展开运算符

3、使用 bind

```
// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);

// ...

slice(arguments);
```

#### 词法作用域

- 词法作用域，就意味着函数被定义的时候，它的作用域就已经确定了，和拿到哪里执行没有关系，因此词法作用域也被称为 “静态作用域”。

[链接](https://mitianyi.gitbook.io/frontend-interview-guide/es6/let-and-const)

#### 闭包

- 定义：闭包是一个可以访问外部作用域的内部函数，即使这个外部作用域已经执行结束
- 闭包的外部作用域是在其定义的时候已决定，而不是执行的时候。

**闭包常见的两种情况**

1、函数作为返回值

2、函数作为参数传递

**闭包的作用**

可以让局部变量的值始终保持在内存中，对内部变量进行保护，使外部访问不到

最常见的案例：`函数防抖和节流`

**闭包的垃圾回收机制**

副作用：不合理的使用闭包，会造成内存泄漏（即该内存空间使用完毕后未被回收）

闭包中引用的变量直到闭包被销毁时才会被垃圾回收

**示例**

```
// 原始题目
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // 1s后打印出5个5
  }, 1000);
}

// ⬅️利用闭包，将上述题目改成1s后，打印0,1,2,3,4

// 方法一：
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, 1000);
  })(i);
}

// 方法二：
// 利用setTimeout的第三个参数，第三个参数将作为setTimeout第一个参数的参数
for (var i = 0; i < 5; i++) {
  setTimeout(function fn(i) {
    console.log(i);
  }, 1000, i); // 第三个参数i,将作为fn的参数
}

// ⬅️将上述题目改成每间隔1s后，依次打印0,1,2,3,4
for (var i = 0; i < 5; i++) {
  setTimeout(function fn(i) {
    console.log(i);
  }, 1000 * i, i);
}
```

[关于 for 循环中使用 setTimeout 的四种解决方案](https://www.cnblogs.com/wl0804/p/11987833.html)

#### promise

- promise 对象有三种状态：进行中（pending）、已完成（fulfilled）、失败（rejected）
- promise 对象有两个过程：pending -> fulfilled，pending->rejected，过程不可逆
  **promise 中的静态方法**
- 1、Promise.resolve(value) 返回一个 Promise 对象，它已经被 fulfilled 了，返回值为指定的值（可以是任何 JavaScript 值，包括 Promise 对象）。如果传入的值是一个 Promise 对象，它将直接返回这个 Promise 对象，而不是创建一个新的 Promise 对象。
- 2、Promise.reject(reason)返回一个 Promise 对象，它已经被 rejected 了，原因为指定的值。
- 3、Promise.all(iterable) 只有状态都变成 fulfilled，状态才会变成 fulfilled，此时返回值组成一个数组，传递给回调函数。只要有一个被 rejected，状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给回调函数。
- 4、Promise.race(iterable) 只要有一个实例率先改变状态，状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给回调函数
- 5、Promise.allSettled(iterable) 只有等到参数数组的所有 Promise 对象都发生状态变更（不管是 fulfilled 还是 rejected），返回的 Promise 对象才会发生状态变更
- 6、Promise.any(iterable) 只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；如果所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态
  **promise 中的实例方法**
- Promise.prototype.then() Promise 实例添加状态改变时的回调函数，回的是一个新的 Promise 实例
- Promise.prototype.catch()如果异步操作抛出错误，状态就会变为 rejected，就会调用 catch()方法指定的回调函数
- Promise.prototype.finally()用于指定不管 Promise 对象最后状态如何，都会执行的操作

#### async、await

- 作用：用同步方式，执行异步操作
  **总结**
- 1、async 函数是 generator（迭代函数）的语法糖
- 2、async 函数返回的是一个 Promise 对象，有无值看有无 return 值
- 3、await 关键字只能放在 async 函数内部，await 关键字的作用 就是获取 Promise 中返回的 resolve 或者 reject 的值 （从 ES2022 开始，允许在模块的顶层独立使用 await 命令）
- 4、async、await 要结合 try/catch 使用，防止意外的错误

#### agenerator

- 1、generator 函数跟普通函数在写法上的区别就是，多了一个星号\*
- 2、只有在 generator 函数中才能使用 yield，相当于 generator 函数执行的中途暂停点
- 3、generator 函数是不会自动执行的，每一次调用它的 next 方法，会停留在下一个 yield 的位置

#### 浅拷贝/深拷贝

- 浅拷贝：Object.assign()，只解决了第一层的基本数据类型及第一层的引用类型地址
  **深拷贝**
- 方法：1、JSON.parse(JSON.stringfy()) 2、使用递归手写 3、第三方库，如 lodash 等
- JSON.parse(JSON.stringfy())
  缺点：无法拷贝函数、正则、时间格式、原型属性上的方法、会忽略 undefined、symbol，无法处理循环引用的情况

#### 时间轮询机制 Event Loop

宏任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行下一个任务

微任务指的是，不进入主线程、而进入"微任务列表"的任务
当前宏任务执行完后，会判断微任务列表中是否有任务。如果有，会把该微任务放到主线程中并执行，如果没有，就继续执行下一个宏任务

**宏任务 微任务**
**1）宏任务（Macrotasks）**

script 全部代码（注意同步代码也属于宏任务）、setTimeout、setInterval、setImmediate 等

**2）微任务（Microtasks）**

Promise、MutationObserver

**事件轮询机制执行过程**

1）代码执行过程中，宏任务和微任务放在不同的任务队列中

2）当某个宏任务执行完后,会查看微任务队列是否有任务。如果有，执行微任务队列中的所有微任务(注意这里是执行所有的微任务)

3）微任务执行完成后，会读取宏任务队列中排在最前的第一个宏任务（注意宏任务是一个个取），执行该宏任务，如果执行过程中，遇到微任务，依次加入微任务队列

4）宏任务执行完成后，再次读取微任务队列里的任务，依次类推。

**async、await 事件轮询执行时机**

async 隐式返回 Promise，会产生一个微任务
await 后面的代码是在微任务时执行

**event loop 与 浏览器更新渲染时机**

1） 浏览器更新渲染会在 event loop 中的 宏任务 和 微任务 完成后进行，即宏任务 → 微任务 → 渲染更新（先宏任务 再微任务，然后再渲染更新）

2）宏任务队列中，如果有大量任务等待执行时，将 dom 的变动作为微任务，能更快的将变化呈现给用户，这样就可以在这一次的事件轮询中更新 dom

**event loop 与 vue nextTick**

**vue nextTick 为什么要优先使用微任务实现？**

1） vue nextTick 的源码实现，优先级判断，总结就是 Promise > MutationObserver > setImmediate > setTimeout

2）这里优先使用 Promise，因为根据 event loop 与浏览器更新渲染时机，使用微任务，本次 event loop 轮询就可以获取到更新的 dom

3）如果使用宏任务，要到下一次 event loop 中，才能获取到更新的 dom

**Node 中的 process.nextTick**

有很多文章把 Node 的 process.nextTick 和微任务混为一谈，但其实并不是同一个东西

process.nextTick 是 Node.js 自身定义实现的一种机制，有自己的 nextTickQueue

process.nextTick 执行顺序早于微任务

#### 定时器

JS 提供了一些原生方法来实现延时去执行某一段代码

**setTimeout/**

setTimeout 固定时长后执行

setInterval 间隔固定时间重复执行

setTimeout、setInterval 最短时长为 4ms

**定时器不准的原因**

setTimeout/setInterval 的执行时间并不是确定的

setTimeout/setInterval 是宏任务，根据事件轮询机制，其他任务会阻塞或延迟 js 任务的执行

考虑极端情况，假如定时器里面的代码需要进行大量的计算，或者是 DOM 操作，代码执行时间超过定时器的时间，会出现定时器不准的情况

**setTimeout/setInterval 动画卡顿**

不同设备的屏幕刷新频率可能不同， setTimeout/setInterval 只能设置固定的时间间隔，这个时间和屏幕刷新间隔可能不同

setTimeout/setInterval 通过设置一个间隔时间，来不断改变图像实现动画效果，在不同设备上可能会出现卡顿、抖动等现象

**requestAnimationFrame**

requestAnimationFrame 是浏览器专门为动画提供的 API

requestAnimationFrame 刷新频率与显示器的刷新频率保持一致，使用该 api 可以避免使用 setTimeout/setInterval 造成动画卡顿的情况

requestAnimationFrame：告诉浏览器在下次重绘之前执行传入的回调函数(通常是操纵 dom，更新动画的函数)

**setTimeout、setInterval、requestAnimationFrame 三者的区别**

**1）引擎层面**

setTimeout 属于 JS 引擎 ，存在事件轮询

requestAnimationFrame 属于 GUI 引擎

JS 引擎与 GUI 引擎是互斥的，也就是说 GUI 引擎在渲染时会阻塞 JS 引擎的计算
这样设计的原因，如果在 GUI 渲染的时候，JS 同时又改变了 dom，那么就会造成页面渲染不同步

**2）性能层面**

当页面被隐藏或最小化时，定时器 setTimeout 仍会在后台执行动画任务
当页面处于未激活的状态下，该页面的屏幕刷新任务会被系统暂停，requestAnimationFrame 也会停止

**Web Worker**

让前端拥有后端的计算能力

在 HTML5 的新规范中，实现了 Web Worker 来引入 js 的 多线程 技术, 可以让我们在页面主运行的 js 线程中，加载运行另外单独的一个或者多个 js 线程
Web Worker 专门处理复杂计算的，从此让前端拥有后端的计算能力
页面大量计算，造成假死

浏览器有 GUI 渲染线程与 JS 引擎线程，这两个线程是互斥的关系
当 js 有大量计算时，会造成 UI 阻塞，出现界面卡顿、掉帧等情况，严重时会出现页面卡死的情况，俗称假死

**计算时长超过多久适合用 Web Worker**

**原则：**

运算时间超过 50ms 会造成页面卡顿，属于 Long task，这种情况就可以考虑使用 Web Worker
但还要先考虑通信时长的问题，假如一个运算执行时长为 100ms, 但是通信时长为 300ms, 用了 Web Worker 可能会更慢

**最终标准：**

计算的运算时长 - 通信时长 > 50ms，推荐使用 Web Worker

## Vue.js

#### Vue 事件修饰符

- .stop - 调用 event.stopPropagation()。阻止事件冒泡
- .prevent - 调用 event.preventDefault()。阻止默认事件
- .capture - 添加事件侦听器时使用 capture 模式。
- .self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
- .{keyCode | keyAlias} - 只当事件是从特定键触发时才触发回调。
- .native - 监听组件根元素的原生事件。
- .once - 只触发一次回调。
- .left - (2.2.0) 只当点击鼠标左键时触发。
- .right - (2.2.0) 只当点击鼠标右键时触发。
- .middle - (2.2.0) 只当点击鼠标中键时触发。
- .passive - (2.3.0) 以 { passive: true } 模式添加侦听器

#### v-for 为什么使用 key

为了高效更新 dom，提高渲染速度

如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快

#### 变量标识符

1、第一个字符必须是一个字母、下划线（\_）或美元（$）,关键字、保留字都不能作为标识符

#### css 选择器优先级

第一优先级：!important 会覆盖页面内任何位置的元素样式 1.内联样式，如 style="color: green"，权值为 1000
2.ID 选择器，如#app，权值为 0100 3.类、伪类、属性选择器，如.foo, :first-child, div[class="foo"]，权值为 0010 4.标签、伪元素选择器，如 div::first-line，权值为 0001 5.通配符、子类选择器、兄弟选择器，如\*, >, +，权值为 0000 6.继承的样式没有权值

#### http 状态码

**5XX（服务器错误）**

500：Internal Server Error，服务器内部错误

501：Not Implemented，未实现

502：Bad Gateway，网关错误

503：Service Unavailable，服务不可用

504：Gateway Timeout，网关超时

505：Http Version Not Support，HPPT 版本不可用

**4XX（客服端错误）**

400：Bad Request，请求格式错误或者无效

401：Unauthorized，未经授权，需要身份验证

403：Forbidden，服务器已经理解请求，但是拒绝执行它

405：Method Not Allowed，请求使用的方法不被允许

408：Request Timeout，请求超时

409：Confict，服务器遇到了冲突，无法完成请求

429：Too Many Requests，因为请求频率过高，服务器拒绝服务请求

**3XX（重定向）**

301: Moved Permanently，永久重定向，表示请求的资源已被永久移动到另一个 URL

302：Found，临时重定向，表示请求的资源暂时被移动到另一个 URL

303：See Other，表示请求的资源已经被处理，可以在另一个 URL 找到所需要的资源

307：Temporary Redirect，与 302 类似，但是客户端应该使用原始请求 URI 进行访问

308：Permanent Redirect，与 301 类似，但是客户端应该使用原始请求 URI 进行访问

**2XX（成功）**

200：OK，请求成功

201：Created，请求已被创建，新的资源已经成功创建

204：No Content，请求已成功处理，但响应报文中没有实体的主体部分返回

206：Partial Content，客户端进行了范围请求，服务器成功执行了这部分的 GET 请求

**1XX（信息状态码）**

100：Continue，指示客户端可以继续发送请求

101：Switching Protocols，指示服务器正在切换协议（比如从 HTTP 到 WebSocket）

102：Processing，指示服务器已经受到并正在处理请求，但尚未完成

103：Early Hints，指示服务器将在稍后发送更多的响应头，用于提供有关的提示信息

#### HTML 中的置换元素

定义：置换元素指内容在渲染时会被替换为外部资源（如图片、视频音频等），这些元素的内容不由 CSS 控制，而是由浏览器根据其属性和外部资源生成的

常见的置换元素：img、video、audio、iframe、audio、canvas、input、textarea、select、object、embed

#### v-model

v-model 是 vue.js 提供的一种语法糖，用于简化表单元素和 vue 实例之间的双向绑定。它相当于将一个属性绑定和一个事件监听器综合使用。

举例：v-modle="value"相当于 v-bind:"value" @input="value=$event.target.value"

#### vue 插槽的种类

默认插槽

具名插槽

作用于插槽

动态插槽名（2.6 新增）

#### 在 vue 中方，dom 渲染在哪个周期中已经完成

mounted 中，需要注意的是，虽然 mounted 钩子函数表示 dom 已经渲染完毕，但并不意味着浏览器已经将所有的元素呈现出来。如果应用该程序存在大量的异步或者有复杂的样式表，那么浏览器可能任需要一些时间来完成渲染过程。因此，在 vue.js 中，建议使用 nextTick()方法确保 dom 已经全部渲染完毕再执行一些需要依赖的操作，例如获取元素尺寸或计算位置。

#### meta 标签

1、字符编码

```
<meta charset="utf-8">
```

2、页面描述

```
<meta name="descript" content="描述">
```

#### 当页面数据发生变化时，会触发 updated 和 beforeUpdate 钩子函数

3、视口设置

```
<meta name="viewport" content="width=device-width, intial-scale=1.0">
```

4、

```
<meta name="descript" content="描述">
```

#### vue 自定义指令有哪些钩子函数

bind、inserted、update、componentUppdated、unbind

```
export default {
  bind(el, binding, vnode) {
    // 指令绑定时调用
  },
  inserted(el, binding, vnode) {
    // 指令插入到 DOM 中时调用
  },
  update(el, binding, vnode, oldVnode) {
    // 指令的值更新时调用
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 指令所在组件的 VNode 更新时调用
  },
  unbind(el, binding, vnode) {
    // 指令与元素解绑时调用
  }
}
```

#### vue 中哪种路由传递参数的方式页面刷新参数不会消失

使用 query 参数传递参数的方式，页面刷新参数不会消失。这是因为 query 参数会以 URL 参数的形式出现在浏览器地址栏中，而页面刷新时 URL 参数不会丢失。

#### vue 中通过哪种方式可以获得事件对象的 event

在 Vue 中，可以给事件处理函数传递一个参数来获取事件对象，这个参数的名称可以自定义，不一定要是 $event，也可以是 event、evt 或者其他的名称。

但是需要注意的是，在模板中使用 $event 这个名称时，Vue 会自动将事件对象作为参数传递给事件处理函数。如果使用其他的名称，则需要手动传递事件对象

#### Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

push()
pop()
shift()
unshift()
splice()
sort()
reverse()

#### vue 中的 props 可以检测哪些类型

String、Number、Boolean、Array、Object、Date、Function、Symbol

#### nextTick 为什么要优先使用微任务实现？

1）vue nextTick 的源码实现，异步优先级判断，总结就是 Promise > MutationObserver > setImmediate > setTimeout

2）优先使用 Promise，因为根据 event loop 与浏览器更新渲染时机，宏任务 → 微任务 → 渲染更新，使用微任务，本次 event loop 轮询就可以获取到更新的 dom

3）如果使用宏任务，要到下一次 event loop 中，才能获取到更新的 dom

**使用场景**

获取 dom 位置等

#### computed 和 watch 有何区别？

1.computed 是依赖已有的变量来计算一个目标变量，大多数情况都是多个变量凑在一起计算出一个变量，并且 computed 具有缓存机制，依赖值不变的情况下其会直接读取缓存进行复用，computed 不能进行异步操作

2.watch 是监听某一个变量的变化，并执行相应的回调函数，通常是一个变量的变化决定多个变量的变化，watch 可以进行异步操作

3.简单记就是：一般情况下 computed 是多对一，watch 是一对多

#### vue 的响应式原理

1、数据劫持，Vue.js 通过 Object.defineProperty()来劫持，即对象属性的读取和修改进行拦截，从而实现对数据的观察

2、发布-订阅模式，Vue.js 利用发布-订阅模式实现数据更新通知。当数据发生变化时，会自动通知订阅了该数据的所有 Watcher 对象进行更新操作

3、依赖收集，Vue.js 在模板编译过程中，会对模板中用到的数据进行依赖收集。当数据发生变化时，会自动重新渲染与该数据相关的部分，从而保证视图的同步更新

举例：当我们在 Vue.js 中使用一个 data 属性时，例如{{message}}，Vue.js 会将其转换为 getter 方法，并在 getter 方法中执行依赖收集操作，将 Watcher 对象添加到数据的订阅列表中，当该数据发生变化时，会触发 setter 方法，在 setter 方法中遍历该数据的所有 Watcher 对象，从而保证视图的同步更新

#### http1.1 和 http2.0 的区别

#### web 端存储数据的方式有哪些，有什么区别

#### vuex 有哪些钩子函数，使用流程

#### vue-router

#### wasm 的底层逻辑

#### electron 编译打包原理

#### promise.all()如何拿到每个值，es6 新特性，鉴权流程

#### 懒加载

#### vue css scoped 原理

1、编译时，会给每个 vue 文件生成一个唯一的 id，会将此 id 添加到当前文件中所有 html 的标签上，如*<div class="demo"></div>* 会被编译成*<div class="demo" data-v-27e4e96e></div>*

2、编译 style 标签时，会将 css 选择器改造成属性选择器，如*.demo{color:red;}*会被编译成*.demo[data-v-27e4e96e]{color:red;}*

#### 虚拟 dom

**什么是虚拟 dom**

*Virtual DOM*是 JS 模拟真实 DOM 节点，这个对象就是更加轻量级的 DOM 的描述

**为什么现在主流的框架都使用虚拟 dom？**

1、前端性能优化的一个秘诀就是尽可能少地操作 DOM，频繁变动 DOM 会造成浏览器的回流或者重绘

2、使用虚拟 dom，当数据变化，页面需要更新时，通过 diff 算法，对新旧虚拟 dom 节点进行对比，比较两棵树的差异，生成差异对象，一次性对 dom 进行批量操作，进而有效提高性能

3、虚拟 dom 本质上时 js 对象，而 dom 与平台强相关，相比之下虚拟 dom 可以进行更方便的跨平台操作，例如服务器渲染、weex 开发等

#### vuex 原理

1）vuex 中的 store 本质就是一个没有 template 模板的隐藏式的 vue 组件

2）vuex 是利用 vue 的 mixin 混入机制，在 beforeCreate 钩子前混入 vuexInit 方法

3）vuexInit 方法实现将 vuex store 注册到当前组件的$store 属性上

4）vuex 的 state 作为一个隐藏的 vue 组件的 data，定义在 state 上面的变量，相当于这个 vue 实例的 data 属性，凡是定义在 data 上的数据都是响应式的

5）当页面中使用了 vuex state 中的数据，就是依赖收集的过程，当 vuex 中 state 中的数据发生变化，就通过调用对应属性的 dep 对象的 notify 方法，去修改视图变化

#### vue-router 原理

1）创建的页面路由会与该页面形成一个路由表（key value 形式，key 为该路由，value 为对应的页面）

2）vue-router 原理是监听 URL 的变化，然后匹配路由规则，会用新路由的页面替换到老的页面 ，无需刷新
3）目前单页面使用的路由有两种实现方式: hash 模式、history 模式

4）hash 模式（路由中带#号），通过 hashchange 事件来监听路由的变化
_window.addEventListener('hashchange', （)=>{})_

5）history 模式，利用了 pushState() 和 replaceState() 方法，实现往 history 中添加新的浏览记录、或替换对应的浏览记录
通过 popstate 事件来监听路由的变化，_window.addEventListener('popstate', （)=>{})_

**路由之间是怎么跳转的？有哪些方式？**

声明式 通过使用内置组件<router-link :to="/home">来跳转

编程式 通过调用 router 实例的 push 方法 router.push({ path: '/home' })或 replace 方法 router.replace({ path: '/home' })

**route 和 router 有什么区别**

route 是“路由信息对象”，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数。 而 router 是“路由实例对象”，包括了路由的跳转方法，钩子函数等。

#### vue3 与 vue2 的区别

1）vue3 性能比 Vue2.x 快 1.2~2 倍

2）使用 proxy 取代 Object.defineproperty，解决了 vue2 中新增属性监听不到的问题，同时 proxy 也支持数组，不需要像 vue2 那样对数组的方法做拦截处理

3）diff 方法优化
vue3 新增了静态标记（patchflag），虚拟节点对比时，就只会对比这些带有静态标记的节点

4）静态提升
vue3 对于不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用即可。vue2 无论元素是否参与更新，每次都会重新创建然后再渲染

5）事件侦听器缓存
默认情况下 onClick 会被视为动态绑定，所以每次都会追踪它的变化，但是因为是同一个函数，所以不用追踪变化，直接缓存起来复用即可

6）按需引入，通过 treeSharking 体积比 vue2.x 更小

7）组合 API（类似 react hooks），可以将 data 与对应的逻辑写到一起，更容易理解

8）提供了很灵活的 api 比如 toRef、shallowRef 等等，可以灵活控制数据变化是否需要更新 ui 渲染

9）更好的 Ts 支持

#### 强缓存、协商缓存

**强缓存**

如为强制缓存，通过 Expires 或 Cache-Control：max-age 判断该缓存是否过期，未过期，直接使用该资源；Expires 和 max-age，如果两者同时存在，则被 Cache-Control 的 max-age 覆盖。

**协商缓存**

如为协商缓存，请求头部带上相关信息如 if-none-match（Etag）与 if-modified-since(last-modified)，验证缓存是否有效，若有效则返回状态码为 304，若无效则重新返回资源，状态码为 200

#### 有1000个dom，要更新其中的100个，如何操作才能减少dom操作

1、使用documentfragment,将需要更新的dom元素挂载到documentfragment上，然后再一次性地将doncmentFragment插入到页面中

2、批量更新dom元素属性，如果需要更新dom元素的属性，例如class、style、innerHTML等，可以将需要更新的属性先存储在一个对象中，然后早用循环遍历要更新的dom元素，一次性地更新它们的属性

#### 控制并发数，例如有100个请求，请合理设计请求

1、手动设置最大并发数：维护一个计数器，每次发起请求前先检查当前并发数是否小于最大并发数，如果是则执行请求，否则等待其他请求完成后再执行

```
const urls = ['url1','url2','url3',...]
const maxConcurrent = 10 //最大并发数
let currentCount = 0 //当前并发数
function fetchData(url) {
  return fetch(url).the(res=>res.json())
}
async function fetchWithcLimit() {
  for (let i = 0; i<urls.length; i++){
    if(currentCount>=maxConcurrent){
      await new Promise(resolve => setTimeout(resolve,1000)) //等待1秒钟
    }
    fetchData(urls[i]).then(data=>{
      console.log(data)
      currentCount--
    })
    currentCount++
  }
}
fetchWithcLimit()
```

2、使用请求队列：将搜游请求加入到一个队列中，每次队列中取出一定数量的请求执行
```
const urls = ['url1','url2','url3',...]
const maxConcurrent = 10 //最大并发数
let currentCount = 0 //当前并发数
const queue=urls.map(url=>{
  ()=>{
    fetch(url).the(res=>res.json())
  }
})
async function fetchWithcLimit() {
  while(quequ.length>=0){
    if(currentCount<maxConcurrent){
      const task = quequ.shift()
      task().then(data=>{
        console.log(data)
        currentCount--
      })
      currentCount++
    }else{
        await new Promise(resolve => setTimeout(resolve,1000)) //等待1秒钟
    }
    
  }
}
fetchWithcLimit()
```


#### 请讲一讲对模块规范的理解

在javascript中，模块规范是指一种将代码组织在小的、独立的单元中，隔离作用域和避免全局变量污染的方法。常见的模块规范包括CommonJS、AMD、ES6 Module等

CommonJS是Node.js采用的模块规范，它使用require和module。exports来定义和导出模块。一个CommomJS模块由若干个函数和变量组成，可以通过require函数加载并使用

AMD是一种异步模块定义规范，适用于浏览器环境下的模块加载。它使用define函数定义模块，并支持在模块内部异步加载其他模块

ES6 Module是ECMAScript6引入的模块规范，它使用import和export关键字来定义和导出模块。一个ES6 Module是一个单独的文件，文件内部的函数和变量默认不会被其他文件访问，需要通过export来导出
