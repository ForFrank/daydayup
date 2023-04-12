function findStr(str) {
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length; j++) {
      if (str[i] === str[j]) {
        arr.push(j - i);
        break;
      }
    }
  }
  let res = Math.max(...arr);
  return res;
}
findStr("abcabcbb");
findStr("pwwkew");
findStr("pwwkerhjw");
