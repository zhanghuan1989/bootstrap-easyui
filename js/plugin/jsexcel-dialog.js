//导入
function postExcel(thisPanel){
   var newData = serizeObj(outputObj); //excel导入的数据
   var oldData = $("#"+datagridUtil.datagridId).datagrid("getRows"); //datagrid原数据
   $("#"+datagridUtil.datagridId).datagrid("loadData",$.merge(oldData,newData));
   thisPanel.panel('destroy');
}

//选择文件
$("#xlf").on("change",function(e){
    var files = e.target.files;
    var value = $(this).val();
    $('#filename').val(value);
    var f = files[0];
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
            if(typeof console !== 'undefined');
            var data = e.target.result;
            xw(data, process_wb);
        };
        reader.readAsBinaryString(f);
    }
});

//重新组合excel导入到数据
function serizeObj(data){
    var tempJson = JSON.parse(data);//字符串转化成对象
    var newObjArr = [];
    tempJson.Sheet1.forEach(function(elt){
        var obj = {"id":elt["单品ID"],"name":elt["单品名称"],"barCode":elt["单品条码"],"price":elt["单品价格"]};
        newObjArr.push(obj);
    });
    return newObjArr;
}
