const arr = [1, 3, 103, 5, 8, 6, 7, 99];
const num = arr.reduce((prev, curr) => {
    if (curr > prev) return curr;
    else return prev;
});
console.log(num);