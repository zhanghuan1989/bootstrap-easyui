var setting = {
	data: {
		simpleData: {
			enable: true
		}
	},
	//表示是否显示复选框
	check: {
		enable: true,
		//chkStyle: "radio",
		//radioType: "level"
	}
};
//几个父节点，然后自己子节点  子节点的pId必须与父节点的id值相同 
/*
可以增加nocheck:true,是复选框前面的框不显示
doCheck:false 表示不可勾选
*/
var zNodes =[
	{ id:1010, pId:1001, name:"根父节点", open:true},
	{id:1, pId:1010,name:"此类节点不响应右键菜单", open:true, noR:true,
		children:[
			   {id:11,pId:1, name:"节点1", noR:true},
			   {id:12,pId:1, name:"节点2", noR:true}

		]},
	{id:2,pId:1010,name:"右键操作 1", open:true,
		children:[
			   {id:21,pId:2, name:"节点11"},
			   {id:22,pId:2, name:"节点12"},
			   {id:23,pId:2, name:"节点13"},
			   {id:24,pId:2, name:"节点14"}
		]},
	{id:3,pId:1010,name:"右键操作 1", open:true,
		children:[
			   {id:31,pId:3, name:"节点21"},
			   {id:32,pId:3, name:"节点22"},
			   {id:33,pId:3,name:"节点23"},
			   {id:34,pId:3, name:"节点24"}
		]}
];

$(document).ready(function(){
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
});