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
        case 'sjf':
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
    case 'sjf':
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
    case 'sjf':
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
    case 'sjf':
        var priority_3_interruptible = $("#priority_3_interruptible").val();
        var priority_3_qtime = -1;
        break;
    case 'rr':
        var priority_3_interruptible = -1;
        var priority_3_qtime = $("#priority_3_qtime").val();
        break;
    }

    var interruptible = $("#interruptible").val();

    var process,
    previous_process;
    var result = {};

    for (var k in this.processes) {
        // Sets every process remaining burst
        process = this.processes[k];
        process.remaining_burst = process.burst;
    }

    var current_id = 0;
    var process_id;
    var length;

    while (this.hasActiveProcesses()) {
        switch (priority_1_type) {
        case 'fcfs':
            process = this.firstCurrentProcessByPriority(1);
            break;
        case 'sjf':
            process = this.shortestCurrentProcessByPriority(1);
            break;
        case 'rr':
            break;
        }

        if (process == false) {
            switch (priority_2_type) {
            case 'fcfs':
                process = this.firstCurrentProcessByPriority(2);
                break;
            case 'sjf':
                process = this.shortestCurrentProcessByPriority(2);
                break;
            case 'rr':
                break;
            }
        }

        if (process == false) {
            switch (priority_3_type) {
            case 'fcfs':
                process = this.firstCurrentProcessByPriority(3);
                break;
            case 'sjf':
                process = this.shortestCurrentProcessByPriority(3);
                break;
            case 'rr':
                break;
            }
        }
}