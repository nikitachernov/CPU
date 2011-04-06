var process_table = new ProcessTable(true);

$(document).ready(function() {
    add_select_priority_type_change_handler();
	//add_new_process_button_click_handler();
});

function add_new_process_button_click_handler() {
     $("#new_process").click(function() {
       // process_table.addRoww('g');
    });
}

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
    var rr_start_point = $("#rr_start").val();
    var interruptible = $("#interruptible").val();
    
    var priority_1_type = $("#priority_1_type").val();
    switch (priority_1_type) {
    case 'sjf':
        var priority_1_interruptible = $("#priority_1_interruptible").val();
        break;
    case 'rr':
        var priority_1_robin_process_id = 0;
        var priority_1_qtime = parseInt($("#priority_1_qtime").val(), 10);
        break;
    }

    var priority_2_type = $("#priority_2_type").val();
    switch (priority_2_type) {
    case 'sjf':
        var priority_2_interruptible = interruptible;
        break;
    case 'rr':
        var priority_2_robin_process_id = 0;
        var priority_2_remaining_quant = 0;
        var priority_2_qtime = parseInt($("#priority_2_qtime").val(), 10);
        break;
    }

    var priority_3_type = $("#priority_3_type").val();
    switch (priority_3_type) {
    case 'sjf':
        var priority_3_interruptible = interruptible;
        break;
    case 'rr':
        var priority_3_robin_process_id = 0;
        var priority_3_remaining_quant = 0;
        var priority_3_qtime = parseInt($("#priority_3_qtime").val(), 10);
        break;
    }

    var process, length;

    while (this.hasActiveProcesses()) {
        switch (priority_1_type) {
        case 'fcfs':
            process = this.firstCurrentProcessByPriority(1);
            break;
        case 'sjf':
            process = this.shortestCurrentProcessByPriority(1);
            break;
        case 'rr':
            process = this.next_round_process_by_priority(priority_1_robin_process_id, 1);
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
                if (priority_2_remaining_quant == 0)
                    process = this.next_round_process_by_priority(priority_2_robin_process_id, 2);
                else
                    process = this.processes[priority_2_robin_process_id];
                break;
            }
        }
        else if (rr_start_point == 'first') {
            if (priority_2_type == 'rr') {
                priority_2_robin_process_id = 0;
                priority_2_remaining_quant = 0;
            }
            if (priority_3_type == 'rr') {
                priority_3_robin_process_id = 0;
                priority_3_remaining_quant = 0;
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
                if (priority_3_remaining_quant == 0)
                    process = this.next_round_process_by_priority(priority_3_robin_process_id, 3);
                else
                    process = this.processes[priority_3_robin_process_id];
                break;
            }
        }
        else if (priority_3_type == 'rr' && rr_start_point == 'first') {
            priority_3_robin_process_id = 0;
            priority_3_remaining_quant = 0;
        }

        if (process == false) {
            gant.initiate_or_continue_process('empty');
        }
        else {
            switch (process.priority) {
            case "1":
                switch (priority_1_type) {
                case 'fcfs':
                    gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'rr':
                    if (process.remaining_burst < priority_1_qtime)
                        length = process.remaining_burst;
                    else
                        length = priority_1_qtime;
                    gant.push_process(time.time, process.id, time.time, length, process.color);
                    priority_1_robin_process_id = process.id;
                    break;
                }
                break;
            case "2":
                switch (priority_2_type) {
                case 'fcfs':
                    if (interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'rr':
                    if (interruptible == 'Y') {
                        if (priority_2_remaining_quant == 0) {
                            if (process.remaining_burst < priority_2_qtime)
                                priority_2_remaining_quant = process.remaining_burst;
                            else
                                priority_2_remaining_quant = priority_2_qtime;
                            gant.push_process(time.time, process.id, time.time, 1, process.color);
                        }
                        else
                            gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                        priority_2_remaining_quant--;
                    }
                    else {
                        if (process.remaining_burst < priority_2_qtime)
                            length = process.remaining_burst;
                        else
                            length = priority_2_qtime;
                        gant.push_process(time.time, process.id, time.time, length, process.color);
                    }
                    priority_2_robin_process_id = process.id;
                    break;
                }
                break;
            case "3":
                // PRIORITY 3
                switch (priority_3_type) {
                case 'fcfs':
                    if (interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'sjf':
                    if (interruptible == 'Y')
                        gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                    else
                        gant.push_process(time.time, process.id, time.time, process.remaining_burst, process.color);
                    break;
                case 'rr':
                    if (interruptible == 'Y') {
                        if (priority_3_remaining_quant == 0) {
                            if (process.remaining_burst < priority_3_qtime)
                                priority_3_remaining_quant = process.remaining_burst;
                            else
                                priority_3_remaining_quant = priority_3_qtime;
                            gant.push_process(time.time, process.id, time.time, 1, process.color);
                        }
                        else
                            gant.initiate_or_continue_process('proc', process.id, process.color, 1);
                        priority_3_remaining_quant--;
                    }
                    else {
                        if (process.remaining_burst < priority_3_qtime)
                            length = process.remaining_burst;
                        else
                            length = priority_3_qtime;
                        gant.push_process(time.time, process.id, time.time, length, process.color);
                    }
                    priority_3_robin_process_id = process.id;
                    break;
                }
                break;
            }
        }
    }
	
    gant.animate();
}