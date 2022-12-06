var counter  = 1;
setInterval(function() {
    document.getElementById("home__slide-radio" + counter).checked = true;
    counter++;
    if(counter > 4) {
        counter = 1;
    }
}, 3000);