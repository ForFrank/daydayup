#### 0.1+0.2 为什么!=0.3

- 计算机中所有的数据都是以二进制存储的，所以在计算时要把数据先转换成二进制进行计算，然后把计算结果转换成十进制
  但在计算时由于 JS 采用 IEEE754 双精度 64 位浮点数存储数字，只能保存小数点 52 位，并按照 舍 0 补 1，0.1+0.2 二进制理论相加结果第 53 位为 1，进 1 后的值大于 0.3
- 最大安全整数的出现也是这个原因

- [参考 1](https://blog.csdn.net/m0_52743009/article/details/129027679?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EAD_ESQUERY%7Eyljh-2-129027679-blog-119610620.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EAD_ESQUERY%7Eyljh-2-129027679-blog-119610620.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=5)

#### 如何解决 0.1+0.2!=0.3 的问题

- 1、先转换成整数，再相加之后转回小数
- 2、使用 es6 新增的 Number.EPSILON 方法
- 3、使用 number 对象的 toFixed 方法，toFixed 方法可以指定运算结果的小数点后的指定位数的数字，使保留一位小数就是 toFixed(1)
  parseFloat((0.1+0.2).toFixed(1))

#### 原型
