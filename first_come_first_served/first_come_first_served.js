ProcessList.prototype.start = function() {
    for (var k in this.processes) {
        var proc = this.processes[k];
        if (time.time < proc.arrival) {
            // Draws empty space before process arrival
            gant.push_empty(time.time, time.time, proc.arrival);
            time.jump(proc.arrival - time.time);
        }
        gant.push_process(time.time, proc.id, time.time, time.time + proc.burst, proc.color);
        time.jump(proc.burst);
    }
    gant.animate();
}