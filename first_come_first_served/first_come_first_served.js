ProcessList.prototype.startFIFS = function() {
	var p;
	for (var k in this.processes) {
		p = this.processes[k];
		p.work();
	}
}

// pl.startFIFS();