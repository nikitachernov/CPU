var process_list = new ProcessList();
var time = new Time();
var gant = new Gant();

$(document).ready(function() {
	process_list.addNewRow();
    add_new_process_button_click_handler();
    add_start_button_click_handler();
    and_enter_time_handler();
});

function add_new_process_button_click_handler() {
    $("#new_process").click(function() {
        process_list.addNewRow();
    });
}

function add_start_button_click_handler() {
    $("#start").click(function() {
        if (process_list.prepareStart()) {
            // $("#control").children(":not(:last-child)").hide();
            $("input, select").attr("disabled", true);
        }
    });
}

function round_time_result(val) {
    return Math.round(val * 100) / 100;
}

function and_enter_time_handler() {
    $("input").live("keyup", function() {
       $(this).val($(this).val().replace(/\D/g, ''));
    });
}