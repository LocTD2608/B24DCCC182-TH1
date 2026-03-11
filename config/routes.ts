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
	{
		path: '/oan-tu-ti',
		name: 'OanTuTi',
		component: './OanTuTi',
		icon: 'SmileOutlined',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'NganHangCauHoi',
		component: './NganHangCauHoi',
		icon: 'ReadOutlined',
	},
	{
		path: '/quan-ly',
		name: 'QuanLy',
		component: './QuanLy',
		icon: 'CalendarOutlined',
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
		component: './exception/404',
	},
];
