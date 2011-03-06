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

ProcessList.prototype.animate = function(gant, last_time) {
    $('#gant_area').show();
    this.gant_result = gant;
    this.end_time = last_time;
    this.current_time = 0;
    this.runNextProcess();
}

ProcessList.prototype.runNextProcess = function() {
    if (this.end_time == this.current_time) {
        $('#gant').append('<div class="gant_last_time">&nbsp;<div class="gant_time">' + this.end_time + '</div></div>');
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
    if (gant_proc.type == 'proc') {
        var current_width = $('#p_work_' + gant_proc.id).width();
        var new_width = current_width - length * PX_PER_SECOND + 2;
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
        gant_proc_id = 'gant_proc_' + gant_proc.id;
        div_html = '<div class="gant_process" id="' + gant_proc_id + '" style="background-color: #'
        + gant_proc.color + '"><div class="gant_time">' + gant_proc.start + '</div>P' + gant_proc.id + '</div>';
    } else {
        gant_proc_id = 'gant_proc_empty_' + gant_proc.start;
        div_html = '<div class="gant_process empty_bg" id="' + gant_proc_id
        + '">&nbsp;<div class="gant_time">' + gant_proc.start + '</div></div>';
        setTimeout('process_list.runNextProcess()', animation_delay);
    }
    $('#gant').append(div_html);
    $('#' + gant_proc_id).animate(
    {
        'width': length * PX_PER_SECOND - 2
    },
    animation_delay,
    'linear'
    );
}

ProcessList.prototype.hasActiveProcesses = function() {
    var flag = false;
    var k;
    for (k in this.processes) {
        if (this.processes[k].remaining_burst > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}