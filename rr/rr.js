var PROCESS_MAX_LENGTH = 200;
var PROCESS_MAX_START = 1000;
var PX_PER_SECOND = 20;
var PROCESS_HEIGHT = 30;

function Process(i, l, s, c) {
	this.id = -1;
	if (l < 1 || l > PROCESS_MAX_LENGTH) {
		alert('Incorrect process lenght (1-'+ PROCESS_MAX_LENGTH +').');
		return false;
	}
	if (s < 0 || l > PROCESS_MAX_START) {
		alert('Incorrect process start time (0-'+ PROCESS_MAX_START +').');
		return false;
	}
	this.id = i;
	this.time = l;
	this.length = l * PX_PER_SECOND - 2;
	this.startsAt = s;
	this.color = c;
}
Process.prototype.output = function(time_margin) {
	return '<div id="proc_'+ this.id +'" class="pl" style="height: '+ PROCESS_HEIGHT +'px; width: '+ this.length +'px; margin-left: '+ (time_margin ) +'px; background-color: #'+ this.color +'">&nbsp;'+ this.startsAt +'</div>';
}

function ProcessList() {
	this.processes = {};
	this.count = 0;
	this.colors = ['00ffff', '99ff99', 'ffcccc', 'cc99ff', 'ff66ff', 'dddddd', 'ff6666', 'ff9966'];
	this.cur_time = 0;
}
ProcessList.prototype.addNew = function(time, startsAt) {
	time = parseInt(time, 10);
	startsAt = parseInt(startsAt, 10);
	if (isNaN(time) || isNaN(startsAt)) {
		alert('Incorrect numbers.');
		return false;
	}
	
	var new_id = this.count;
	var new_color = this.colors[new_id % this.colors.length];

	var p = new Process(new_id, time, startsAt, new_color);
	if (p.id == -1) return false;
	if (startsAt < this.cur_time) {
		alert('Please add process after the last process in the list.');
		return false;
	}
	var next_time = startsAt + time;
	$('#starts_at').val(next_time);
	this.cur_time = next_time;
	
	var margin_time = 0;
	if (this.count > 0) {
		var prev_p = this.processes[this.count - 1];
		margin_time = startsAt - (prev_p.startsAt + prev_p.time);
		margin_time = margin_time * PX_PER_SECOND;	
	}
	$('#ProcessList').append(p.output(margin_time));

	this.processes[new_id] = p;
	this.count++;
}
var pl = new ProcessList();