var process_list = new ProcessList();

$(document).ready(function() {
    add_new_process_button_click_handler();
});

function add_new_process_button_click_handler() {
    $("#new_process").click(function() {
        process_list.addNew($('#atime').val(), $('#btime').val());
    });
}

