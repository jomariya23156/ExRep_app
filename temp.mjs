// import _ from 'underscore'
// const selected = _.sample(["AlmostDone", "Halfway"]);
// console.log(selected)

function getMostFrequent(arr) {
    const hashmap = arr.reduce( (acc, val) => {
     acc[val] = (acc[val] || 0 ) + 1
     return acc
  },{})
 return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
 }

var temp = ['up', 'down', 'up' ,'down','a','a' ]

console.log(getMostFrequent(temp));