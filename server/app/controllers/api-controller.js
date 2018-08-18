
// 左侧菜单数据
// Java
exports.leftmenu = function() {
    this.method = 'ALL';
    this.route = '/rest/leftmenu';

    this.func = function(req, res) {
        res.send({
            data: [
                {group: "", title: "首页", url: "/web/view", icon: "<i class=\"fa fa-fw fa-home\"></i>"},
                {group: "患者管理", title: "我的患者", url: "/web/view?v=my#/rest/my/patients", icon: "<i class=\"fa fa-fw fa-user\"></i>", active: true},
                {group: "患者管理", title: "分组管理", url: "/web/view?v=my#/rest/my/group", icon: "<i class=\"fa fa-fw fa-yelp\"></i>"},
                {group: "患者管理", title: "综合查询", url: "/web/view?v=search", icon: "<i class=\"fa fa-fw fa-search\"></i>"},
                {group: "统计分析", title: "基础统计", url: "/web/view?v=analysis-base", icon: "<i class=\"fa fa-fw fa-area-chart\"></i>"},
                {group: "管理", title: "医生信息管理", url: "/web/view?v=manage-user", icon: "<i class=\"fa fa-fw fa-user-md\"></i>"},
                {group: "管理", title: "症状基础信息管理", url: "/web/view?v=manage-custom-symptom", icon: "<i class=\"fa fa-fw fa-cogs\"></i>"},
                {group: "管理", title: "药名基础信息管理", url: "/web/view?v=manage-custom-drug", icon: "<i class=\"fa fa-fw fa-cogs\"></i>"},
            ]
        });
    };
};

// 左侧菜单->我的患者
// Java
exports.my_patients = function() {
    this.method = 'ALL';
    this.route = '/rest/my/patients';

    this.func = function(req, res) {

        var data = [];

        data.push({id: 1, name: "小红", age: 25, sex: 'fdmale', receiveTime: "2017/06/05", lastTime: "2017/06/05"});
        data.push({id: 2, name: "小金", age: 25, sex: 'fdmale', receiveTime: "2017/06/05", lastTime: "2017/06/05"});

        res.send({
            data: data
        });
    };
};

// 左侧菜单->分组管理
// Java
exports.my_group = function() {
    this.method = 'ALL';
    this.route = '/rest/my/group';

    this.func = function(req, res) {

        var data = [];

        data.push({id: 1, name: 'PD综合征', count: 2});
        data.push({id: 2, name: '早发型PD', count: 0});
        data.push({id: 3, name: '科研对象', count: 0});

        res.send({
            data: data
        });
    };
};

// 医生列表（所有的）
// Java
exports.doc_list = function() {
    this.method = 'ALL';
    this.route = '/rest/doc/list';

    this.func = function(req, res) {

        var data = [];

        data.push({id: 1, name: '医生A'});
        data.push({id: 2, name: '医生B'});
        data.push({id: 3, name: '医生C'});

        res.send({
            data: data
        });
    };
};

// 左侧菜单->我的患者->某个患者
// Java
exports.patients = function() {
    this.method = 'ALL';
    this.route = '/rest/patients';

    this.func = function(req, res) {
        var body = req.body;
        var id = body.id;

        var data = [];

        // // 主治医生
        // data.push({name: '', title: '主治医生', array: ['医生A', '医生B']});

        // 分组信息
        data.push({name: '', title: '分组', array: ['PD综合征', '早发型PD', '科研对象']});

        // 基础信息
        data.push({name: '', title: 'ID', value: id});
        data.push({name: '', title: '医院患者编号', value: '201700000000001'});
        data.push({name: '', title: '姓名', value: '姓名姓名' + id});
        data.push({name: '', title: '性别', value: '女'});
        data.push({name: '', title: '年龄', value: '25'});
        data.push({name: '', title: '出生日期', value: '1986/09/21'});
        data.push({name: '', title: '接收时间', value: '2017/01/25'});
        data.push({name: '', title: '最后就诊', value: '2017/01/25'});
        data.push({name: '', title: '籍贯', value: '籍贯信息'});
        data.push({name: '', title: '民族', value: '汉族'});
        data.push({name: '', title: '身份证号', value: '000000000000000000'});
        data.push({name: '', title: '学历', value: '博士后'});
        data.push({name: '', title: '职业', value: '职业信息'});
        data.push({name: '', title: '联系电话', value: '联系电话'});
        data.push({name: '', title: '紧急联系电话', value: '紧急联系电话'});
        data.push({name: '', title: '婚姻', value: '未婚'});
        data.push({name: '', title: '血型', value: '未知'});
        data.push({name: '', title: '身高', value: '200cm'});
        data.push({name: '', title: '体重', value: '100kg'});
        data.push({name: '', title: '经济状况', value: '高级白领'});
        data.push({name: '', title: '居住状况', value: '上海租房'});
        data.push({name: '', title: '家庭住址', value: '家庭住址'});

        // 病症信息
        data.push({name: '', title: '病症信息', list: [
            [
                {name: '', title: '主诉', value: '主诉主诉主诉主诉1'},
                {name: '', title: '症状', array: ['K000001', 'K000002', 'K000003']},
            ],
            [
                {name: '', title: '主诉', value: '主诉主诉主诉主诉2'},
                {name: '', title: '症状', array: ['K000001', 'K000003']},
            ],
            [
                {name: '', title: '主诉', value: '主诉主诉主诉主诉3'},
                {name: '', title: '症状', array: ['K000002']},
            ]
        ]});

        // 家族史
        data.push({name: '', title: '家族史', list: [
            [
                {name: '', title: '主诉', value: '家族史1'},
            ],
            [
                {name: '', title: '主诉', value: '家族史2'},
            ],
            [
                {name: '', title: '主诉', value: '家族史3'},
            ]
        ]});

        // 妊娠史
        data.push({name: '', title: '妊娠史', list: [
            [
                {name: '', title: 'G', value: '1'},
                {name: '', title: 'P', value: '2'},
                {name: '', title: '自发流产', value: '是'},
                {name: '', title: '自发时间', value: '2017/10/01'},
                {name: '', title: '人流次数', value: '1'},
                {name: '', title: '妊娠情况', value: '2'},
                {name: '', title: '胎儿情况', value: '3'},
                {name: '', title: '备注', value: '4'},
                {name: '', title: '妊娠结局', value: '5'},
                {name: '', title: '是否有产科合并症', value: '是'},
                {name: '', title: '产科合并症备注', value: '6'},
            ],
        ]});

        // 药方
        data.push({name: '', title: '药方', list: [
            [
                {name: '', title: '开药时间', value: '2018/01/17'},
                {name: '', title: '药名', value: 'Y000001'},
                {name: '', title: '规格', value: '125μg，1.2mg（注射液）-1mL：50μg（皮试液）'},
                {name: '', title: '剂量', value: '每次服用量'},
                {name: '', title: '吃药频率', value: ''},
                {name: '', title: '什么时候开始吃', value: ''},
                {name: '', title: '备注', value: ''},
            ],
        ]});

        // 辅助检查（实验室检查）
        data.push({name: '', title: '实验室检查', list: [
            [
                {name: '', title: '文件', value: 'excel1.xlsx'},
                {name: '', title: '文件', value: 'excel2.xlsx'},
                {name: '', title: '文件', value: 'excel3.xlsx'},
                {name: '', title: '文件', value: 'excel4.xlsx'},
                {name: '', title: '文件', value: 'excel5.xlsx'},
            ]
        ]});

        // 辅助检查（影像检查）
        data.push({name: '', title: '影像检查', list: [
            [
                {name: '', title: '图像', value: '1.jpg'},
                {name: '', title: '图像', value: '2.jpg'},
                {name: '', title: '图像', value: '3.jpg'},
                {name: '', title: '图像', value: '4.jpg'},
                {name: '', title: '图像', value: '5.jpg'},
            ]
        ]});
        
        res.send({
            data: data
        });
    };
};

// 左侧菜单->我的患者->某个患者
// Java
exports.group = function() {
    this.method = 'ALL';
    this.route = '/rest/group';

    this.func = function(req, res) {
        var body = req.body;
        var id = body.id;

        var data = {
            name: 'PD综合征',
            list: []
        };

        data.list.push({id: 1, name: "小红", age: 25, sex: 'fdmale', receiveTime: "2017/06/05", lastTime: "2017/06/05"});
        data.list.push({id: 2, name: "小金", age: 25, sex: 'fdmale', receiveTime: "2017/06/05", lastTime: "2017/06/05"});

        res.send({
            data: data
        });
    };
};

//获取自定义症状
// Java
exports.custom_symptom = function() {
    this.method = 'ALL';
    this.route = '/rest/custom/symptom';

    this.func = function(req, res) {

        var data = [];

        data.push({id: 'K000001', value: 'K000001', title: '皮疹'});
        data.push({id: 'K000002', value: 'K000002', title: '口腔溃疡'});
        data.push({id: 'K000003', value: 'K000003', title: '脱发'});
        data.push({id: 'K000004', value: 'K000004', title: '雷诺现象'});
        data.push({id: 'K000005', value: 'K000005', title: '网状青斑'});
        data.push({id: 'K000006', value: 'K000006', title: '皮肤硬化'});
        data.push({id: 'K000007', value: 'K000007', title: '关节疼痛'});
        data.push({id: 'K000008', value: 'K000008', title: '光过敏'});

        res.send({
            data: data
        });
    };
};

//获取自定义药名
// Java
exports.custom_drug = function() {
    this.method = 'ALL';
    this.route = '/rest/custom/drug';

    this.func = function(req, res) {

        var data = [];

        data.push({id: 'Y000001', value: 'Y000001', title: '激素种类及剂量'});
        data.push({id: 'Y000002', value: 'Y000002', title: '羟氯喹（HCQ）'});
        data.push({id: 'Y000003', value: 'Y000003', title: '抗凝类药物（如低分子肝素）'});
        data.push({id: 'Y000004', value: 'Y000004', title: '抗血小板类药物（如阿司匹林）'});

        res.send({
            data: data
        });
    };
};

// 表格数据
exports.datatable_search = function() {
    this.method = 'ALL';
    this.route = '/rest/datatable/search';

    this.func = function(req, res) {
        // var query = req.query;
        // var columns = query.columns;
        // var order = query.order;
        // var start = query.start;
        // var length = query.length;
        // var search = query.search;
        // console.log(query.columns);
        // console.log(query.order);
        // console.log(query.start);
        // console.log(query.length);
        // console.log(query.search);
        res.send({
            "data": [
                {
                    "身份证号": "111111111111111111",
                    "姓名": "李宁",
                    "年龄": "18",
                    "发病日期": "2011/04/25",
                    "学历": "博士",
                    "职业": "玩电脑"
                },
                {
                    "身份证号": "111111111111111111",
                    "姓名": "李宁",
                    "年龄": "18",
                    "发病日期": "2011/04/25",
                    "学历": "博士",
                    "职业": "玩电脑"
                },
                {
                    "身份证号": "111111111111111111",
                    "姓名": "李宁",
                    "年龄": "18",
                    "发病日期": "2011/04/25",
                    "学历": "博士",
                    "职业": "玩电脑"
                },
                {
                    "身份证号": "111111111111111111",
                    "姓名": "李宁",
                    "年龄": "18",
                    "发病日期": "2011/04/25",
                    "学历": "博士",
                    "职业": "玩电脑"
                },
                {
                    "身份证号": "111111111111111111",
                    "姓名": "李宁",
                    "年龄": "18",
                    "发病日期": "2011/04/25",
                    "学历": "博士",
                    "职业": "玩电脑"
                }
            ]
        });
    };
};

// 表格数据
// UserResource
exports.datatable_manage_user = function() {
    this.method = 'ALL';
    this.route = '/rest/datatable/manage/user';

    this.func = function(req, res) {
        // var query = req.query;
        // var columns = query.columns;
        // var order = query.order;
        // var start = query.start;
        // var length = query.length;
        // var search = query.search;
        // console.log(query.columns);
        // console.log(query.order);
        // console.log(query.start);
        // console.log(query.length);
        // console.log(query.search);
        res.send({
            "data": [
                {
                    "姓名": "李宁",
                    "电话": "13700000000",
                    "备注": "主任"
                },
                {
                    "姓名": "周fu磊",
                    "电话": "13700000000",
                    "备注": "副主任"
                },
            ]
        });
    };
};

// 表格数据
// DrugResource
exports.datatable_manage_drug = function() {
    this.method = 'ALL';
    this.route = '/rest/datatable/manage/drug';

    this.func = function(req, res) {
        // var query = req.query;
        // var columns = query.columns;
        // var order = query.order;
        // var start = query.start;
        // var length = query.length;
        // var search = query.search;
        // console.log(query.columns);
        // console.log(query.order);
        // console.log(query.start);
        // console.log(query.length);
        // console.log(query.search);
        res.send({
            "data": [
                {"编号": "Y000001", "药名": "激素种类及剂量", "规格": "125μg，1.2mg（注射液）-1mL：50μg（皮试液）", "剂量": "", "备注": ""},
                {"编号": "Y000002", "药名": "羟氯喹（HCQ）", "规格": "125μg，1.2mg（注射液）-1mL：50μg（皮试液）", "剂量": "", "备注": ""},
                {"编号": "Y000003", "药名": "抗凝类药物（如低分子肝素）", "规格": "125μg，1.2mg（注射液）-1mL：50μg（皮试液）", "剂量": "", "备注": ""},
                {"编号": "Y000004", "药名": "抗血小板类药物（如阿司匹林）", "规格": "125μg，1.2mg（注射液）-1mL：50μg（皮试液）", "剂量": "", "备注": ""},
            ]
        });
    };
};

// 表格数据
// SymptomResource
exports.datatable_manage_symptom = function() {
    this.method = 'ALL';
    this.route = '/rest/datatable/manage/symptom';

    this.func = function(req, res) {
        // var query = req.query;
        // var columns = query.columns;
        // var order = query.order;
        // var start = query.start;
        // var length = query.length;
        // var search = query.search;
        // console.log(query.columns);
        // console.log(query.order);
        // console.log(query.start);
        // console.log(query.length);
        // console.log(query.search);
        res.send({
            "data": [
                {"编号": "K000001", "症状": "皮疹", "备注": ""},
                {"编号": "K000002", "症状": "口腔溃疡","备注": ""},
                {"编号": "K000003", "症状": "脱发","备注": ""},
                {"编号": "K000004", "症状": "雷诺现象","备注": ""},
                {"编号": "K000005", "症状": "网状青斑","备注": ""},
                {"编号": "K000006", "症状": "皮肤硬化","备注": ""},
                {"编号": "K000007", "症状": "关节疼痛","备注": ""},
                {"编号": "K000008", "症状": "光过敏","备注": ""},
            ]
        });
    };
};
