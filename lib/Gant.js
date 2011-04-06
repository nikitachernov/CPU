var PX_PER_SECOND = 21;
var DELAY = 100;

function Gant() {
    /* [0: {'type': 'process', 'id' : 5, start: 0, end: 5,  color: },
        5: {'type': 'empty',             start: 5, end: 15, color: }] */
    this.diagram = {};
}

Gant.prototype.push_empty = function(index, start_time, length) {
    this.diagram[index] = {
        'type': 'empty',
        'start': start_time,
        'end': start_time + length,
        'color': 'gray'
    };
    time.jump(length);
}

Gant.prototype.push_process = function(index, id, start_time, length, color) {
    this.diagram[index] = {
        'type': 'proc',
        'id': id,
        'start': start_time,
        'end': start_time + length,
        'color': color
    };
    var process = process_list.processes[id]
    process.reduce_burst(length);
    process.last_pause = process.last_pause + length;
    time.jump(length);
}

Gant.prototype.last_entry = function() {
    var last_entry;
    if (this.diagram == {})
        last_entry = false;
    else {
        for (var process_id in this.diagram) {
            // Selects last entry
            last_entry = this.diagram[process_id];
        }
    }
    return last_entry;
}

Gant.prototype.initiate_or_continue_process = function(type, id, color, length) {
    var previous_process = this.last_entry();
    switch (type) {
    case 'empty':
        if (previous_process && previous_process['type'] == 'empty') {
            // If previous process was empty
            this.diagram[previous_process['start']]['end'] = (time.time + 1);
            time.tick();
            // Continues it
        }
        else {
            // Else makes new empty entry
            this.push_empty(time.time, time.time, 1);
        }
        break;
    case 'proc':
        if (previous_process && previous_process['type'] == 'proc' && previous_process['id'] == id) {
            // If current process is current - write into previous attribute
            this.diagram[previous_process['start']]['end'] = (time.time + length);
            var process = process_list.processes[id]
            process.reduce_burst(length);
            process.last_pause = process.last_pause + length;
            time.jump(length);
        } else {
            // Make new
            this.push_process(time.time, id, time.time, length, color);
        }
        break;
    }
}

Gant.prototype.animate = function() {
    $('#gant_area').show();
    this.end_time = time.time;
    this.current_time = 0;
    this.runNextProcess();
}

Gant.prototype.runNextProcess = function() {
    if (this.end_time == this.current_time) {
        $('#gant').append('<div class="gant_last_time">&nbsp;<div class="gant_time">' + this.end_time + '</div></div>');
        // last action
        this.outputResults();
        return;
    }
    var gant_proc = this.diagram[this.current_time];
    this.runNextAnimation(gant_proc);
    this.current_time = gant_proc.end;
}

Gant.prototype.runNextAnimation = function(gant_proc) {
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
            gant.runNextProcess();
        }
        );

        div_html = '<div class="gant_process" id="' + gant_proc_id + '" style="background-color: #'
        + gant_proc.color + '"><div class="gant_time">' + gant_proc.start + '</div>P' + gant_proc.id + '</div>';
    } else {
        div_html = '<div class="gant_process empty_bg" id="' + gant_proc_id
        + '">&nbsp;<div class="gant_time">' + gant_proc.start + '</div></div>';
        setTimeout('gant.runNextProcess()', animation_delay);
    }
    $('#gant').append(div_html);
    $('#' + gant_proc_id).animate({
        'width': length * PX_PER_SECOND - 2
    },
    animation_delay,
    'linear');
}

Gant.prototype.outputResults = function() {
    var results = {};
    for (var k in process_list.processes) {
        var proc = process_list.processes[k];
        var started = false;
        var wait = 0;
        var prev_end = 0;
        results[k] = {
            'waiting': wait
        };

        for (var t in this.diagram) {
            var gant = this.diagram[t];

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

    var tbody = '<tbody>';
    var wait_sum = 0;
	var first_proc = true;
    var turn_sum = 0;
    var burst_sum = 0;
	var priority_tbl = false;
    for (var k in process_list.processes) {
        var proc = process_list.processes[k];
        var wait = results[k].waiting;
        var turn = (proc.burst + wait);
        wait_sum += wait;
        turn_sum += turn;
        burst_sum += proc.burst;

		tbody += '<tr><td class="middle" style="background-color: #' + proc.color + '"><b>P' + proc.id + '</b></td>';
		if (proc.priority != undefined) {
			priority_tbl = true;
			tbody += '<td>'+ proc.priority +'</td>';
		}
        tbody += '<td>' + proc.arrival + '</td><td>' + proc.burst + '</td><td>' + wait + '</td><td>' + turn + '</td></tr>';
    }
    tbody += '</tbody>';

	var tfoot = '<tfoot><tr class="empty_space"><th></th></tr><tr class="avg"><th>Average</th>';
	var thead = '<thead><tr class="bold"><th>Processes</th>';
	if (priority_tbl === true) {
		thead += '<th>Priority</th>';
		tfoot += '<th>-</th>';
	}
	thead += '<th>Arrival time</th><th>Burst time</th><th>Waiting time</th><th>Turnaround time</th></tr></thead>';
    tfoot += '<th>-</th><th>' + round_time_result(burst_sum / process_list.count) + '</th><th>' + round_time_result(wait_sum / process_list.count) + '</th><th>' + round_time_result(turn_sum / process_list.count) + '</th></tr></tfoot>';

	$('#result_tbl').append(thead + tfoot + tbody);
	$("h2.results").show();
	$('#result_tbl').tablesorter({
		widgets: ['zebra'],
        sortList: [[(priority_tbl === true ? 5 : 4), 0]]
    });
}