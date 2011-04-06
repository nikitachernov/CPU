function ProcessTable(with_priority) {
	this.count = 0;
	this.row_id_prefix = 'process_row_';
	this.arrival_input_id_prefix = 'atime_';
	this.priority_id_prefix = 'process_priority_';
	this.burst_input_id_prefix = 'btime_';
	this.dbtn_prefix = 'dbtn_';
	this.nbtn_prefix = 'nbtn_';
	this.with_priority = with_priority === undefined ? false : with_priority;
}

ProcessTable.prototype.addRow = function() {
	var new_id = this.count + 1;
	var dbtn_id = this.dbtn_prefix + new_id;
	var nbtn_id = this.nbtn_prefix+ new_id;
	var row_id = this.row_id_prefix + new_id;
	var row_html = '<tr id="'+ row_id +'">';
	row_html += '<td><input type="text" class="ptime number" id="'+ this.arrival_input_id_prefix + new_id +'" maxlength="5" value=""></td>';
	row_html += '<td><input type="text" class="ptime number" id="'+ this.burst_input_id_prefix + new_id +'" maxlength="5" value=""></td>';
	if (this.with_priority === true) {
		row_html += '<td><select id="'+ this.priority_id_prefix + new_id +'"><option value="1">1: high</option><option value="2">2: medium</option><option value="3">3: low</option></select></td>';
	}
	row_html += '<td><input type="button" id="'+ dbtn_id +'" value="Delete" class="hidden"><input id="'+ nbtn_id +'" type="button" value="Add" class="visible"></td>';
	
	row_html += '</tr>';
	$('#processes').append(row_html);
	
	$('#'+ dbtn_id).click(function() {
		process_table.deleteRow(row_id);
	});
	$('#'+ nbtn_id).click(function() {
		$('#'+ process_table.dbtn_prefix + new_id)[0].className = 'visible';
		$('#'+ process_table.nbtn_prefix + new_id)[0].className = 'hidden';
		process_table.addRow();
	});
	this.count++;
}

ProcessTable.prototype.deleteRow = function(row_id) {
	var row_o = $('#'+ row_id)[0];
	row_o.parentNode.removeChild(row_o);
}
ProcessTable.prototype.start = function() {
	if (this.previewGraph() === true) {
		process_list.start();
		return true;
	}
	return false;
}
ProcessTable.prototype.previewGraph = function() {
	var proc = [];
	var tbl_o = $('#processes')[0];
	var rows_cnt = tbl_o.rows.length - 1;
	var id;
	var arrival;
	var arrival_input;
	var burst;
	var burst_input;
	var err;
	var err_msg = {};
	var priority;
	if (rows_cnt == 1) {
		alert('There is no processes. Please add process.');
		return false;
	 }
	for (var i = 0; i < rows_cnt; i++) {
		err = false;
		id = tbl_o.rows[i].id;
		if (id === '') continue;
		id = id.replace(this.row_id_prefix, '');
		arrival_input = $('#'+ this.arrival_input_id_prefix + id);
		arrival = parseInt(arrival_input.val(), 10);
		if (isNaN(arrival) || arrival < 0 || arrival > PROCESS_MAX_START) {
			err = true;
			err_msg['err1'] = 'Incorrect process arrival time (1-' + PROCESS_MAX_LENGTH + ').';
			arrival_input.addClass('input_err');
		} else {
			arrival_input.removeClass('input_err');
		}
		burst_input = $('#'+ this.burst_input_id_prefix + id);
		burst = parseInt(burst_input.val(), 10);
		if (isNaN(burst) || burst < 1 || burst > PROCESS_MAX_LENGTH) {
			err = true;
			err_msg['err2'] = 'Incorrect process burst time (0-' + PROCESS_MAX_START + ').';
			burst_input.addClass('input_err');
		} else {
			burst_input.removeClass('input_err');
		}
		priority = $('#'+ this.priority_id_prefix + id).val();
		if (err === false) {
			proc.push([arrival, burst, priority]);
		}
	}
	
	var msg = '';
	if (err_msg['err1']) msg += err_msg['err1'];
	if (err_msg['err2']) msg += '\n'+ err_msg['err2'];
	if (msg != '') {
		alert(msg);
		return false;
	} else {
		proc.sort(mySortingFunc);
		process_list.clearList();
		for (var k in proc) {
			process_list.addNew(proc[k][0], proc[k][1], proc[k][2]);
		}
		return true;
	}

}

function mySortingFunc(el1, el2) {
	return el1[0] - el2[0];
}