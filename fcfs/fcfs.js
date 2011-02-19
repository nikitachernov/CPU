$(document).ready(function() {
  _limit = 100; // Limit width
  _quotient = 3; // Width quotient

  // Sets loaded document's initial process width
  set_default_process_width();

  // Sets process burst time change handler
  $(".p_time").keyup(function() {
    set_process_width($(this));
  });

  // Sets start button click handler
  $("#start").click(function() {
    start();
  });

  // Sets reset button click handler
  $("#reset").click(function() {
    set_default_process_width();
  });

  // Sets reset button click handler
  $("#revert").click(function() {
    revert();
  });

});

function set_default_process_width() {
  $(".p_time").each(function() {
    set_process_width($(this));
  });
}

function set_process_width($input) {
  $("#results").hide();
  var $process = $("#" + $input.attr("id").replace('_time', '')); // Gets process element
  var value = parseInt($input.val());

  if (isNaN(value)) {
    $input.val('');
    $process.css("width", 0);
  }
  else {
    if (value < 0) value = 0
    else if (value > _limit) value = _limit;
    $input.val(value);
    $process.css("width", value * _quotient);
  }
}

function start() {
  set_default_process_width();
  delay = parseInt($("#delay").val());
  set_start_results();
  start_reduce_p1();
}

function set_start_results() {
  $("#results").show();
  $("#average_waiting_time").hide();
  $("#p2_waiting_time").html($("#p1_time").val());
  $("#p3_waiting_time").html(parseInt($("#p1_time").val()) + parseInt($("#p2_time").val()));
}

function start_reduce_p1() {
  process = $("#p1").attr("id");
  width = parseInt($("#p1").css("width"));
  reduce_p1();
}

function start_reduce_p2() {
  process = $("#p2").attr("id");
  width = parseInt($("#p2").css("width"));
  reduce_p2();
}

function start_reduce_p3() {
  process = $("#p3").attr("id");
  width = parseInt($("#p3").css("width"));
  reduce_p3();
}

function reduce_p1() {
  if (width > 0) {
    width -= 1;
    $("#p2_waiting_time").html(parseInt(parseInt($("#p1_time").val()) - width / _quotient));
    $("#p3_waiting_time").html(parseInt($("#p2_waiting_time").html()));
    $("#total_burst_time").html(parseInt($("#p2_waiting_time").html()));
    $("#" + process).css("width", width);
    setTimeout('reduce_p1()', delay);
  }
  else {
    start_reduce_p2();
  }
}

function reduce_p2() {
  if (width > 0) {
    width -= 1;
    $("#p3_waiting_time").html(parseInt(parseInt($("#p2_waiting_time").html()) + parseInt($("#p2_time").val()) - width / _quotient));
    $("#total_burst_time").html(parseInt($("#p3_waiting_time").html()));
    $("#" + process).css("width", width);
    setTimeout('reduce_p2()', delay);
  }
  else {
    do_average();
    start_reduce_p3();
  }
}

function reduce_p3() {
  if (width > 0) {
    width -= 1;
    $("#total_burst_time").html(parseInt(parseInt($("#p3_waiting_time").html()) + parseInt($("#p3_time").val()) - width / _quotient));
    $("#" + process).css("width", width);
    setTimeout('reduce_p3()', delay);
  }
}

function do_average() {
  $("#average_waiting_time").show();
  $("#average_waiting_time_value").html(parseInt(
    (0 + parseInt($("#p2_waiting_time").html()) + parseInt($("#p3_waiting_time").html()))/3
    ));
}

function revert() {
  value_1 = $("#p1_time").val();
  value_3 = $("#p3_time").val();
  $("#p1_time").val(value_3);
  $("#p3_time").val(value_1);
  
  set_default_process_width();
}
