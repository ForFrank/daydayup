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
- 方法：1、JSON.parse(JSON.stringfy()) 2、使用递归手写 3、第三方库，如lodash等
- JSON.parse(JSON.stringfy())
缺点：无法拷贝函数、正则、时间格式、原型属性上的方法、会忽略undefined、symbol，无法处理循环引用的情况
#### 时间轮询机制 Event Loop
宏任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行下一个任务

微任务指的是，不进入主线程、而进入"微任务列表"的任务
当前宏任务执行完后，会判断微任务列表中是否有任务。如果有，会把该微任务放到主线程中并执行，如果没有，就继续执行下一个宏任务

**宏任务 微任务**
**1）宏任务（Macrotasks）**

script全部代码（注意同步代码也属于宏任务）、setTimeout、setInterval、setImmediate等

**2）微任务（Microtasks）**

Promise、MutationObserver

**事件轮询机制执行过程**

1）代码执行过程中，宏任务和微任务放在不同的任务队列中

2）当某个宏任务执行完后,会查看微任务队列是否有任务。如果有，执行微任务队列中的所有微任务(注意这里是执行所有的微任务)

3）微任务执行完成后，会读取宏任务队列中排在最前的第一个宏任务（注意宏任务是一个个取），执行该宏任务，如果执行过程中，遇到微任务，依次加入微任务队列

4）宏任务执行完成后，再次读取微任务队列里的任务，依次类推。

**async、await事件轮询执行时机**

async隐式返回Promise，会产生一个微任务
await后面的代码是在微任务时执行

**event loop 与 浏览器更新渲染时机**

1） 浏览器更新渲染会在event loop中的 宏任务 和 微任务 完成后进行，即宏任务 →  微任务  →  渲染更新（先宏任务 再微任务，然后再渲染更新）

2）宏任务队列中，如果有大量任务等待执行时，将dom的变动作为微任务，能更快的将变化呈现给用户，这样就可以在这一次的事件轮询中更新dom

**event loop与 vue nextTick**

**vue nextTick为什么要优先使用微任务实现？**

1） vue nextTick的源码实现，优先级判断，总结就是Promise > MutationObserver > setImmediate > setTimeout 

2）这里优先使用Promise，因为根据event loop与浏览器更新渲染时机，使用微任务，本次event loop轮询就可以获取到更新的dom

3）如果使用宏任务，要到下一次event loop中，才能获取到更新的dom

**Node中的process.nextTick**

有很多文章把Node的process.nextTick和微任务混为一谈，但其实并不是同一个东西

process.nextTick 是 Node.js 自身定义实现的一种机制，有自己的 nextTickQueue

process.nextTick执行顺序早于微任务

#### 定时器

JS提供了一些原生方法来实现延时去执行某一段代码

**setTimeout/**

setTimeout固定时长后执行

setInterval间隔固定时间重复执行

setTimeout、setInterval最短时长为4ms

**定时器不准的原因**

setTimeout/setInterval的执行时间并不是确定的

setTimeout/setInterval是宏任务，根据事件轮询机制，其他任务会阻塞或延迟js任务的执行

考虑极端情况，假如定时器里面的代码需要进行大量的计算，或者是DOM操作，代码执行时间超过定时器的时间，会出现定时器不准的情况

**setTimeout/setInterval 动画卡顿**

不同设备的屏幕刷新频率可能不同， setTimeout/setInterval只能设置固定的时间间隔，这个时间和屏幕刷新间隔可能不同

setTimeout/setInterval通过设置一个间隔时间，来不断改变图像实现动画效果，在不同设备上可能会出现卡顿、抖动等现象

**requestAnimationFrame**

requestAnimationFrame 是浏览器专门为动画提供的API

requestAnimationFrame刷新频率与显示器的刷新频率保持一致，使用该api可以避免使用setTimeout/setInterval造成动画卡顿的情况

requestAnimationFrame：告诉浏览器在下次重绘之前执行传入的回调函数(通常是操纵dom，更新动画的函数)

**setTimeout、setInterval、requestAnimationFrame 三者的区别**

**1）引擎层面**

setTimeout属于 JS引擎 ，存在事件轮询

requestAnimationFrame 属于 GUI引擎

JS引擎与GUI引擎是互斥的，也就是说 GUI引擎在渲染时会阻塞JS引擎的计算
这样设计的原因，如果在GUI渲染的时候，JS同时又改变了dom，那么就会造成页面渲染不同步

**2）性能层面**

当页面被隐藏或最小化时，定时器 setTimeout仍会在后台执行动画任务
当页面处于未激活的状态下，该页面的屏幕刷新任务会被系统暂停，requestAnimationFrame也会停止

**Web Worker**

让前端拥有后端的计算能力

在HTML5的新规范中，实现了 Web Worker 来引入 js 的 多线程 技术, 可以让我们在页面主运行的js线程中，加载运行另外单独的一个或者多个 js线程
Web Worker专门处理复杂计算的，从此让前端拥有后端的计算能力
页面大量计算，造成假死

浏览器有GUI渲染线程与JS引擎线程，这两个线程是互斥的关系
当js有大量计算时，会造成UI 阻塞，出现界面卡顿、掉帧等情况，严重时会出现页面卡死的情况，俗称假死

**计算时长超过多久适合用Web Worker**

**原则：**

运算时间超过50ms会造成页面卡顿，属于Long task，这种情况就可以考虑使用Web Worker
但还要先考虑通信时长的问题，假如一个运算执行时长为100ms, 但是通信时长为300ms, 用了Web Worker可能会更慢

**最终标准：**

计算的运算时长 - 通信时长 > 50ms，推荐使用Web Worker


## Vue.js
**Vue事件修饰符**
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



