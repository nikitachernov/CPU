var PROCESS_MAX_LENGTH = 200;
var PROCESS_MAX_START = 1000;
var PX_PER_SECOND = 20;
var PROCESS_HEIGHT = 30;

function Process(i, arrival, burst, color) {
	this.id = -1;
	if (arrival < 0 || arrival > PROCESS_MAX_LENGTH) {
		alert('Incorrect process arrival time (1-'+ PROCESS_MAX_LENGTH +').');
		return false;
	}
	if (burst < 1 || burst > PROCESS_MAX_START) {
		alert('Incorrect process burst time (0-'+ PROCESS_MAX_START +').');
		return false;
	}
	this.id = i;
	this.burst = burst;
	this.arrival = arrival;
	this.color = color;
}
Process.prototype.output = function() {
	var margin = this.arrival * PX_PER_SECOND;
	var width = this.burst * PX_PER_SECOND - 2;
	return '<div id="proc_'+ this.id +'" class="pl" style="margin-left: '+ margin + 'px; height: '+ PROCESS_HEIGHT +'px; width: '+ width +'px; background-color: #'+ this.color +'">P'+ this.id +' ('+ this.arrival +', '+ this.burst +')</div>';
}

function ProcessList() {
	this.processes = {};
	this.count = 0;
	this.colors = ['00ffff', '99ff99', 'ffcccc', 'cc99ff', 'ff66ff', 'dddddd', 'ff6666', 'ff9966'];
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
		alert('Incorrect arrival time. Arrival must be >= '+ this.max_arrival);
		return false;
	}
	
	var new_id = this.count + 1;
	var new_color = this.colors[new_id % this.colors.length];
	var p = new Process(new_id, arrival, burst, new_color);
	if (p.id == -1) return false;
	
	this.max_arrival = arrival;
	/*if (startsAt < this.cur_time) {
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
	*/
	$('#ProcessList').append(p.output());

	this.processes[new_id] = p;
	this.count++;
}
ProcessList.prototype.startFIFS = function() {
	
}

var pl = new ProcessList();