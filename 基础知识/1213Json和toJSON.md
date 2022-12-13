## JSON 对象

- 严格意义上 JSON 对象是不合理的，JSON 是文本协议
- 全局作用域下 JSON 是 Object 对象

## JSON 格式

- JSON 是一种轻量级的、基于文本的，与语言无关的语法，用于定义数据交换格式
- 来源于 ECMAScript 编程语言，但独立于编程语言

## 对象字面量

- - 是创建对象的一种快捷方式
- 对应还有：函数字面量，数组字面量
- 字面量的性能优于使用 new 构建

## JSON 特征

- JSON 是一串字符串，使用特定符号标注
- {} 双括号表示对象，[]中括号表示数组，"“双引号内是属性的键或值

### JSON 键

- 只能是字符串，必须用双引号包裹

### JSON 值

- object, array, number(只能是十进制), string, true,false, null

## JSON.parse()

- JSON.parse(text,reviver(k,v))
- 当前属性名和属性值会分别作为第一个和第二个参数传入 reviver 中。如果 reviver 返回 undefined，则当前属性会从所属对象中删除，如果返回了其他值，则返回的值会成为当前属性新的属性值。

```
const jsonStr = `
	{
  	"name": "rrr",
  	"age":  18,
    "isFans": true,
    "IDCard": "xxxxxxxxxxxxxxxxxx"
   }
`
// 保密身份证
var obj = JSON.parse(jsonStr, function (key, value) {
    if (key == "IDCard") {
        return undefined;
    } else {
        return value;
}});

console.log(obj); //{ name: 'rrr', age: 18, isFans: true }
```

- 遍历顺序：从最内层开始，按照层级顺序，依次向外遍历
- this；当前属性的对象会作为 this 值

## JSON.stringify()

- 语法：JSON.stringify(value[, replacer [, space]])
- value：将要序列化成 一个 JSON 字符串的值。
- replacer：如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。

```
// function
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}

var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
var jsonString = JSON.stringify(foo, replacer);

// JSON 序列化结果为 {"week":45,"month":7}
```

```
// array
JSON.stringify(foo, ['week', 'month']);
// '{"week":45,"month":7}', 只保留“week”和“month”属性值。
```

- space： 指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为 10。该值若小于 1，则意味着没有空格；如果该参数为字符串（当字符串长度超过 10 个字母，取其前 10 个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。

```
// 使用制表符（\t）来缩进
JSON.stringify({ uno: 1, dos : 2 }, null, '\t')
// '{            \
//     "uno": 1, \
//     "dos": 2  \
// }'

```

- 异常：当在循环引用时会抛出异常 TypeError ("cyclic object value")（循环对象值），当尝试去转换 BigInt 类型的值会抛出 TypeError ("BigInt value can't be serialized in JSON")（BigInt 值不能 JSON 序列化）
- toJSON 方法

  ```
  var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  }
  };
  JSON.stringify(obj);      // '"bar"'
  JSON.stringify({x: obj}); // '{"x":"bar"}'

  ```

  ### 其他注意事项

  参考: [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify]()
