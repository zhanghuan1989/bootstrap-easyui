/* 
    Author     : Tomaz Dragar
    Mail       : <tomaz@dragar.net>
    Homepage   : http://www.dragar.net
*/

(function ($) {
	
    $.fn.simpleCropper = function (onComplete) {
        var image_dimension_x = 600;
        var image_dimension_y = 600;
        var scaled_width = 0;
        var scaled_height = 0;
        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        var current_image = null;
        var image_filename = null;
        var aspX = 1;
        var aspY = 1;
        var file_display_area = null;
        var ias = null;
        var original_data = null;
        var jcrop_api;
        var currentClickId =null;
		//form表单的个数
		var fLength = $(".simple-cropper-images").find("form").length;
		//console.log(fLength+"--------11----");
		for(var i = 0;i < fLength;i++){
			var bottom_html = "<input type='file' id='fileInput"+i+"' index='"+i+"' class='fileInput' name='fileUpload'/ accept='image/*'>" +
					          "<canvas id='myCanvas"+i+"' style='display:none;'></canvas><div id='modal"+i+"' class='modal'>" +
					          "</div><div id='preview"+i+"' class='preview'><div class='buttons'>" +
					          "<div class='cancel' index='"+i+"'></div><div class='ok' index='"+i+"'></div></div>" +
					          "<input type='hidden' id='bigImage"+i+"' index='"+i+"' name='bigImage'/>" +
					          "<input type='hidden' id='x"+i+"' index='"+i+"' name='x' />" +
					          "<input type='hidden' id='y"+i+"' index='"+i+"' name='y'/>" +
					          "<input type='hidden' id='w"+i+"' index='"+i+"' name='w'/>"+
					          "<input type='hidden' id='h"+i+"' index='"+i+"' name='h'/></div>";
			
			 
			 $('#uploadForm'+i).append(bottom_html);
			// console.log($('#uploadForm'+i));
		}

        //add click to element
        this.click(function () {
            aspX = $(this).width();
            aspY = $(this).height();
            file_display_area = $(this);
            currentClickId = $(this).parent().attr("id");
			var fileInputId = file_display_area.parent().find(".fileInput").attr("id");
			$('#'+fileInputId).click();
			
        });

        $(document).ready(function () {
            //capture selected filename
           $('.fileInput').change(function (click) {
				var preview = $(this).parent("form").find(".preview").get(0);
				imageUpload(preview,this);
				// Reset input value 防止同一张图片不能重复上传
				$(this).val("");
			});

            //ok listener
            $('.ok').click(function () {
				var index = $(this).attr("index");
                preview(index);
                $('#preview'+index).delay(100).hide();
                $('#modal'+index).hide();
                jcrop_api.destroy();
                reset();
            });

            //cancel listener
            $('.cancel').click(function (event) {
                var index = $(this).attr("index");
			    $('#preview'+index).delay(100).hide();
                $('#modal'+index).hide();
                jcrop_api.destroy();
                reset();
            });
        });

        function reset() {
            scaled_width = 0;
            scaled_height = 0;
            x1 = 0;
            y1 = 0;
            x2 = 0;
            y2 = 0;
            current_image = null;
            image_filename = null;
            original_data = null;
            aspX = 1;
            aspY = 1;
            file_display_area = null;
            //隐藏mask遮罩层
            hideMask();
        }

        function imageUpload(dropbox,obj) {
        	//显示mask遮罩层
            showMask();
			var index = $(obj).attr("index");
			var file = $("#"+obj.id).get(0).files[0];
			if(file == undefined){ //点击上传图片，直接取消，会报错，因此中止本段程序
				return false;
			}
            var imageType = /image.*/;

            if (file.type.match(imageType)) {
                var reader = new FileReader();
                image_filename = file.name;

                reader.onload = function (e) {
                    // Clear the current image.
                    $('#photo'+index).remove();

                    original_data = reader.result;

                    // Create a new image with image crop functionality
                    current_image = new Image();
                    current_image.src = reader.result;
                    current_image.id = "photo"+index;
                    current_image.style['maxWidth'] = image_dimension_x + 'px';
                    current_image.style['maxHeight'] = image_dimension_y + 'px';
                    current_image.onload = function () {
                        // Calculate scaled image dimensions
                        if (current_image.width > image_dimension_x || current_image.height > image_dimension_y) {
                            if (current_image.width > current_image.height) {
                                scaled_width = image_dimension_x;
                                scaled_height = image_dimension_x * current_image.height / current_image.width;
                            }
                            if (current_image.width < current_image.height) {
                                scaled_height = image_dimension_y;
                                scaled_width = image_dimension_y * current_image.width / current_image.height;
                            }
                            if (current_image.width == current_image.height) {
                                scaled_width = image_dimension_x;
                                scaled_height = image_dimension_y;
                            }
                        }
                        else {
                            scaled_width = current_image.width;
                            scaled_height = current_image.height;
                        }

                        // set the image size to the scaled proportions which is required for at least IE11
                        current_image.style['width'] = scaled_width + 'px';
                        current_image.style['height'] = scaled_height + 'px';

                        // Position the modal div to the center of the screen
                        $('#modal'+index).css('display', 'block');
                        var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
                        var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

                        // Show image in modal view
                        $("#preview"+index).css("top", window_height);
                        $("#preview"+index).css("left", window_width);
                        $('#preview'+index).show(500);


                        // Calculate selection rect
                        var selection_width = 0;
                        var selection_height = 0;

                        var max_x = Math.floor(scaled_height * aspX / aspY);
                        var max_y = Math.floor(scaled_width * aspY / aspX);


                        if (max_x > scaled_width) {
                            selection_width = scaled_width;
                            selection_height = max_y;
                        }
                        else {
                            selection_width = max_x;
                            selection_height = scaled_height;
                        }
                        ias = $(this).Jcrop({
                            onSelect: showCoords, //选框改变时的事件
                            onChange: showCoords,  //选框选定时的事件
                            bgColor: '#747474',
                            bgOpacity: .4,
                            //aspectRatio: aspX / aspY, //选框宽高比
                            aspectRatio:0,
                            setSelect: [0, 0, selection_width, selection_height] //创建选框
                        }, function () {
                            jcrop_api = this;
                        });
                    }

                    // Add image to dropbox element
                    dropbox.appendChild(current_image);
                }

                reader.readAsDataURL(file);
            } else {
                dropbox.innerHTML = "File not supported!";
            }
        }

        function showCoords(c) {
        	/*console.log(currentClickId);
        	
        	console.log(c.x);
        	console.log(c.y);
        	console.log(c.x2);
        	console.log(c.y2);*/
            x1 = c.x;
            y1 = c.y;
            x2 = c.x2;
            y2 = c.y2;
            //原图
            var bigImage = $("#"+currentClickId).find("img").attr("src");
            $("#"+currentClickId).find("input[name='bigImage']").val(bigImage);
            //截图之后的坐标
            $("#"+currentClickId).find("input[name='x']").val(c.x);
            $("#"+currentClickId).find("input[name='y']").val(c.y);
            $("#"+currentClickId).find("input[name='w']").val(c.x2);
            $("#"+currentClickId).find("input[name='h']").val(c.y2);
        }

        function preview(index) {
            // Set canvas
            var canvas = document.getElementById('myCanvas'+index);
            var context = canvas.getContext('2d');

            // Delete previous image on canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Set selection width and height
            var sw = x2 - x1;
            var sh = y2 - y1;


            // Set image original width and height
            var imgWidth = current_image.naturalWidth;
            var imgHeight = current_image.naturalHeight;

            // Set selection koeficient
            var kw = imgWidth / $("#preview"+index).width();
            var kh = imgHeight / $("#preview"+index).height();

            // Set canvas width and height and draw selection on it
            canvas.width = aspX;
            canvas.height = aspY;
            context.drawImage(current_image, (x1 * kw), (y1 * kh), (sw * kw), (sh * kh), 0, 0, aspX, aspY);

            // Convert canvas image to normal img
            var dataUrl = canvas.toDataURL();
            var imageFoo = document.createElement('img');
            imageFoo.src = dataUrl;
		    
            // Append it to the body element
            $('#preview'+index).delay(100).hide();
            $('#modal'+index).hide();
            file_display_area.html('');
			file_display_area.append(imageFoo);

            if (onComplete) onComplete(
                {                    
                    "original": { "filename": image_filename, "base64": original_data, "width": current_image.width, "height": current_image.height },
                    "crop": { "x": (x1 * kw), "y": (y1 * kh), "width": (sw * kw), "height": (sh * kh) }
                }
            );
        }

        $(window).resize(function () {
            // Position the modal div to the center of the screen
            var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
            var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

            // Show image in modal view
			//form表单的个数
			var fLength = $(".simple-cropper-images").find(".cropme").length;
			for(var i = 0;i < fLength;i++){
				$("#preview"+i).css("top", window_height);
				$("#preview"+i).css("left", window_width);
			}
        });
        
        //显示mask遮罩层
        function showMask(){
        	$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).show();
        }
        
        //隐藏mask遮罩层
        function hideMask(){
        	$("#top-sild-mask,#left-sild-mask,#bottom-sild-mask",parent.window.document).hide();
        }
    }
}(jQuery));
