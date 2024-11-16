// Test.js - Testing console logs for debugging purposes

// Simple log to indicate script execution start
console.log('Script execution started.');

// Testing a variable assignment
let number = 42;
console.log('The value of number is:', number);

// Testing conditional logic
if (number > 20) {
    console.log('Number is greater than 20.');
} else {
    console.log('Number is less than or equal to 20.');
}

// Testing an array and iterating over it
let fruits = ['Apple', 'Banana', 'Cherry'];
console.log('Fruits array:', fruits);

for (let i = 0; i < fruits.length; i++) {
    console.log(`Fruit at index ${i}:`, fruits[i]);
}

// Testing a function
function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet('Alice');
greet('Bob');

// Testing an object and accessing its properties
let car = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2021
};

console.log('Car object:', car);
console.log('Car make:', car.make);
console.log('Car model:', car.model);
console.log('Car year:', car.year);

// Simple log to indicate script execution end
console.log('Script execution ended.');