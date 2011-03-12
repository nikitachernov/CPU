function ProcessList() {
    this.processes = {};
    this.count = 0;
    this.colors = ['b1a2f4', 'daa2f4', 'f9a5d5', 'ffaaaa', 'ffccaa', 'ffddaa', 'ffeeaa', 'ffffaa', 'e6fda8', 'a2f4a4', 'a2dff4', 'a2c4f4'];
    this.max_arrival = 0;
}

ProcessList.prototype.addNew = function(arrival, burst) {
    arrival = parseInt(arrival, 10);
    burst = parseInt(burst, 10);

    if (isNaN(arrival) || isNaN(burst)) {
        alert('Incorrect numbers.');
        return false;
    }

    if (this.max_arrival > arrival) {
        alert('Incorrect arrival time. Arrival must be >= ' + this.max_arrival);
        return false;
    }

    $("h2.main").show();

    var new_id = this.count + 1;
    var new_color = this.colors[new_id % this.colors.length];
    var p = new Process(new_id, arrival, burst, new_color);
    if (p.id == -1) return false;

    this.max_arrival = arrival;
    $('#ProcessList').append(p.output());
    this.processes[new_id] = p;
    this.count++;
    if (this.count == 1) {
        this.outputTimeLine();
    }
}

ProcessList.prototype.outputTimeLine = function() {
    $('#timeline').show();
    var doc_width = $('#timeline').width();
    var sec = 0;
    var timeline_sec = 5;
    var limit = doc_width - PX_PER_SECOND * timeline_sec;
    for (var i = 0; i <= limit; i += PX_PER_SECOND * timeline_sec) {
        if (i + PX_PER_SECOND * timeline_sec <= limit) width = PX_PER_SECOND * timeline_sec;
        else width = '20';
        $('#timeline').append('<div  style="width: ' + width + 'px;" class="timeline_item"><div class="timeline_item_text">|<br/><span>' + sec + '</span></div></div>');
        sec += timeline_sec;
    }
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

ProcessList.prototype.next_round_process = function(previous_id) {
    var process, smallest_id;
    for (k in this.processes) {
        process = this.processes[k];
        if (process.remaining_burst > 0 && process.id > previous_id && process.arrival <= time.time) {
            return process;
        }
    }
    // If no process found continue from the beginning
    for (k in this.processes) {
        process = this.processes[k];
        if (process.remaining_burst > 0 && process.id <= previous_id && process.arrival <= time.time) {
            return process;
        }
    }
    // If no process found return false
    return false;
}

ProcessList.prototype.hasActiveProcesses = function() {
    var k;
    for (k in this.processes) {
        if (this.processes[k].remaining_burst > 0) {
            return true;
        }
    }
    return false;
}

ProcessList.prototype.animate = function(gant, last_time) {
    $('#gant_area').show();
    this.gant_result = gant;
    this.end_time = last_time;
    this.current_time = 0;
    this.runNextProcess();
}

ProcessList.prototype.outputResults = function() {
    var results = {};
    for (var k in this.processes) {
        var proc = this.processes[k];
        var started = false;
        var wait = 0;
        var prev_end = 0;
        results[k] = {
            'waiting': wait
        };

        for (var t in this.gant_result) {
            var gant = this.gant_result[t];

            if (gant.type == 'proc' && gant.id == proc.id) {
                if (started == false) {
                    started = true;
                    wait = gant.start - proc.arrival;
                }
                results[k].waiting += wait;
                wait = 0;

            } else {
                wait += gant.end - prev_end;
            }
            prev_end = gant.end;
        }
    }
    var result_rows = '<thead><tr class="bold"><th>Processes</th><th>Arrival time</th><th>Burst time</th><th>Waiting time</th><th>Turnaround time</th></tr></thead>';
    result_rows += '<tbody>'
    var wait_sum = 0;
    var turn_sum = 0;
    var burst_sum = 0;
    for (var k in this.processes) {
        var proc = this.processes[k];
        var wait = results[k].waiting;
        var turn = (proc.burst + wait);
        wait_sum += wait;
        turn_sum += turn;
        burst_sum += proc.burst;
        result_rows += '<tr><td class="middle" style="background-color: #'+ proc.color +'"><b>P' + proc.id + '</b></td><td>' + proc.arrival + '</td><td>' + proc.burst + '</td><td>' + wait + '</td><td>' + turn + '</td></tr>';
    }
    result_rows += '</tbody>'
    $("h2.results").show();
    $('#result_tbl').append(result_rows);
    $('#result_tbl').tablesorter({sortList: [[4,0]]});

    result_rows = '<tr class="bold"><td class="row_name">Average</td><td class="arrival_time">-</td><td class="burst_time">' + round_time_result(burst_sum / this.count) + '</td><td class="wait_time">' + round_time_result(wait_sum / this.count) + '</td><td class="turn_time">' + round_time_result(turn_sum / this.count) + '</td></tr>';
    $('#average_tbl').append(result_rows);
    
}

ProcessList.prototype.runNextProcess = function() {
    if (this.end_time == this.current_time) {
        $('#gant').append('<div class="gant_last_time">&nbsp;<div class="gant_time">' + this.end_time + '</div></div>');
        // last action
        this.outputResults();
        return;
    }
    var gant_proc = this.gant_result[this.current_time];
    this.runNextAnimation(gant_proc);
    this.current_time = gant_proc.end;
}

ProcessList.prototype.runNextAnimation = function(gant_proc) {
    var length = gant_proc.end - gant_proc.start;
    var div_html;
    var gant_proc_id;
    var animation_delay = length * DELAY;
    gant_proc_id = 'gant_proc_' + gant_proc.start;
    if (gant_proc.type == 'proc') {
        var current_width = $('#p_work_' + gant_proc.id).width();
        var new_width = current_width - length * PX_PER_SECOND;
        $('#p_work_' + gant_proc.id).animate(
        {
            width: new_width
        },
        animation_delay,
        'linear',
        function() {
            process_list.runNextProcess();
        }
        );

        div_html = '<div class="gant_process" id="' + gant_proc_id + '" style="background-color: #'
        + gant_proc.color + '"><div class="gant_time">' + gant_proc.start + '</div>P' + gant_proc.id + '</div>';
    } else {
        div_html = '<div class="gant_process empty_bg" id="' + gant_proc_id
        + '">&nbsp;<div class="gant_time">' + gant_proc.start + '</div></div>';
        setTimeout('process_list.runNextProcess()', animation_delay);
    }
    $('#gant').append(div_html);
    $('#' + gant_proc_id).animate({
        'width': length * PX_PER_SECOND - 2
    },
    animation_delay,
    'linear');
}

ProcessList.prototype.bubbleSortByBurst = function() {
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

ProcessList.prototype.prepareStart = function() {
	if (this.count == 0) {
		alert('There is no processes. Please add process.');
		return;
	}
	process_list.start();
}