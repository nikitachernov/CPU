ProcessList.prototype.start = function() {
    if ($("#interruptible").val() == 'Y') {
        this.parseProcessesInTime();
    }
    else {
        this.bubbleSortByBurst();
        this.parseProcesses();
    }
}

ProcessList.prototype.parseProcessesInTime = function() {
    var process, previous_process;
    var result = {};

    for (var k in this.processes) { // Sets every process remaining burst
        process = this.processes[k];
        process.remaining_burst = process.burst;
    }

    while (this.hasActiveProcesses()) {
        process = this.shortestCurrentProcess();
        /* [0: {'type': 'process', 'id' : 5, start: 0, end: 5,  color: },
            5: {'type': 'empty',             start: 5, end: 15, color: }] */
        if (process == false) {
            // If no current process
            if (time.time > 0) {
                for (var process_id in result) {
                    // Selects last entry
                    previous_process = result[process_id];
                }
                if (previous_process['type'] == 'empty') {
                    // If previous process was empty
                    result[previous_process['start']]['end'] = (time.time + 1);
                    // Continues it
                }
                else {
                    // Else makes new process entry
                    result[time.time] = {
                        'type': 'empty',
                        'start': time.time,
                        'end': time.time + 1,
                        'color': 'gray'
                    };
                }
            } else {
                // Else makes new process entry
                result[time.time] = {
                    'type': 'empty',
                    'start': time.time,
                    'end': time.time + 1,
                    'color': 'gray'
                };
            }
        }
        else {
            if (time.time > 0) {
                // If there is a previous process
                for (var process_id in result) {
                    previous_process = result[process_id];
                }
                if (previous_process['id'] == process.id) {
                    // If current process is current - write into previous attribute
                    result[previous_process['start']]['end'] = (time.time + 1);
                } else {
                    // Make new
                    result[time.time] = {
                        'type': 'proc',
                        'id': process.id,
                        'start': time.time,
                        'end': (time.time + 1),
                        'color': process.color
                    };
                }
            }
            else {
                // No previous process
                result[time.time] = {
                    'type': 'proc',
                    'id': process.id,
                    'start': time.time,
                    'end': (time.time + 1),
                    'color': process.color
                };
            }
            this.processes[process.id].remaining_burst--;
        }
        time.tick();
    }
    this.animate(result, time.time);
}

ProcessList.prototype.parseProcesses = function() {
    var result = {};
    var timer = 0;
    var last_time = 0;

    /* [0: {'type': 'process', 'id' : 5, start: 0, end: 5,  color: },
        5: {'type': 'empty',             start: 5, end: 15, color: }] */
    for (var k in this.processes) {
        var proc = this.processes[k];
        if (timer < proc.arrival) {
            result[timer] = {
                'type': 'empty',
                'start': timer,
                'end': proc.arrival,
                'color': 'gray'
            };
            timer = proc.arrival;
        }
        result[timer] = {
            'type': 'proc',
            'id': proc.id,
            'start': timer,
            'end': (timer + proc.burst),
            'color': proc.color
        };
        timer += proc.burst;
        last_time = timer;
    }
    this.animate(result, last_time);
}