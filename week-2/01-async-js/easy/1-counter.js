
// counter in jsvascript

//try to code a counter in Javascript and It should go up as time goes by in intervals of 1 second.

let count = 0;

setInterval(() => {
    count++;
    console.log(count);
}, 1000);

// The above code will log the count value every second, incrementing it by 1 each time.

//without using setInterval

let count2 = 0;

function incrementCounter() {
    count2++;
    console.log(count2);
    setTimeout(incrementCounter, 1000);
}

incrementCounter();