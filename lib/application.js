var process_list = new ProcessList();
var time = new Time();

$(document).ready(function() {
    add_new_process_button_click_handler();
    add_start_button_click_handler();
});

function add_new_process_button_click_handler() {
    $("#new_process").click(function() {
        process_list.addNew($('#atime').val(), $('#btime').val());
    });
}

function add_start_button_click_handler() {
    $("#start").click(function() {
        $("#start, #new_process").hide();
        process_list.start();
    });
}

function round_time_result(val) {
	return Math.round(val * 100) / 100;
}