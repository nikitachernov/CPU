var process_list = new ProcessList();
var process_table = new ProcessTable();
var time = new Time();
var gant = new Gant();

$(document).ready(function() {
	process_table.addRow();
    add_start_button_click_handler();
    and_enter_time_handler();
	add_preview_button_click_handler();
	//add_reset_click_handler();
});

function add_preview_button_click_handler() {
    $("#preview").click(function() {
		process_list.clearList();
        gant.reset();
        process_table.previewGraph();
    });
}

function add_reset_click_handler() {
    $("#reset").click(function() {
        $("input, select").attr("disabled", false);
        process_list.clearList();
        gant.reset();
    });
}

function add_start_button_click_handler() {
    $("#start").click(function() {
		process_list.clearList();
		gant.reset();
		if (process_table.start()) {

            // $("#control").children(":not(:last-child)").hide();
            $("input, select").attr("disabled", true);
            //$("#reset").attr("disabled", false);
        }
    });
}

function round_time_result(val) {
    return Math.round(val * 100) / 100;
}

function and_enter_time_handler() {
    $("input.number").live("keyup", function() {
       $(this).val($(this).val().replace(/\D/g, ''));
    });
}
