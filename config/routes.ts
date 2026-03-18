export default [
	{
	  path: '/tra-cuu-van-bang',
	  name: 'Tra cứu văn bằng',
	  component: './tra-cuu-van-bang',
	},
	{
	  path: '/tra-cuu-van-bang/:id',
	  component: './tra-cuu-van-bang/Detail',
	  hideInMenu: true,
	},
  ];

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
 feature/thong_tin_van_bang
        path: '/tra-cuu-van-bang',
        name: 'Tra cứu Văn bằng',
        icon: 'search', // Bạn có thể đổi icon tùy thích
        component: './TraCuu',
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
		path: '/quan-ly-so-van-bang',
		name: 'Quản lý Sổ Văn Bằng',
		component: './QuanLySoVanBang',
		icon: 'BookOutlined',
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
		component: './exception/404',
	},
];
