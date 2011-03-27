ProcessList.prototype.start = function() {
    var process, previous_process, process_id, length;
    var quant_time = parseInt($("#qtime").val(), 10);
    var current_id = 0;
    
    this.set_remaining_burst();
    while (this.hasActiveProcesses()) {
        process = this.next_round_process(current_id);
        if (process == false) {
            // If no current process
            if (time.time > 0) {
                gant.initiate_or_continue_process('empty');
            } else {
                gant.push_empty(time.time, time.time, time.time + 1);
            }
            time.tick();
        }
        else {
            if (process.remaining_burst < quant_time) {
                length = process.remaining_burst;
            }
            else {
                length = quant_time;
            }
            gant.push_process(time.time, process.id, time.time, time.time + length, process.color);
            current_id = process.id;
            this.processes[process.id].remaining_burst = this.processes[process.id].remaining_burst - length;
            time.jump(length);
        }
    }
    gant.animate();
}

