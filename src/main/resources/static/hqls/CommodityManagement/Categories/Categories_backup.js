layui.use(['layer', 'tree', 'form', 'laypage'], function() {
    var layer = layui.layer,
        form = layui.form(),
        laypage = layui.laypage,
        $ = layui.jquery,
        pageSize = 10,
        first_title,
        second_title = '';

    // 商品分类节点弹框触发事件
    $('.categories').on('click', 'button', function() {
        var othis = $(this),
            method = othis.data('method');
        var level = othis.parent().parent().find("td:first").find("input").val();
        first_title = second_title = '';
        if (method == 'addCategories') {
            first_title = '新增';
            second_title = method;
            /**
             * 1 是节点等级
             * 1 是新增  2 编辑的
             */
            loadAddNodes(0, 1);
            buttongForbidden();
        } else if (method == 'view') {
            first_title = '查看';
            //            loadNodes(level,3);
            loadEditAndViewNodes(level, 3);
            buttongForbidden();
        } else if (method == 'edit') {
            first_title = '编辑';
            /**
             * 第一个  2 等级
             * 第二个  2 操作方式
             */
            //            loadNodes(level,2);//加载节点树
            loadEditAndViewNodes(level, 2)
            buttongForbidden();
        }
        first_title && layer.open({
            type: 1,
            title: first_title, // 标题
            skin: 'layui-layer-lan', //弹框主题
            shade: 0,
            area: '450px', // 宽高
            content: method == 'addCategories' ? $('#addTree') : method == 'view' ? $('#viewTree') : $('#editTree'), //弹框内容
            btn: method == 'addCategories' ? null : '确定',
            yes: function(index, layero) {
                layer.close(index);
            },
            end: function(index, layero) {
                $('#viewItemTree').html("");
                $('#editItemTree').html("");
                $('#addItemTree').html("");
                clearButtonForbidden();
                //强制隐藏
                $('#addTree').css('display', 'none');
                $('#editTree').css('display', 'none');
                $('#viewTree').css('display', 'none');
                getdata(1, 0); //重新加载页面 // 1:pageIndex 0:level
            }
        });

    });

    /**
     * 加载新增的节点树
     * @param level 1
     * @param flag 1:新增  2:编辑 3.查看
     * @returns
     */
    function loadAddNodes(level, flag) {
        $.ajax({
            url: "/partstreeofadded", //这个是新增显示的数据
            type: "get",
            async: false,
            data: { "pid": level, "operflag": flag },
            success: function(res) {
                addTree(res); //显示新增数据					
            },
            error: function(res) {
                alert('查询树形菜单失败');
            }
        });
    }

    /**
     * 加载 编辑和查看的数据
     * @param level
     * @param flag
     * @returns
     */
    function loadEditAndViewNodes(level, flag) {
        $.ajax({
            url: "/partstreeofaddeditview", //这个是view 和 edit的显示数据
            type: "get",
            async: false,
            data: { "pid": level, "operflag": flag },
            success: function(res) {
                switch (flag) {
                    case 2:
                        editTree(res, level);
                        break;
                    case 3:
                        view(res);
                        //查看
                        break;
                    default:
                        break;
                }
            },
            error: function(res) {
                alert('查询树形菜单失败');
            }
        });
    }


    /**
     * 显示页面
     * @param data
     * @returns
     */
    function addTree(data) {
        // 构建商品分类节点树
        layui.tree({
            elem: '#addItemTree', //'#storeTree',//;'#categoriesTreeBox':新增, categoriesTreeView：编辑 //指定元素
            click: function(item) { //点击节点回调
                categoriesEdit(item, 1);
            },
            nodes: data
        });
    }

    function editTree(data, level) {
        console.log(data);
        layui.tree({
            elem: '#editItemTree', //;'#categoriesTreeBox':新增, categoriesTreeView：编辑 //指定元素
            click: function(item) { //点击节点回调
                categoriesEdit(item, 2, level);
            },
            nodes: data
        });
    }

    function view(data) {
        layui.tree({
            elem: '#viewItemTree', //指定元素
            //      click: function(item) {
            //          categoriesEdit(item);
            //      },
            nodes: data
        });
    }


    var createTree = function(node, start) {
        node = node || function() {
            var arr = [];
            arr.push({
                name: '1'.toString().replace(/(\d)/, '$1$1$1$1$1$1$1$1$1'),
                spread: true,
            });
            return arr;
        }();
        start = start || 1;
        layui.each(node, function(index, item) {
            if (start < 10 && index < 9) {
                var child = [{
                    name: (1 + index + start).toString().replace(/(\d)/, '$1$1$1$1$1$1$1$1$1')
                }];
                node[index].children = child;
                node[index].spread = true;
                createTree(child, index + start + 1);
            }
        });
        return node;
    };

    // 弹框：以何种方式添加商品分类及删除提示
    /**
     * 
     * @param item 选中项
     * @param addAndEditAndViewFlag 操作标志
     * @param level 编辑查看的等级
     * @returns
     */
    function categoriesEdit(item, addAndEditAndViewFlag, level) {
        $('#categoriesName').text(item.name);
        layer.open({ // 弹框询问门店添加位置
            type: 1,
            title: '提示',
            skin: 'layui-layer-lan', //弹框主题
            shade: 0,
            area: ['300px', '260px'], //宽高
            content: $('#categoriesLocate'),
            btn: ['添加子节点', '添加同级节点', '修改', '删除'],
            btnAlign: 'c', //按钮居中
            yes: function(index, layero) { // 添加子节点
                console.log("index:", index, "\n当前节点id", item.id, "\n当前节点name", item.name);
                categoriesEditCommon(item.id, 1, index, addAndEditAndViewFlag);
                layer.close(index);
            },
            btn2: function(index, layero) { //添加同级节点
                categoriesEditCommon(item.id, 2, index, addAndEditAndViewFlag);
                layer.close(index);
            },
            btn3: function(index, layero) { // 选中修改的回调
                layer.close(index);
            },
            btn4: function(index, layero) { // 选中删除的回调
                layer.close(index);
                var temp = 'del';
                /*
                    删除操作。。。
                    
                    是否可以删除？
                    是   temp='del'，为测试效果默认可以删除
                    否   temp=''                    
                */
                layer.open({
                    type: 1,
                    title: temp == 'del' ? '删除' : '提示',
                    skin: 'layui-layer-lan', //弹框主题
                    shade: 0,
                    area: '400px', //宽高
                    content: temp === 'del' ? $('#categoriesDelete') : $('#categoriesNotDel'),
                    btn: temp === 'del' ? ['确定', '取消'] : '确定',
                    btnAlign: 'c', //按钮居中
                    yes: function(index, layero) { // 当前层索引参数（index）、当前层的DOM对象（layero）
                        // console.log(layero);
                        check(item.id, index, addAndEditAndViewFlag, level);
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    },
                    btn2: function(index, layero) {
                        // console.log(index);
                        layer.close(index);
                    }
                });
            },
        });
    }

    /**
     * 
     * @param selectNodeId 选中
     * @param operFlag 新增子集，同级，等操作标志
     * @param index 弹出框下表
     * @param addAndEditAndViewFlag 新增删除编辑操作标志
     * @returns
     */
    function categoriesEditCommon(selectNodeId, operFlag, index, addAndEditAndViewFlag) {
        layer.open({
            type: 1,
            title: second_title == 'edit' ? '编辑' : '新增',
            skin: 'layui-layer-lan', //弹框主题
            shade: 0,
            area: '500px', //宽高
            content: second_title == 'view' ? $('#storeInfoView') : $('#categoriesInfoEdit'),
            btn: second_title == 'view' ? '确定' : '提交',
            btnAlign: 'c', //按钮居中
            yes: function(index, layero) { // 当前层索引参数（index）、当前层的DOM对象（layero）
                var typeName = $("#partsTypeName").val(); //输入框的名称
                switch (operFlag) {
                    case 1:
                        addChildren(selectNodeId, typeName, index, addAndEditAndViewFlag);
                        break;
                    case 2:
                        addSameLevelNode(selectNodeId, typeName, index, addAndEditAndViewFlag);
                        break;
                    case 3:
                        //	            		check(selectNodeId,index,index); //检查删除
                        break;
                    default:
                        layer.msg("未知的标志");
                        break;
                }

                layer.close(index); //如果设定了yes回调，需进行手工关闭
                inputReset(); // 清空表单
                // 在新增的情况下，如果要添加的的内容已存在，则提示用户已存在
                //                if (second_title != 'view' && false) { // 第一参数表明是否新增，第二参数表明是否已存在
                //                    layer.open({
                //                        type: 1,
                //                        title: '提示',
                //                        skin: 'layui-layer-lan', //弹框主题
                //                        shade: 0,
                //                        area: '400px', //宽高
                //                        content: $('#categoriesAdd'),
                //                        btn: '确定',
                //                        btnAlign: 'c', //按钮居中
                //                        yes: function(index, layero) { // 当前层索引参数（index）、当前层的DOM对象（layero）
                //                            layer.close(index);
                //                        }
                //                    });
                //                }


            }
        });
    }
    // 重置表单输入框
    function inputReset() {
        $('#categoriesInfoEdit>form')[0].reset();
    }

    // 分页条
    /**
     * 页面加载默认显示
     */
    getdata(1, 0);
    $("#searchCategories").click(function() {
        var selectLevel = 0;
        //获取等级数据，然后判断
        var onelevelSelectVal = $("#oneleveltype").val();
        var twolevelSelectVal = $("#twoleveltype").val();
        var threelevelSelectVal = $("#threeleveltype").val();
        if (onelevelSelectVal != -1) {
            selectLevel = onelevelSelectVal;
        } else if (twolevelSelectVal != -1) {
            selectLevel = twolevelSelectVal;
        } else if (threelevelSelectVal != -1) {
            selectLevel = threelevelSelectVal;
        } else {
            selectLevel = 0;
        }
        //alert(oneleveSelectVal);
        getdata(1, selectLevel);
    });

    /**
     * 初始化分页 
     * @param totalCount 总页数
     * @param pageIndex  页面索引
     * @returns
     */
    function initPage(totalCount, pageIndex) {
        if (totalCount <= pageSize) totalCount = pageSize + 1;
        //page
        laypage({
            cont: 'pages',
            pages: Math.ceil(totalCount / pageSize), // 总的分页数
            groups: 5, // 展示的页数
            first: 1,
            last: Math.ceil(totalCount / pageSize),
            skip: true,
            curr: pageIndex,
            jump: function(obj, first) {
                //alert("初始化成功"+obj.curr);
                if (!first) {
                    getdata(obj.curr);
                }
            }
        });

    }

    /**
     * 获取数据
     * @param pageIndex
     * @returns
     */
    function getdata(pageIndex, selectLevel) {
        if (selectLevel == undefined) selectLevel = 0;
        $.ajax({
            url: "/levelinfo",
            type: "get",
            async: false,
            data: { "partsTypeId": selectLevel, "selecDepth": 6, "pageSize": pageSize, "pageIndex": pageIndex },
            success: function(data) {
                comboTable(data, pageIndex);
            },
            error: function(data) {
                alert("页面查询失败");
            }
        });

    }

    /**
     * 
     * @param res 返回的数据 
     * @param pageIndex 显示的页面索引
     * @returns
     */
    function comboTable(res, pageIndex) {
        /**
         * 显示一二三等级
         */
        partsLevel();

        /**
         * 显示表单数据
         */
        displayPartsTypeInfo(res);

        /**
         * 初始化分页
         */
        initPage(res.totalCount, pageIndex);
    }

    /**
     * 获取等级数据源
     * @returns
     */
    function partsLevel() {
        $.ajax({
            url: "/findpartslevel",
            type: "get",
            async: false,
            data: { "pid": 0, "operflag": 1 },
            success: function(res) {
                displayLevel(res);
            }
        });
    }
    /**
     * 显示等级
     * @param res
     * @returns
     */
    function displayLevel(res) {
        var onlevel = `<option value="-1">全部</option>`,
            twolevel = `<option value="-1">全部</option>`,
            threelevel = `<option value="-1">全部</option>`;
        var trs = ``,
            one = ``,
            two = ``,
            three = ``;
        //循环菜单树
        if (res.children != null && res.children != undefined) {
            var oneChildren = res.children;
            for (var i = 0; i < oneChildren.length; i++) { //一级菜单
                onlevel += `<option value="${oneChildren[i].id}">${oneChildren[i].name}</option>`;
                var twoChildren = res.children[i].children;
                if (twoChildren != null && twoChildren != undefined) {
                    for (var j = 0; j < res.children[i].children.length; j++) { //二级菜单
                        twolevel += `<option value="${twoChildren[j].id}">${twoChildren[j].name}</option>`;
                        var threeChildren = res.children[i].children[j].children;
                        if (threeChildren != null && threeChildren != undefined) {
                            for (var q = 0; q < threeChildren.length; q++) { //三级菜单
                                threelevel += `<option value="${threeChildren[q].id}">${threeChildren[q].name}</option>`;
                                continue;
                            }
                            //第三级拼接
                            $("#threeleveltype").html(threelevel);
                        }
                        continue;
                    }
                    //第二级别的拼接
                    $("#twoleveltype").html(twolevel);
                }
                continue;

            }
            $("#oneleveltype").html(onlevel);
        }
    }

    /**
     * 组装显示等级的数据
     * @param res
     * @returns
     */
    function displayPartsTypeInfo(res) {
        var tr;
        if (res != null) {
            var len = res.result.length;
            for (var i = 0; i < len; i++) {
                var levelInfo = res.result[i].length;
                tr += `<tr>`;
                for (var j = 0; j < levelInfo; j++) {
                    tr += ` <td>${res.result[i][j].name}<input type="hidden" value=${res.result[i][j].id}></td>`;
                }
                tr += `<td class="operation">
		                  <button id="view" data-method="view" class="layui-btn view_c">查看</button>
		                  <button id="edit" data-method="edit" class="layui-btn layui-btn-normal edit_c">编辑</button>
		       </td></tr>`;
                $("#partsTypeInfo").html(tr);
            }

        }

    }

    /**
     * 添加子节点
     * @param selectNodeId 当前选中节点
     * @param typeName 类型名称
     * @param index 弹出层
     * @returns
     */

    function addChildren(selectNodeId, typeName, index, addAndEditAndViewFlag) {
        //把他的id当做 pid
        //新增一个配件信息	
        /**
         * 加载节点树
         * @param level 1
         * @param flag 1:新增  2:编辑 3.查看
         * @returns
         */
        //function loadNodes(level,flag)
        var data = { "partsTypeId": selectNodeId, "typeName": typeName };
        data = JSON.stringify(data);
        $.ajax({
            url: "/addpartstype",
            type: "post",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function(data) {
                layer.msg("子节点添加成功");
                //layer.close(index);
                //loadNodes(0,0);
                if (addAndEditAndViewFlag == 1) { //1 新增
                    $('#addItemTree').html("");
                    loadNodes(0, 1);
                } else if (addAndEditAndViewFlag == 2) { //2 编辑
                    $('#editItemTree').html("");
                    loadNodes(selectNodeId, 2); //根据选中的节点重新找到父级,重新加载
                }

            },
            error: function(data) {
                layer.msg("子节点添加失败");
            }
        });
    }

    /**
     * 添加相同节点
     * @returns
     */
    function addSameLevelNode(selectNodeId, typeName, index, addAndEditAndViewFlag) {
        var data = { "partsTypeId": selectNodeId, "typeName": typeName };
        data = JSON.stringify(data);
        $.ajax({
            url: "/addsamelevelpartstype",
            type: "post",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function(data) {
                layer.msg("添加同级几点成功");
                if (addAndEditAndViewFlag == 1) { //1 新增
                    $('#addItemTree').html("");
                    loadNodes(0, 1);
                } else if (addAndEditAndViewFlag == 2) { //2 编辑
                    $('#editItemTree').html("");
                    loadNodes(selectNodeId, 2); //根据选中的节点重新找到父级,重新加载
                }
                //layer.close(index);
            },
            error: function(data) {
                layer.msg("添加同级几点失败");
            }
        });
    }

    /**
     * 删除节点
     * @returns
     */
    function del(selectNodeId, addAndEditAndViewFlag, level) {
        alert("addAndEditAndViewFlag:" + addAndEditAndViewFlag);
        var data = { "partsTypeId": selectNodeId };
        data = JSON.stringify(data);
        $.ajax({
            url: "/deletepartstype/?partTypeId=" + selectNodeId,
            type: "DELETE",
            async: false,
            //contentType: "application/json; charset=utf-8",
            //data : data,
            success: function(data) {
                layer.msg("删除成功" + addAndEditAndViewFlag);
                if (addAndEditAndViewFlag == 1) { //1 新增
                    $('#addItemTree').html("");
                    loadNodes(0, 1);
                } else if (addAndEditAndViewFlag == 2) { //2 编辑
                    $('#editItemTree').html("");
                    loadNodes(level, 2); //根据选中的节点重新找到父级,重新加载
                }
                //layer.close(index);
            },
            error: function(data) {
                layer.msg("删除失败");
            }
        });
    }

    /**
     * 删除检查
     * @param selectNodeId 选中id
     * @param index 弹出框索引
     * @param addAndEditAndViewFlag 新增删除操作标记
     * @param level 编辑的时候,查找等级
     * @returns
     */
    function check(selectNodeId, index, addAndEditAndViewFlag, level) {
        //    	var data = {"partsTypeId":selectNodeId};
        //    	data = JSON.stringify(data);
        $.ajax({
            url: "/checkdel",
            type: "get",
            async: false,
            //contentType: "application/json; charset=utf-8",
            data: { "partTypeId": selectNodeId },
            success: function(data) {
                if (data.result == true) {
                    layer.msg("存在子集不可删除");
                    //					layer.close(index);
                } else {
                    del(selectNodeId, addAndEditAndViewFlag, level);
                }
            },
            error: function(data) {
                layer.msg("检查节点失败");
            }
        });
    }

    //按钮禁用
    function buttongForbidden() {
    	$(".view_c").attr("disabled", "disabled");
    	$(".edit_c").attr("disabled", "disabled");
        $("#addCategories").attr("disabled", "disabled");
        $("#searchCategories").attr("disabled", "disabled");
    }

    //按钮启用
    function clearButtonForbidden() {
        $(".view_c").removeAttr("disabled");
        $(".edit_c").removeAttr("disabled");
        $("#addCategories").removeAttr("disabled");
        $("#searchCategories").removeAttr("disabled");
    }
});


/**
 * 树形菜单
 */
var treeTemp;

/**
 * 
 * @param e 当前元素
 * @param treeId id="cTree"
 * @param treeNode  当前节点
 * @returns
 */
function onClick(e, treeId, treeNode) {
    $(e.target).parents('li').siblings('li').find('.curSelectedNode').removeClass('curSelectedNode');
    if (treeId == 'commodityTree') {
        // 保存id
        selectTreeId = treeNode.id;
        console.log("onClick--->" + treeNode.id);
        $("#commodityName").val(treeNode.name);
    } else {
        // 保存id
        selectTreeId = treeNode.id;
        $("#cName").val(treeNode.name);
    }
}

// 配件树展示与收缩
function showMenu(temp) {
    treeTemp = temp;
    if (treeTemp == 'model') {
        $("#addTree").css({ left: 0, top: "37px" }).slideDown("fast");
    } else if (treeTemp == 'main') {
        $("#addTree").css({ left: 0, top: "37px" }).slideDown("fast");
    }
    $("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    if (treeTemp == 'model') {
        $("#modelContent").fadeOut("fast");
    } else if (treeTemp == 'main') {
        $("#menuContent").fadeOut("fast");
    }
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (treeTemp == 'model') {
        if (!(event.target.id == "menuBtn" || event.target.id == "modelContent" || $(event.target).parents("#modelContent").length > 0)) {
            hideMenu();
        }
    } else if (treeTemp == 'main') {
        if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
            hideMenu();
        }
    }
}

/**
 * 配件树数据源
 * @returns
 */
function zNodes() {
    var node;
    $.ajax({
        url: "/findpartstype",
        type: "get",
        async: false,
        success: function(data) {
            //node =JSON.stringify(data);
            node = data;
        },
        error: function(data) {
            layer.msg("页面查询失败");
        }
    });
    return node;
}
var zNodes = zNodes();
//zNodes.unshift({ id: 0, pId: -1, name: "全部", open: true });
//alert(JSON.stringify(zNodes));
// 配件树初始化
$(document).ready(function() {
    $.fn.zTree.init($("#commodityTree"), setting, zNodes);
    $.fn.zTree.init($("#cTree"), setting, zNodes);
});
// 配件树设置
var setting = {
    view: {
        dblClickExpand: false,
        autoCancelSelected: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        //beforeClick: beforeClick, //检查
        onClick: onClick
    }
};


// 配件树数据源
//var zNodes = [
//    { id: 1, pId: 0, name: "北京" },
//    { id: 2, pId: 0, name: "天津" },
//    { id: 3, pId: 0, name: "上海" },
//    { id: 6, pId: 0, name: "重庆" },
//    { id: 4, pId: 0, name: "河北省", open: true },
//    { id: 41, pId: 4, name: "石家庄" },
//    { id: 42, pId: 4, name: "保定" },
//    { id: 43, pId: 4, name: "邯郸" },
//    { id: 44, pId: 4, name: "承德" },
//    { id: 5, pId: 0, name: "广东省", open: true },
//    { id: 51, pId: 5, name: "广州" },
//    { id: 52, pId: 5, name: "深圳" },
//    { id: 53, pId: 5, name: "东莞" },
//    { id: 54, pId: 5, name: "佛山" },
//    { id: 6, pId: 0, name: "福建省", open: true },
//    { id: 61, pId: 6, name: "福州" },
//    { id: 62, pId: 6, name: "厦门" },
//    { id: 63, pId: 6, name: "泉州" },
//    { id: 64, pId: 6, name: "三明" }
//];
















