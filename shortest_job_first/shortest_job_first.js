$(document).ready(function() {
  add_start_button_click_handler();
});

  
function add_start_button_click_handler() {
  $("#start").click(function() {
    $("#start, #new_process").hide();
    process_list.startSJF();
  });
}

ProcessList.prototype.startSJF = function() {
  var process;
  for (id in this.processes) {
    process = this.processes[id];
    process.terminated = 'N';
  }
  this.run_shortest_process();
}

ProcessList.prototype.run_shortest_process = function() {
  var shortest_process_id = 0;
  var shortest_proces_burst = 0;
  var process;
  for (id in this.processes) {
    process = this.processes[id];
    console.log(process.terminated);
    if (process.terminated == 'N' && (process.burst < shortest_proces_burst || shortest_proces_burst == 0)) {
      shortest_proces_burst = process.burst;
      shortest_process_id = process.id;
    }
  }
  if (shortest_process_id > 0)
    this.processes[shortest_process_id].work();
}

ProcessList.prototype.run_next_shortest_process = function() {
  this.run_shortest_process();
}

Process.prototype.work = function() {
  var process = this;
  $('#p_work_'+ this.id).animate(
    {width: '0'},
    process.burst * 1000,
    'linear', function() {
      process.terminated = 'Y';
      process_list.run_next_shortest_process();
    }
  );
}