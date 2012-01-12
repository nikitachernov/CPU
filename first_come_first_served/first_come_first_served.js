ProcessList.prototype.start = function() {
    var proc;
    for (var k in this.processes) {
        // Iterates through processes
        proc = this.processes[k];
        if (time.time < proc.arrival) {
            // Draws empty space before next process arrival
            gant.push_empty(time.time, time.time, proc.arrival - time.time);
        }
        gant.push_process(time.time, proc.id, time.time, proc.burst, proc.color);
    }
    gant.animate();
}