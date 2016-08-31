//设置价格
function setModifyPrice(thisPanel){
	var inputPrice = $("#inputPrice").val().trim();
    if(inputPrice == "" || inputPrice == 0){
        $.messager.alert('提示','单价输入不能为零!');
        return false;
    }
    //新的数组
    var newData = [];
    //datagrid行数据
    var rows = [];
    //公式计算范围
    var selectScope = $("input[name='selectradio']:checked").val().trim();
    
    if(selectScope == "all"){ //所有行
        rows = $("#"+datagridUtil.datagridId).datagrid("getRows");
    }else if(selectScope == "select"){ //选择行
        rows = $("#"+datagridUtil.datagridId).datagrid("getSelections");
    }
    if(rows.length == 0){
        //销毁当前的dialog
        thisPanel.panel('destroy');
        return false;
    }
    newData = rows;
    
    for(var i = 0;i < rows.length;i++){
        //计算结果保留小数位数,toFixed四舍五入，目前保留2位小数
        newData[i]["price"] = parseFloat(inputPrice).toFixed(2);
        
        //返回指定列的选项
        //var currEditor = $("#"+datagridId).datagrid("getColumnOption",selectVal1);
        //currEditor.editor.options.precision = selectVal0;
    }
	
	//改变行数据
    datagridUtil.updateRows(selectScope,newData);

    //销毁当前的dialog
    thisPanel.panel('destroy');
}
