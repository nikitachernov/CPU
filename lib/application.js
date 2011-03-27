var process_list = new ProcessList();
var time = new Time();
var gant = new Gant();

$(document).ready(function() {
    add_new_process_button_click_handler();
    add_start_button_click_handler();
});

function add_new_process_button_click_handler() {
    $("#new_process").click(function() {
        process_list.addNew($('#atime').val(), $('#btime').val(), $("#process_priority").val());
    });
}

function add_start_button_click_handler() {
    $("#start").click(function() {
        if (process_list.prepareStart()) {
            $("#control").hide();
        }
    });
}

function round_time_result(val) {
    return Math.round(val * 100) / 100;
}