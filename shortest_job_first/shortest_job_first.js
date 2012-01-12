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
    while (this.hasActiveProcesses()) {
        process = this.shortestCurrentProcess();
        if (process == false)
            gant.initiate_or_continue_process('empty');
        else
            gant.initiate_or_continue_process('proc', process.id, process.color, 1);
    }
    gant.animate();
}

ProcessList.prototype.parseProcesses = function() {
    var proc;
    for (var k in this.processes) {
        // Iterates through processes
        proc = this.processes[k];
        if (time.time < proc.arrival) {
            // Draws empty space before next process arrival
            gant.push_empty(time.time, time.time, proc.arrival - time.time);
        }
        gant.push_process(time.time, proc.id, time.time, proc.burst, proc.color, 1);
    }
    gant.animate();
}