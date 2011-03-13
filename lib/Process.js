var PROCESS_MAX_LENGTH = 200;
var PROCESS_MAX_START = 1000;
var PX_PER_SECOND = 21;
var DELAY = 100;

function Process(i, arrival, burst, priority, color) {
    this.id = -1;

    if (arrival < 0 || arrival > PROCESS_MAX_START) {
        alert('Incorrect process arrival time (1-' + PROCESS_MAX_LENGTH + ').');
        return false;
    }

    if (burst < 1 || burst > PROCESS_MAX_LENGTH) {
        alert('Incorrect process burst time (0-' + PROCESS_MAX_START + ').');
        return false;
    }

    this.id = i;
    this.burst = burst;
    this.arrival = arrival;
    this.priority = priority;
    this.color = color;
}

Process.prototype.output = function() {
    this.margin = this.arrival * PX_PER_SECOND;
    this.width = this.burst * PX_PER_SECOND - 2;
    return '<div id="proc_' + this.id + '" class="process_list" style="margin-left: ' + this.margin + 'px; width: ' +
    this.width + 'px;">' +
    '<div style="width: 100%; float: right; background-color: #' + this.color + '" id="p_work_' + this.id + '">&nbsp;</div>' +
    '<div style="width: 100%; position: absolute; left: 0; top:0;">P' + this.id + '</div>'
    '</div>';
}
