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

	// DU LICH
	{
		name: 'Du Lịch',
		path: '/du-lich',
		icon: 'GlobalOutlined',
		routes: [
			{
				name: 'Khám phá',
				path: '/du-lich/trang-chu',
				component: './DuLich/TrangChu',
				icon: 'CompassOutlined',
			},
			{
				name: 'Lịch trình',
				path: '/du-lich/lich-trinh',
				component: './DuLich/LichTrinh',
				icon: 'CalendarOutlined',
			},
			{
				name: 'Ngân sách',
				path: '/du-lich/ngan-sach',
				component: './DuLich/NganSach',
				icon: 'DollarOutlined',
			},
			{
				name: 'Quản lý điểm đến',
				path: '/du-lich/admin/diem-den',
				component: './DuLich/Admin/DiemDen',
				icon: 'EnvironmentOutlined',
			},
			{
				name: 'Thống kê',
				path: '/du-lich/admin/thong-ke',
				component: './DuLich/Admin/ThongKe',
				icon: 'BarChartOutlined',
			},
		],
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
