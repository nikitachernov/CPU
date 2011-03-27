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

    var process, previous_process;
    var current_id = 0;
    var process_id, length;

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
        if (process == false) {
            gant.initiate_or_continue_process('empty');
        }
        else {
            switch (process.priority) {
            case "1": // PRIORITY 1
                switch (priority_1_type) {
                case 'fcfs':
                    gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (priority_1_interruptible == 'Y') {
                        gant.initiate_or_continue_process('proc', process.id, process.color);
                    }
                    else {
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    }
                    break;
                }
                break;
            case "2": // PRIORITY 2
                switch (priority_2_type) {
                case 'fcfs':
                    if (interruptible) // among priorities
                        gant.initiate_or_continue_process('proc', process.id, process.color);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (priority_2_interruptible == 'Y' || interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                }
                break;
            case "3": // PRIORITY 3
                switch (priority_3_type) {
                case 'fcfs':
                    if (interruptible) // among priorities
                        gant.initiate_or_continue_process('proc', process.id, process.color);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (priority_3_interruptible == 'Y' || interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                }
                break;
            }
        }
    }
    gant.animate();
}