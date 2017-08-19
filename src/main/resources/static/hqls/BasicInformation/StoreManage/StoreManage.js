layui.use(['form', 'layer','laypage', 'tree'], function() {
    var form = layui.form(),
        layer = layui.layer,
         laypage=layui.laypage,
    	 pageSize = 10,
        $ = layui.jquery;
    // 门店节点弹框触发事件
    $('#myContent').on('click', 'button', function() {
        var othis = $(this),
            method = othis.data('method');
        if (method === 'addStore') {
            layer.open({
                type: 1,
                title: '新增', // 标题
                skin: 'layui-layer-lan', // 弹框主题
                shade: 0,
                area: '450px', // 宽高
                content: $('#storeTreeBox') // 内容
            });
        } else if(method != null){
            store(null, method); // 门店详细信息
        }
    });

    // 构建门店节点树
    layui.tree({
        elem: '#storeTree', // 指定元素
        click: function(item) { // 点击节点回调
            layer.closeAll();
            $('#choosedName').text(item.name);
            layer.open({ // 弹框询问门店添加位置
                type: 1,
                title: '提示',
                skin: 'layui-layer-lan', // 弹框主题
                shade: 0,
                area: ['420px', '240px'], // 宽高
                content: $('#storeLocate'),
                btn: ['添加子节点', '上方添加节点', '下方添加节点'],
                yes: function(index, layero) { // 选中在上方添加节点的回调
                    layer.close(index);
                	// alert(item.storeId);
                    store(item.storeId,""); // 调用store方法
                },
                btn2: function(index, layero) { // 选中在下方添加节点的回调
                    layer.close(index);
                    store(item.pid,""); // 调用store方法
                },
                btn3: function(index, layero) { // 选中在添加子节点的回调
                    layer.close(index);
                    store(item.pid,"");  // 调用store方法
                },
            });
        },
        nodes: addStore()
    });
    // 弹框：门店详细信息
    function store(pid,temp) {
    	if(temp==""){
    		var tb_html="";
    		var editStore = $("#editStore");
    		tb_html= '<tr><td>门店名称</td><td><input type="hidden" value="" id="storeId"><input value="" id="storeName"></input></td></tr>'+
			'<tr><td>门店联系人</td><td><input value="" id="userName2"></input></td></tr>'+
			'<tr><td>联系人电话</td><td><input value="" id="mobile"></input></td></tr>'+
			'<tr><td>门店地址</td><td><div class="layui-input-inline"><select name="prov" id="provinceId" onchange="getCity(this)" class="layui-select"></select></div>'+
			'<div class="layui-input-inline"><select name="city" id="cityId" onchange="getCounty(this)" class="layui-select"><option value="">请选择市</option></select></div>'+
			' <div class="layui-input-inline"><select name="area" id="countyId" class="layui-select"><option value="">请选择县/区</option></select></div>'+
				'<input type="text" name="" id="address" class="layui-input" placeholder="请输入门店地址"></td></tr>'+
			'<tr><td>门店位置</td><td><input value=""></input></td></tr>'+
			'<tr><td>图片上传</td><td><form id="store_form"><input type="file" name="file" id="storeImg" onchange="uploadStoreImg()" class="layui-input"><input type="hidden" id="backUrl" ></form></td></tr>'+
			'<tr> <td>是否启用</td>'+
            '<td class="state"><input type="radio" name="isEnable" value="yes" checked="1">是<input type="radio" name="isEnable" value="no" checked="0">否</td></tr>';
    		editStore.html(tb_html);
    			
			var pros = findAllProvinces();
				var p = null;
				var provinces = '<option value="">请选择省</option>';
				
			for(i=0;i<pros.length;i++){
				p= pros[i];
				provinces += '<option value="'+p.id+'">'+p.name+'</option>';
			 }
			 $("#provinceId").html(provinces);
			
    	}
    	// nodeType为1 表示storeId为父节点
    	// nodeType为2 表示storeId为兄弟节点
        layer.open({
            type: 1,
            title: temp == 'view' ? '查看' : temp == 'edit' ? '编辑' : '新增',
            skin: 'layui-layer-lan', // 弹框主题
            shade: 0,
            area: '500px', // 宽高
            content: temp == 'view' ? $('#storeInfoView') : $('#storeInfoEdit'),
            btn: temp == 'view' ? '确定' : '提交',
            btnAlign: 'c', // 按钮居中
            yes: function(index, layero) {
            	if(temp==""){
            		 addStoreInfo(pid);
            	}else if(temp=='edit'){
            		 updateStore();
            	}

            	// 当前层索引参数（index）、当前层的DOM对象（layero）
                // console.log(layero);
               
                layer.close(index); //如果设定了yes回调，需进行手工关闭
                
            }
        });
    }
    // 门店图片弹框
    $('#seePic').click(function() {
        event.stopPropagation();
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shade: [1, 'transparent'],
            skin: 'layui-layer-nobg', // 没有背景色
            shadeClose: true,
            content: $('#storeImage')
        });
    });
    
    findStore(1);
	$("#searchStore").click(function(){
		findStore(1);
	});
	
	$("#addStore").click(function(){
		addStore();
	});
	
	function findStore(pageIndex){
		$.ajax({
    	url : "http://localhost:8881/findstoreinfo",
		type : "get",
		data : { "storeName":$("#storeName").val(),"userName":$("#userName").val(),
				 "userMobile":$("#userMobile").val(), 
				 "provinceId":$("#province").val(),
				 "cityId":$("#city").val(),
				 "countyId":$("#county").val(), 
				 "pageIndex":pageIndex,
				 "pageSize":pageSize},
				
		
    	success : function(data){
    		
    		comboTable(data,pageIndex);
    		}
    		
    }); 
}
	
	function initPage(totalCount,pageIndex){
		// page
		laypage({
			cont: 'pages',
			pages: Math.ceil(totalCount/pageSize), // 总的分页数
			groups: 5, // 展示的页数
			first: 1,
			last: Math.ceil(totalCount/pageSize),
			skip: true,
			curr:pageIndex,
			jump: function(obj, first) {
				if(!first) {
					findStore(obj.curr);
				}
			}
		})
	}
	
	function comboTable(res,pageIndex){
		var list = res.result;
		var tb_html="";
		var store_tb = $("#store_tb");
		for(i=0;i<list.length;i++){
			var tr_html=list[i];
			var status = "启用";
			if(tr_html.isUseable){
				status = "禁用";
			}
			tb_html += '<tr><td>'+tr_html.storeName+'</td>'+
						'<td>'+tr_html.userName+'</td>'+
						'<td>'+tr_html.mobile+'</td>'+
						'<td>'+tr_html.address+'</td>'+
						'<td>('+tr_html.longitude+','+tr_html.latitude+')</td>'+
						'<td>'+
						'<button data-method="view" class="layui-btn" onclick="getStoreInfo('+tr_html.storeId+')">查看</button> '+
						'<button data-method="edit" class="layui-btn " onclick="changeStore('+tr_html.storeId+')">编辑</button> '+
						'<button  onclick="isEnable('+tr_html.storeId+')" class="layui-btn layui-btn-normal">'+status+'</button> '+
						'</td></tr>'
				
		}
			store_tb.html(tb_html);
		initPage(res.totalCount,pageIndex);
	}
	
	function addStore(){
		var nodes =[];
		$.ajax({
			url : "http://localhost:8881/findstore",
			type : "post",
			async : false,
			data : {},
	    	success : function(data){
	    		var result = data.result;
	    		nodes = result;
	    	}
			
		});
		return nodes;
		
	}
	
	function addStoreInfo(pid){
		var storeInfoDto ={};
			storeInfoDto.pid = pid;
			var isUseable=$('input:radio[name="isEnable"]:checked').val();
			storeInfoDto.storeName = $("#storeName").val();
			storeInfoDto.userName = $("#userName").val();
			storeInfoDto.mobile = $("#mobile").val();
			storeInfoDto.address = $("#address").val();
			/*
			 * storeInfoDto.longitude = longitude; storeInfoDto.latitude =
			 * latitude; storeInfoDto.backUrl = backUrl;
			 */
			if(isUseable == 1){
				storeInfoDto.isUseable =true;
			}else{
				storeInfoDto.isUseable =false;
			}
			
		$.ajax({
			url : "http://localhost:8881/insertstore",
			type : "post",
			data : JSON.stringify(storeInfoDto),
			headers:{
				  "Authorization":localStorage.token
				 },
			contentType:"application/json;charset=UTF-8",
	    	success : function(data){
	    		
	    		var result = data.result;
	    		nodes = result;
	    	}
			
		});
		
	}
});

function uploadStoreImg(){
	var formObj =$("#store_form"); //上传 form
	var imgObj=$("#storeImg")[0]; //上传 图片对象
	var getImgUrl = uploadImg(formObj,imgObj); //可以加上图片的显示位置
	$("#backUrl").val(getImgUrl);
	alert($("#backUrl").val());
}