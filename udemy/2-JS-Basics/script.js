//var name = 'John';
//console.log(name);
//
//var lastName = 'Smith';
//console.log(lastName);
//
//var age = 26;
//console.log(age);
//
//
//var fullAge = true;
//console.log(fullAge);

function getScore(age, height) {
    const multiplier = 5;
    let score = height + age * multiplier;
    return score;
}

const billAge = 29;
const billHeight = 210;
const billScore = getScore(billAge, billHeight);

const joeAge = 19;
const joeHeight = 300;
const joeScore = getScore(joeAge, joeHeight);

const fredAge = 23;
const fredHeight = 185;
const fredScore = getScore(fredAge, fredHeight);

console.log('Bill\'s Score: ' + billScore);
console.log('Joe\'s Score: ' + joeScore);
console.log('Fred\'s Score: ' + fredScore);

if (billScore > joeScore && billScore > fredScore) {
    console.log('Bill wins with a score of ' + billScore);
} else if (joeScore > billScore && joeScore > fredScore) {
    console.log('Joe wins with a score of ' + joeScore);
} else {
    console.log('Fred wins with a score of ' + fredScore);
}
