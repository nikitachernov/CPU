function ProcessTable() {
	this.count = 0;
	this.row_id_prefix = 'process_row_';
	this.arrival_input_id_prefix = 'atime_';
	this.burst_input_id_prefix = 'btime_';
}

ProcessTable.prototype.addRow = function() {
	var new_id = this.count + 1;
	var dbtn_id = 'dbtn_'+ new_id;
	var row_id = this.row_id_prefix + new_id;
	var row_html = '<tr id="'+ row_id +'">';
	row_html += '<td><input type="text" class="ptime" id="'+ this.arrival_input_id_prefix + new_id +'" maxlength="5" value=""></td>';
	row_html += '<td><input type="text" class="ptime" id="'+ this.burst_input_id_prefix + new_id +'" maxlength="5" value=""></td>';
	row_html += '<td><input type="button" id="'+ dbtn_id +'" value="Delete"></td>';
	row_html += '</tr>';
	$('#processes').append(row_html);
	$('#'+ dbtn_id).click(function() {
		process_table.deleteRow(row_id);
	});
	this.count++;
}

ProcessTable.prototype.deleteRow = function(row_id) {
	var row_o = $('#'+ row_id)[0];
	row_o.parentNode.removeChild(row_o);
}

ProcessTable.prototype.proceed = function() {
	var proc = [];
	var tbl_o = $('#processes')[0];
	var rows_cnt = tbl_o.rows.length;
	var id;
	var arrival;
	var arrival_input;
	var burst;
	var burst_input;
	var err;
	var err_msg = {};
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
		if (err === false) {
			proc.push([arrival, burst]);
		}
	}
	
	var msg = '';
	if (err_msg['err1']) msg += err_msg['err1'];
	if (err_msg['err2']) msg += '\n'+ err_msg['err2'];
	if (msg != '') alert(msg);
	else {
		//console.log(proc);
		proc.sort(mySortingFunc);
		for (var k in proc) {
			process_list.addNew(proc[k][0], proc[k][1]);
		}
		//console.log(proc);
	}

}

function mySortingFunc(el1, el2) {
	return el1[0] - el2[0];
}