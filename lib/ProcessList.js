function ProcessList() {
    this.processes = {};
    this.count = 0;
	this.timeline = false;
    this.colors = ['b1a2f4', 'daa2f4', 'f9a5d5', 'ffaaaa', 'ffccaa', 'ffddaa', 'ffeeaa', 'ffffaa', 'e6fda8', 'a2f4a4', 'a2dff4', 'a2c4f4'];
    this.colors_priority = [
        ['d6e9fc', '66acf4', '82bcf6', '9ecbf8', 'badafa'],
        ['fdd8dc', 'f76b7a', 'f98693', 'faa1ab', 'fbbcc3'],
        ['caefbe', '36c20a', '5bcd37', '80d864', 'a5e491']
    ];
}
ProcessList.prototype.clearList = function() {
	this.count = 0;
	this.processes = {};
	$('#ProcessList').html('');
}
ProcessList.prototype.addNew = function(arrival, burst, priority) {
    $("h2.main").show();

	var new_id = this.count + 1;
    var new_color;
    if (priority != undefined) {
        new_color = this.colors_priority[priority - 1][new_id % this.colors_priority[priority - 1].length];
    } else {
        new_color = this.colors[new_id % this.colors.length];
    }
    var p = new Process(new_id, arrival, burst, priority, new_color);
    $('#ProcessList').append(p.output());
    this.processes[new_id] = p;
    this.count++;
    if (this.timeline === false) {
        this.outputTimeLine();
    }
}

ProcessList.prototype.outputTimeLine = function() {
	this.timeline = true;
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

ProcessList.prototype.hasActiveProcesses = function() {
    var k;
    for (k in this.processes) {
        if (this.processes[k].remaining_burst > 0) {
            return true;
        }
    }
    return false;
}

ProcessList.prototype.time_till_interrupt = function(current_process) {
    var shortest_time = current_process.remaining_burst;
    var shortest_process_arrival = time.time + current_process.remaining_burst;
    var process;
    for (var i in this.processes) {
        process = this.processes[i];
        if (process.priority == current_process.priority && process.remaining_burst > 0
            && process.remaining_burst < shortest_time
            && process.arrival <= time.time + current_process.remaining_burst) {
            shortest_time = process.remaining_burst;
            shortest_process_arrival = process.arrival;
        }
    }
    return shortest_process_arrival;
}

ProcessList.prototype.firstCurrentProcessByPriority = function(priority) {
    var earliest_arrive = Number.MAX_VALUE;
    var earliest_process = false;
    var process;
    for (var i in this.processes) {
        process = this.processes[i];
        if (process.priority == priority && process.remaining_burst > 0  && process.arrival < earliest_arrive && process.arrival <= time.time) {
            earliest_process = process;
            earliest_arrive = process.arrival;
        }
    }
    if (earliest_arrive == Number.MAX_VALUE) return false;
    return earliest_process;
}

ProcessList.prototype.shortestCurrentProcessByPriority = function(priority) {
    var shortest_time = Number.MAX_VALUE;
    var shortest_process = false;
    var process;
    for (var i in this.processes) {
        process = this.processes[i];
        if (process.priority == priority && process.remaining_burst > 0 && process.remaining_burst < shortest_time && process.arrival <= time.time) {
            shortest_process = process;
            shortest_time = process.remaining_burst;
        }
    }
    if (shortest_time == Number.MAX_VALUE) return false;
    return shortest_process;
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
    var process, k;
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

ProcessList.prototype.next_round_process_by_priority = function(previous_id, priority) {
    var process, k;
    for (k in this.processes) {
        process = this.processes[k];
        if (process.priority == priority && process.remaining_burst > 0 && process.id > previous_id && process.arrival <= time.time) {
            return process;
        }
    }
    // If no process found continue from the beginning
    for (k in this.processes) {
        process = this.processes[k];
        if (process.priority == priority && process.remaining_burst > 0 && process.id <= previous_id && process.arrival <= time.time) {
            return process;
        }
    }
    // If no process found return false
    return false;
}


ProcessList.prototype.bubbleSortByBurstAndArrivalTime = function() {
    var current, next;
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