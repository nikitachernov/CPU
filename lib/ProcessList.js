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