var PROCESS_MAX_LENGTH = 200;
var PROCESS_MAX_START = 1000;
var PX_PER_SECOND = 21;
var PROCESS_HEIGHT = 28;

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
  return '<div id="proc_'+ this.id +'" class="pl" style="margin-left: '+ margin + 'px; line-height: '+ PROCESS_HEIGHT +'px; height: '+ PROCESS_HEIGHT +'px; width: '+ width +'px; background-color: #'+ this.color +'">P'+ this.id +' <span>('+ this.arrival +', '+ this.burst +')</span></div>';
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
  for (var i = 0; i <= limit; i+= PX_PER_SECOND * timeline_sec) {
    if (i + PX_PER_SECOND * timeline_sec <= limit) width = PX_PER_SECOND * timeline_sec;
    else width = '20';
    $('#timeline').append('<div  style="width: '+ width +'px;" class="timeline_item"><div class="timeline_item_text">|<br/><span>'+ sec +'</span></div></div>');
    sec+= timeline_sec;
  }
  //$('#timeline').append('<div style=""></div>');
}

ProcessList.prototype.startFIFS = function() {
}

var pl = new ProcessList();