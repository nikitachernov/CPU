$(document).ready(function() {
  add_start_button_click_handler();
  console.log("!");
});

  
function add_start_button_click_handler() {
  $("#start").click(function() {
    $("#start, #new_process").hide();
    process_list.startSJF);
  });
}

ProcessList.prototype.startSJF = function() {
  this.current_process = 1;
  this.run_current_process();
}

ProcessList.prototype.run_current_process = function() {
  var process = this.processes[this.current_process];
  process.work()
}

ProcessList.prototype.run_next_process = function() {
  if (this.count > this.current_process) {
    this.current_process = this.current_process + 1;
    this.run_current_process();
  }
}

Process.prototype.work = function() {
  $('#p_work_'+ this.id).animate(
    {width: '0'},
    this.burst * 1000,
    'linear', function() {
      process_list.run_next_process();
    }
  );
}