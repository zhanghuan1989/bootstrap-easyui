/**
 * Created by zhanghuan on 2016/8/25.
 * 导入excel的js 
 */
var X = XLSX;
var XW = {
    /* worker message */
    msg: 'xlsx',
    /* worker scripts */
    rABS: '../../libs/plugins/jsexcel/xlsxworker2.js',
    norABS: '../../libs/plugins/jsexcel/xlsxworker1.js',
    noxfer: '../../libs/plugins/jsexcel/xlsxworker.js'
};

function ab2str(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
    return o;
}

function s2ab(s) {
    var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
    for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
    return [v, b];
}

function xw_noxfer(data, cb) {
    var worker = new Worker(XW.noxfer);
    worker.onmessage = function(e) {
        switch(e.data.t) {
            case 'ready': break;
            case 'e': console.error(e.data.d); break;
            case XW.msg: cb(JSON.parse(e.data.d)); break;
        }
    };
    var arr =data;
    worker.postMessage({d:arr,b:rABS});
}

function xw_xfer(data, cb) {
    var worker = new Worker(XW.rABS);
    worker.onmessage = function(e) {
        switch(e.data.t) {
            case 'ready': 
            	break;
            case 'e': 
	            console.error(e.data.d);
	            break;
            default:
                xx = ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r");
                cb(JSON.parse(xx)); 
            break;
        }
    };
    var val = s2ab(data);
    worker.postMessage(val[1], [val[1]]);
}

function xw(data, cb) {
   xw_xfer(data, cb);
}

function get_radio_value( radioName ) {
    var radios = document.getElementsByName( radioName );
    for( var i = 0; i < radios.length; i++ ) {
        if( radios[i].checked || radios.length === 1 ) {
            return radios[i].value;
        }
    }
}

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    return result;
}

function to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    return result.join("\n");
}

function to_formulae(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
        console.log(sheetName);
        if(formulae.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(formulae.join("\n"));
        }
    });
    return result.join("\n");
}

//导入的excel 输出的数据
var outputObj;
function process_wb(wb) {
	/*var output = "";
	switch(get_radio_value("format")) {
		case "json":
			output = JSON.stringify(to_json(wb), 2, 2);
			break;
		case "form":
			output = to_formulae(wb);
			break;
		default:
		output = to_csv(wb);
	}*/
	var output = JSON.stringify(to_json(wb), 2, 2);
    if(out.innerText === undefined){
        out.textContent = output;
    }
    else {out.innerText = output; }
	if(typeof output !== 'undefined'){
		outputObj = output;
	};
}

