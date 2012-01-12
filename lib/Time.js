function Time() {
    this.time = 0;
}

Time.prototype.tick = function() {
    this.time++;
}

Time.prototype.jump = function(gap) {
    this.time = this.time + gap;
}

Time.prototype.reset = function() {
     this.time = 0;
}
