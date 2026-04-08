export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},

	{
        path: '/statistics',
        name: 'Thống kê & Báo cáo',
        component: './statistics',
        icon: 'AreaChartOutlined',
        locale: false, 
    },

	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/guess-number',
		name: 'GuessNumber',
		component: './GuessNumber',
		icon: 'TrophyOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		component: './TodoList',
		icon: 'CheckSquareOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/van-bang',
		name: 'Văn bằng',
		icon: 'SolutionOutlined',
		routes: [
			{
				path: '/van-bang/bieu-mau',
				name: 'Cấu hình biểu mẫu',
				component: './VanBang/BieuMau',
			},
		]
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/quyet-dinh',
		name: 'Quyết định tốt nghiệp',
		icon: 'file-done',
		component: './QuyetDinhTotNghiep', 
	},
	{
		path: '/registration',
		name: 'Quản lý đơn đăng ký', // Tên hiển thị trên menu
		icon: 'FormOutlined',        // Icon từ Antd
		component: './Registration', // Đường dẫn tới folder src/pages/Registration
	},
	{
		path: '/members',
		name: 'Quản lý thành viên',
		icon: 'TeamOutlined',
		component: './Members',      // Cho Module 3
	},
	{
		component: './exception/404',
	},
];
