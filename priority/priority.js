$(document).ready(function() {
    add_select_priority_type_change_handler();
});

function add_select_priority_type_change_handler() {
  $("select.priority_type").change(function() {
    switch ($(this).val()) {
      case 'fcfs':
        $(this).closest("div.priority").find("select.priority_interruptible").hide();
        $(this).closest("div.priority").find("div.qtime").hide();
        break;
      case 'sjb':
        $(this).closest("div.priority").find("select.priority_interruptible").show();
        $(this).closest("div.priority").find("div.qtime").hide();
        break;
      case 'rr':
        $(this).closest("div.priority").find("select.priority_interruptible").hide();
        $(this).closest("div.priority").find("div.qtime").show();
        break;
    }
  });
}

ProcessList.prototype.start = function() {
    var priority_1_type = $("#priority_1_type").val();

    switch (priority_1_type) {
      case 'fcfs':
        var priority_1_interruptible = -1;
        var priority_1_qtime = -1;
        break;
      case 'sjb':
        var priority_1_interruptible = $("#priority_1_interruptible").val();
        var priority_1_qtime = -1;
        break;
      case 'rr':
        var priority_1_interruptible = -1;
        var priority_1_qtime = $("#priority_1_qtime").val();
        break;
    }

    var priority_2_type = $("#priority_2_type").val();

    switch (priority_2_type) {
      case 'fcfs':
        var priority_2_interruptible = -1;
        var priority_2_qtime = -1;
        break;
      case 'sjb':
        var priority_2_interruptible = $("#priority_2_interruptible").val();
        var priority_2_qtime = -1;
        break;
      case 'rr':
        var priority_2_interruptible = -1;
        var priority_2_qtime = $("#priority_2_qtime").val();
        break;
    }

    var priority_3_type = $("#priority_3_type").val();

    switch (priority_3_type) {
      case 'fcfs':
        var priority_3_interruptible = -1;
        var priority_3_qtime = -1;
        break;
      case 'sjb':
        var priority_3_interruptible = $("#priority_3_interruptible").val();
        var priority_3_qtime = -1;
        break;
      case 'rr':
        var priority_3_interruptible = -1;
        var priority_3_qtime = $("#priority_3_qtime").val();
        break;
    }
}

