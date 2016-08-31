$(function(){
    initGoodsTree(); //初始树
    initGoodsDatagrid(); //初始化表格
});

//初始树
function initGoodsTree(){
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        }
    };
    var zNodes =[
        { id:1, pId:0, name:"所有类别", open:true},
        { id:11, pId:1, name:"进阶"},
        { id:111, pId:11, name:"进阶1"},
        { id:112, pId:11, name:"进阶2"},
        { id:113, pId:11, name:"进阶3"},
        { id:114, pId:11, name:"进阶4"},
        { id:12, pId:1, name:"化妆品"},
        { id:121, pId:12, name:"脸部保养"},
        { id:122, pId:12, name:"身体保养"},
        { id:123, pId:12, name:"手部保养"},
        { id:124, pId:12, name:"唇部保养"},
    ];
    $.fn.zTree.init($("#treeGoodsType"), setting, zNodes);
}
//初始化表格
function initGoodsDatagrid(){
    $("#gridGoods").datagrid({
        method: "get",
		url:'../../json/datagrid_data.json', 
	    fit : true,
		fitColumns : true,
		border : false,
		idField : 'id',
		striped:true,
		pagination:true,
		rownumbers:true,
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:50},
		  	{field:'barCode',title:'单品条码',sortable:false,width:60,editor:{type:'textbox'}},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:30}
		]]
    });
}