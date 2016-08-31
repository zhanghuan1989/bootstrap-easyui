/**
 * Created by zhanghuan on 2016/8/15.
 * easyui 方法扩展
 */

//dialog 方法扩展
$.extend($.fn.dialog.defaults, {
	onOpen:function(){
		$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).show();
	},
	onClose:function(){
		$(this).panel('destroy');
	},
	onDestroy:function(){
		$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).hide();
	}
});

//messager 方法扩展
$.extend($.messager.defaults, {
	onOpen:function(){
		$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).show();
	},
	onClose:function(){
		$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).hide();
	}
});

//扩展jQuery easyui datagrid增加动态改变列编辑的类型
$.extend($.fn.datagrid.methods, {
    addEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item.field);
                e.editor = item.editor;
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param.field);
            e.editor = param.editor;
        }
    },
    removeEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item);
                e.editor = {};
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param);
            e.editor = {};
        }
    }
}); 

//为password字段添加一个editor 
/*$("#gridId").datagrid('addEditor', {
	field : 'password',
	editor : {
	    type : 'validatebox',
	    options : {
	        required : true
	    }
	}
});*/

//删除password的editor
//$("#gridid").datagrid('removeEditor', 'password');

$.extend($.fn.datagrid.methods, {
    keyCtr : function (jq) {
        return jq.each(function () {
            var grid = $(this);
            grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', function (e) {
                switch (e.keyCode) {
                    case 37: //左键
                        var field = datagridUtil.getLRFiledName(editRowIndex,editField,'left');
                        var ed = grid.datagrid('getEditor', {index:editRowIndex,field:field});
                        if(ed){
                            $(ed.target).textbox('textbox').focus();
                            setTimeout(function(){
                                $(ed.target).textbox('textbox').select();
                            },10)
                            editField= field;
                        }
                        break;
                    case 39: //右键
                        var field = datagridUtil.getLRFiledName(editRowIndex,editField,'right');
                        var ed = grid.datagrid('getEditor', {index:editRowIndex,field:field});
                        if(ed){
                            $(ed.target).textbox('textbox').focus();
                            setTimeout(function(){
                                $(ed.target).textbox('textbox').select();
                            },10)
                            editField= field;
                        }
                        break;
                    case 38: //上键
                        if(editRowIndex>0){
                            var lastIndex = editRowIndex-1;
                            grid.datagrid('endEdit', editRowIndex);//结束之前的编辑
                            grid.datagrid('selectRow', lastIndex).datagrid('beginEdit', lastIndex);
                            editRowIndex = lastIndex;
                            var ed = grid.datagrid('getEditor', {index:lastIndex,field:editField});
                            if(ed){
                                $(ed.target).textbox('textbox').focus();
                                setTimeout(function(){
                                    $(ed.target).textbox('textbox').select();
                                },10)
                            }
                        }
                        break;
                    case 40: //下键
                        if(grid.datagrid('getRows').length-editRowIndex>1){
                            var lastIndex = editRowIndex+1;
                            grid.datagrid('endEdit', editRowIndex);//结束之前的编辑
                            grid.datagrid('selectRow', lastIndex).datagrid('beginEdit', lastIndex);
                            editRowIndex = lastIndex;
                            var ed = grid.datagrid('getEditor', {index:lastIndex,field:editField});
                            if(ed){
                                $(ed.target).textbox('textbox').focus();
                                setTimeout(function(){
                                    $(ed.target).textbox('textbox').select();
                                },10)
                            }
                        }
                        break;
                }
            });
        });
    }
});


//datagrid的常用操作方法
var datagridUtil = {
    /**
     * 是否选择的datagrid的行，选择为true，未选择为false，则提示用户选择
     * @returns {boolean}
     */
    isSelectRows:function(){
    	//getRows 返回当前页的行
    	var rowsLen = $("#"+this.datagridId).datagrid("getRows").length;
    	if(rowsLen > 0){
        	if($("#"+this.datagridId).datagrid("getSelections").length <= 0){
	            $.messager.alert('提示','请先选择再删除？');
	            return false;
	        }else{
	            return true;
	        }
        }
    },
    /**
     * 获取datagrid左右的editor
     */
    getLRFiledName:function(index,field,type){
	    var row = $("#"+this.datagridId).datagrid('getEditors', index);
	    var searchField = field;
	    for(var i=0;i<row.length;i++){
	        if(row[i].field==field){
	            if(type=='left'&&i>0){
	                searchField = row[i-1].field;
	            }
	            if(type=='right'&&i<row.length-1){
	                searchField = row[i+1].field;
	            }
	        }
	    }
	    return searchField;
	},
    /**
     * 删除单条datagrid数据
     */
    addSingleRow:function(rowIndex){
    	var index = rowIndex || 0;
	    $("#"+this.datagridId).datagrid("insertRow",{
	        index:parseInt(index)+1,
	        row:{}
	    });
	    
	    //添加行后，需要注意获取数据的速度，所以提取出去，先getRows获取，然后在loadData添加
	    var currRows = $("#"+this.datagridId).datagrid("getRows");
	    setTimeout(function(){
	        $("#"+this.datagridId).datagrid("loadData",currRows);
	    },10);
	    
	    //以下写法，会报错，判定为dom元素的数据添加及获取的速度问题
	    //$("#"+this.datagridId).datagrid("loadData",$("#"+this.datagridId).datagrid("getRows"));
    },
    /**
     * 删除单条datagrid数据
     */
    deleteSingleRow:function(rowIndex){
    	var index = rowIndex || 0;
	    $("#"+this.datagridId).datagrid("deleteRow",index);
	    $("#"+this.datagridId).datagrid("loadData",$("#"+this.datagridId).datagrid("getRows"));
	    
	    //清除所有的选择
        this.clearSelections();
    },
    /**
     * 删除多条datagrid数据
     */
    deleteMoreRow:function(){
    	var selectData = $("#"+this.datagridId).datagrid("getSelections");
    	var allData = $("#"+this.datagridId).datagrid("getRows");
    	for(var i = 0;i < allData.length;i++){
           for(var j = 0;j < selectData.length;j++){
           		allData.removeObj(selectData[j]);
           }
        }
    	$("#"+this.datagridId).datagrid('loadData', allData);
    	
    	//清除所有的选择
        this.clearSelections();
    },
    /**
     * 清除所有的选择
     */
    clearSelections:function(rowIndex){
    	//清除所有的选择
    	$("#"+this.datagridId).datagrid('clearSelections');
    	//清除所有勾选的行
        $("#"+this.datagridId).datagrid("clearChecked");
    },
    /**
     * 合并选择后的数据到当前datagrid数据中，并去掉重复数据
     */
    mergeDataGridData:function(newData){
    	//先获取之前添加的数据
		var oldData = $("#"+this.datagridId).datagrid("getRows");
		//$.merge(arr1,arr2)：将数组arr2合并到arr1，arr1改变，arr1数组值变成合并后的值，arr2保持不变
		$.merge(oldData,newData);
		//重新加载数据,oldData.unique去掉重复数据
        $("#"+this.datagridId).datagrid("loadData",oldData.unique());
        //清除所有的选择
        this.clearSelections();
    },
    /**
     * 显示列
     * @param datagridId datagrid的Id
     * @param fieldArr   列的field数组
     */
    showDataGridColumn:function(fieldArr){
        for(var i = 0;i < fieldArr.length;i++){
            $("#"+this.datagridId).datagrid("showColumn",fieldArr[i]);
        }
    },
    /**
     * 隐藏列
     * @param datagridId datagrid的Id
     * @param fieldArr   列的field数组
     */
    hideDataGridColumn:function(fieldArr){
        for(var i = 0;i < fieldArr.length;i++){
            $("#"+this.datagridId).datagrid("hideColumn",fieldArr[i]);
        }
    },
    /**
     * 所有editor失去焦点,结束之前的编辑
     */
    setEditorBlur:function(){
        var rows = $("#"+this.datagridId).datagrid("getRows");
        for(var i = 0;i < rows.length;i++){
            $("#"+this.datagridId).datagrid("endEdit",i);
        }
    },
    /**
     * 改变datagrid行数据
     * @param selectScope 选择的范围，all：所有行；select：选择行
     * @param newData datagrid新数据
     */
    updateRows:function(selectScope,newData){
    	if(selectScope == "all"){ //所有行
	        //重新加载数据
	        $("#"+this.datagridId).datagrid("loadData",newData);
	
	    }else if(selectScope == "select"){ //选择行
	        // 获取选中行的Index的值
	        var rowIndex = -1;
	        for(var i = 0;i < newData.length;i++)
	        {
	            rowIndex = $("#"+this.datagridId).datagrid('getRowIndex',newData[i]);
	            //更新行数据
	            $("#"+this.datagridId).datagrid('updateRow',{
	                index: rowIndex,
	                row: newData[i]
	            });
	            //刷新行
	            $("#"+this.datagridId).datagrid('refreshRow',rowIndex);
	        }
	    }
    },
    /**
     * 获取datagrid非空数据
     */
	getDataGridRows:function(){
		var rows = $("#"+this.datagridId).datagrid("getRows");
		var rowsData = [];
		$.each(rows,function(i,row){
			if(!$.isEmptyObject(row)){
				rowsData.push(row);
			}
		});
		return rowsData;
	},
    /**
     * 获取numberbox编辑框值
     * @param rowIndex 行索引
     * @param field field
     */
    getNumberboxFieldValue:function(rowIndex,field){
        var ed = $('#'+this.datagridId).datagrid('getEditor', {index:rowIndex,field:field});
        if(ed && ed.target){
            return $(ed.target).numberbox('getValue');
        }
        return "";
    }
}

