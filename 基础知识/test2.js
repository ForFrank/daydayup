//计算微信步数
//已知小明2020-08-16至2020-09-15的微信运动步数数据如下：

const steps = [
  { step: 1753, timestamp: 1597507200000 },
  { step: 1637, timestamp: 1597593600000 },
  { step: 6216, timestamp: 1597680000000 },
  { step: 6466, timestamp: 1597766400000 },
  { step: 12998, timestamp: 1597852800000 },
  { step: 7731, timestamp: 1597939200000 },
  { step: 7115, timestamp: 1598025600000 },
  { step: 3603, timestamp: 1598112000000 },
  { step: 1659, timestamp: 1598198400000 },
  { step: 3582, timestamp: 1598284800000 },
  { step: 6979, timestamp: 1598371200000 },
  { step: 4567, timestamp: 1598457600000 },
  { step: 7639, timestamp: 1598544000000 },
  { step: 9150, timestamp: 1598630400000 },
  { step: 8565, timestamp: 1598716800000 },
  { step: 6544, timestamp: 1598803200000 },
  { step: 6316, timestamp: 1598889600000 },
  { step: 15523, timestamp: 1598976000000 },
  { step: 8254, timestamp: 1599062400000 },
  { step: 13552, timestamp: 1599148800000 },
  { step: 6163, timestamp: 1599235200000 },
  { step: 6338, timestamp: 1599321600000 },
  { step: 8508, timestamp: 1599408000000 },
  { step: 4002, timestamp: 1599494400000 },
  { step: 7501, timestamp: 1599580800000 },
  { step: 5922, timestamp: 1599667200000 },
  { step: 9635, timestamp: 1599753600000 },
  { step: 7067, timestamp: 1599840000000 },
  { step: 3878, timestamp: 1599926400000 },
  { step: 4088, timestamp: 1600012800000 },
  { step: 773, timestamp: 1600099200000 } 
]


//请编写一个函数，将其中某个时间段的步数进行小计，返回小计结果
//示例：
//输入：2020-09-01, 2020-09-07
//返回：64654

const fn = function (start,end) {
  // 具体实现

  let newStart = new Data(start).getTime()
  let newEnd = new Data(end).getTime()
  let count = 0
  steps.map((item,index)=>{
    if(item.timestamp>=newStart && tem.timestamp<=newEnd){
      count = count + item.step
    }
  })
  steps.reduce((item,index)=>{
    return item.timestamp - newStart
  })
  return count 
  
}

//reduce方法
const fn = function (start, end) {
  const newStart = new Date(start).getTime();
  const newEnd = new Date(end).getTime();
  const count = steps.reduce((prev, curr) => {
    if (curr.timestamp >= newStart && curr.timestamp <= newEnd) {
      return prev + curr.step;
    } else {
      return prev;
    }
  }, 0);
  return count;
}
const time = fn('2020-09-01 00:00:00', '2020-09-07 23:59:59')
console.log(time);

// 请编写一个函数，实现在一个排序好的数组中查找指定的数值，并返回该数值在数组中的索引。如果该数值不存在，则返回-1。要求算法时间复杂度为O(log n)。 
// 并为其编写测试用例。

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(arr, 7)); // 3
console.log(binarySearch(arr, 10)); // -1
///--------

// 入参格式参考：
const url = 'http://sample.com/?a=1&b=2&c=xx&d#hash';

// 出参格式参考：
const result = querySearch(url)
console.log('result', result) // { a: '1', b: '2', c: 'xx', d: '' }


/*拆解URL参数中queryString，返回一个 key - value 形式的 object*/
function querySearch(url) {
const queryArr = url.split('?')[1].split('&');
const result = {};
for (let i = 0; i < queryArr.length; i++) {
const pair = queryArr[i].split('=');
const key = pair[0];
const value = pair[1] ? pair[1] : '';
result[key] = value;
}
return result;
}