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
const 申明只应用到顶级原语或对象。换句话说，赋值为对象的 const 变量不能再被赋值为其他引用值，但对象的键则不受影响
如果想让整个对象都不能修改，可以用 Object.freeze()
let 和 const 不可以重复申明，暂时性死区

let 和 const 变量不会绑定到 window 上
const 使用时必须赋值
**作用域**
作用域是可访问变量的集合，最大的用处就是隔离变量，不同作用域下同名变量不会有冲突
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
#### js中类数组转为数组
1、Array.from

2、使用展开运算符

3、使用bind
```
// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);

// ...

slice(arguments);
```
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

