ProcessList.prototype.start = function() {
    var process, previous_process, process_id, length;
    var quant_time = parseInt($("#qtime").val(), 10);
    var current_id = 0;
    while (this.hasActiveProcesses()) {
        process = this.next_round_process(current_id);
        if (process == false)
            gant.initiate_or_continue_process('empty');
        else {
            if (process.remaining_burst < quant_time)
                length = process.remaining_burst;
            else
                length = quant_time;
            gant.push_process(time.time, process.id, time.time, length, process.color);
            current_id = process.id;
        }
    }
    gant.animate();
}

