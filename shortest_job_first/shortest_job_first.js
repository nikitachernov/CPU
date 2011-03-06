var time = new Time();

$(document).ready(function() {
    add_start_button_click_handler();
});

function add_start_button_click_handler() {
    $("#start").click(function() {
        $("#start, #new_process").hide();
        process_list.startSJB();
    });
}

ProcessList.prototype.startSJB = function() {
    if ($("#interruptible").val() == 'Y') {
        this.parseProcessesInTime();
    }
    else {
        this.bubble_sort_by_burst();
        this.parseProcesses();
    }
}

ProcessList.prototype.parseProcessesInTime = function() {
    var process;
    var result = {};
    var timer = 0;
    var last_time = 0;
    var previous_process;

    for (var k in this.processes) {
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
        last_time = time.time;
    }
    // console.log(result);
    this.animate(result, last_time);
}

ProcessList.prototype.shortestCurrentProcess = function() {
    var shortest_time = Number.MAX_VALUE;
    var shortest_process;
    var process;
    for (var i in this.processes) {
        process = this.processes[i];
        if (process.remaining_burst > 0 && process.remaining_burst < shortest_time && process.arrival <= time.time) {
            shortest_process = process;
            shortest_time = process.remaining_burst;
        }
    }
    if (shortest_time == Number.MAX_VALUE) return false;
    return shortest_process;
}

ProcessList.prototype.bubble_sort_by_burst = function() {
    var current,
    next;
    var swapped = true;

    do {
        swapped = false;
        for (var i in this.processes) {
            i = parseInt(i, 10);
            if (i == this.count) break;

            current = this.processes[i];
            next = this.processes[i + 1];
            if (current.burst > next.burst && current.arrival == next.arrival) {
                this.processes[i] = next;
                this.processes[i + 1] = current;
                swapped = true;
            }
        }
    }
    while (swapped);
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