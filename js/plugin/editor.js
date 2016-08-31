$(document).ready(function(){
	$(".summernote").summernote({
		lang:"zh-CN",
		width:850,
		height: 300,   
		focus: true
		/*onImageUpload: function(files, editor, $editable) {
		    console.log('image upload:', files, editor, $editable);
		},
		onChange: function(contents, $editable) {
		    console.log('onChange:', contents, $editable);
		},
		onfocus: function(e) {
		    console.log('Editable area is focused');
		},
		onblur: function(e) {
		    console.log('Editable area loses focus');
		},
		onpaste: function(e) {
		    console.log('Called event paste');
		}*/
	});
	
	//自定义工具栏
	/*$('.summernote').summernote({
	  toolbar: [
	    //[groupname, [button list]] 
	    ['style', ['bold', 'italic', 'underline', 'clear']],
	    ['font', ['strikethrough']],
	    ['fontsize', ['fontsize']],
	    ['color', ['color']],
	    ['para', ['ul', 'ol', 'paragraph']],
	    ['height', ['height']],
	  ]
	});*/
	
	//释放Summernote
	//$('.summernote').destroy();
	
	//取值
	//var sHTML = $('.summernote').code();
	//同一页面多个summernote时，取第二个的值
	//var sHTML = $('.summernote').eq(1).code();
	//赋值
	//$('.summernote').code(sHTML);
	
	$("#saveCode").on("click",function(){
		var sHTML = $('.summernote').code();
		console.info("富文本值：",sHTML);
		
		//$('.summernote').destroy();
	});
	
	$(".collapse-link").click(function() {
	    var o = $(this).closest("div.ibox"),
	    e = $(this).find("i"),
	    i = o.find("div.editor-textbox");
	    i.slideToggle(200),
	    e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),
	    o.toggleClass("").toggleClass("border-bottom"),
	    setTimeout(function() {
	        o.resize(),
	        o.find("[id^=map-]").resize()
	    },50);
    });
});
