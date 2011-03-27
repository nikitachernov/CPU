ProcessList.prototype.start = function() {
    if ($("#interruptible").val() == 'Y') {
        this.parseProcessesInTime();
    }
    else {
        this.bubbleSortByBurstAndArrivalTime();
        this.parseProcesses();
    }
}

ProcessList.prototype.parseProcessesInTime = function() {
    var process, previous_process;
    this.set_remaining_burst();
    while (this.hasActiveProcesses()) {
        process = this.shortestCurrentProcess();
        if (process == false) {
            // If no current process
            if (time.time > 0) {
                gant.initiate_or_continue_process('empty');
            } else {
                // Else makes new process entry
                gant.push_empty(time.time, time.time, time.time + 1);
            }
        }
        else {
            if (time.time > 0) {
                gant.initiate_or_continue_process('proc', process.id, process.color)
            }
            else {
                // No previous process
                gant.push_process(time.time, process.id, time.time, time.time + 1, process.color);
            }
            this.processes[process.id].remaining_burst--;
        }
        time.tick();
    }
    gant.animate();
}

ProcessList.prototype.parseProcesses = function() {
    for (var k in this.processes) {
        var proc = this.processes[k];
        if (time.time < proc.arrival) {
            gant.push_empty(time.time, time.time, proc.arrival);
            time.jump(proc.arrival - time.time);
        }
        gant.push_process(time.time, proc.id, time.time, time.time + proc.burst, proc.color);
        time.jump(proc.burst);
    }
    gant.animate();
}