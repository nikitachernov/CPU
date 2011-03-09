ProcessList.prototype.start = function() {
    var process, previous_process;
    var result = {};

    var quant_time = parseInt($("#qtime").val(), 10);

    for (var k in this.processes) { // Sets every process remaining burst
        process = this.processes[k];
        process.remaining_burst = process.burst;
    }

    var current_id = 0;
    var process_id;
    var length;
    while (this.hasActiveProcesses()) {
        process = this.next_round_process(current_id);
        console.log(process);
        /* [0: {'type': 'process', 'id' : 5, start: 0, end: 5,  color: },
            5: {'type': 'empty',             start: 5, end: 15, color: }] */
        if (process == false) {
            // If no current process
            if (time.time > 0) {
                for (process_id in result) {
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
            time.tick();
        }
        else {
            if (process.remaining_burst < quant_time)
                length = process.remaining_burst;
            else 
                length = quant_time;
            result[time.time] = {
                'type': 'proc',
                'id': process.id,
                'start': time.time,
                'end': (time.time + length),
                'color': process.color
            };
            current_id = process.id;
            this.processes[process.id].remaining_burst = this.processes[process.id].remaining_burst - length;
            time.jump(length);
        }
    }
    // console.log(result);
    this.animate(result, time.time);
}

