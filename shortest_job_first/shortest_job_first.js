$(document).ready(function() {
    add_start_button_click_handler();
});

function add_start_button_click_handler() {
    $("#start").click(function() {
        $("#start, #new_process").hide();
        process_list.startSJB();
    });
}

ProcessList.prototype.startSJB = function() {
    var result = {};
    var timer = 0;
    var last_time = 0;

    this.bubble_sort_by_burst();
    console.log(this.processes);

    /* [0: {'type': 'process', 'id' : 5, start: 0, end: 5,  color: },
        5: {'type': 'empty',             start: 5, end: 15, color: }] */
    for (var k in this.processes) {
        var proc = this.processes[k];
        if (timer < proc.arrival) {
            result[timer] = {
                'type': 'empty',
                'start': timer,
                'end': proc.arrival,
                'color': 'gray'
            };
            timer = proc.arrival;
        }
        result[timer] = {
            'type': 'proc',
            'id': proc.id,
            'start': timer,
            'end': (timer + proc.burst),
            'color': proc.color
        };
        timer += proc.burst;
        last_time = timer;
    }
    this.animate(result, last_time);
}

ProcessList.prototype.bubble_sort_by_burst = function() {
    var current,
    next;
    var swapped = true;

    do {
        swapped = false;
        for (var i in this.processes) {
            i = parseInt(i, 10);
            if (i == this.count) break;

            current = this.processes[i];
            next = this.processes[i + 1];
            if (current.burst > next.burst && current.arrival == next.arrival) {
                this.processes[i] = next;
                this.processes[i + 1] = current;
                swapped = true;
            }
        }
    }
    while (swapped);
}
