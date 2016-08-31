/**
 * Created by zhanghuan on 2016/8/25.
 * 导出excel的js 
 */
//第五种方法
var idTmr;
function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
//导出
function exportExcelMethod(tableid) {
    if(getExplorer()=='ie'){
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }
    }
    else{
        tableToExcel(tableid)
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><table>{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                        function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})();


/**
 * 动态创建table，并且将table导出为excel格式
 * @param datagridId
 * @param tableId
 */
function createExcelTabel(datagridId,tableId){
	//动态创建table
	var $dom = "<tabel id='"+tableId+"' style='display:none;'></table>";
	$("body").append($dom);
	
	//动态创建表头
	var $th = "";
	var opts = $('#'+datagridId).datagrid('getColumnFields');
	$.each(opts,function(i,item){
		var fields = $('#'+datagridId).datagrid("getColumnOption",item);
		$th += "<th>"+fields.title+"</th>";
	});
	$("#"+tableId).append("<tr>"+$th+"</tr>");
	
	//动态创建表内容
	var $tr = "";
	var rows = $('#'+datagridId).datagrid("getRows");
	$.each(rows, function(i,item) {
		$tr += "<tr>";
		$.each(item, function(key,value) {
			$tr += "<td>"+value+"</td>";
		});
		$tr += "</tr>";
	});
	$("#"+tableId).append($tr);

	setTimeout(function(){
		//执行导出为excel格式
		exportExcelMethod(tableId);
	},10);
}