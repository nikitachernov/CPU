$(document).ready(function() {
  add_start_button_click_handler();
});

  
function add_start_button_click_handler() {
  $("#start").click(function() {
    process_list.startFIFS();
  });
}


ProcessList.prototype.startFIFS = function() {
  var process;
  for (var i in this.processes) {
    process = this.processes[i];
    process.work();
  }
}

