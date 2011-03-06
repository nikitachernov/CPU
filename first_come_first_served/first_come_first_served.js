ProcessList.prototype.start = function() {
    var result = {};
    var timer = 0;
    var last_time = 0;
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