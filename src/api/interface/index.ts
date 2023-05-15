// * 请求响应参数(不包含data)
export interface Result {
	readonly code: number
	readonly msg: string
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T | any
}

// * 分页请求参数
export interface ReqPage {
	pageNumber: number
	pageSize: number
	orderColumnName?: string
	orderBy?: string
	modelMap?: { [key: string]: any }
	queryTypeMap?: { [key: string]: any }
}

// * 分页响应参数
export interface ResPage<T> {
	list: T[]
	pageNumber: number
	pageSize: number
	totalRow: number
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		fileUrl: string
	}
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		userCode: string
		password: string
	}
	export interface ResLogin {
		token: string
		user: {
			id: number
			sex: number
			userName: string
			userCode: number
		}
	}
	export interface ResAuthButtons {
		[key: string]: string[]
	}
}

// * 用户管理模块
export namespace User {
	export interface ReqUserParams extends ReqPage {
		username: string
		gender: number
		idCard: string
		email: string
		address: string
		createTime: string
		status: number
	}
	export interface ResUserList {
		id: string
		username: string
		gender: number
		user: {
			detail: {
				age: number
			}
		}
		idCard: string
		email: string
		address: string
		createTime: string
		status: number
		avatar: string
		photo: any[]
		children?: ResUserList[]
	}
	export interface ResStatus {
		userLabel: string
		userValue: number
	}
	export interface ResGender {
		genderLabel: string
		genderValue: number
	}
	export interface ResDepartment {
		id: string
		name: string
		children?: ResDepartment[]
	}
	export interface ResRole {
		id: string
		name: string
		children?: ResDepartment[]
	}
}

// * 菜单管理模块
export namespace Menu {
	export interface ResList {
		id: number
		icon: string
		isEnabled: boolean
		displayNo: number
		menuCode: string
		menuName: string
		parentCode: string
		parentName: string
		menuType: number
	}

	export interface MenuOptions {
		component: string
		icon: string
		linkPage: string
		menuCode: string
		menuName: string
		parentCode: string
		menuType: number
	}
}

// * 字典管理模块
export namespace Dict {
	export interface ResList {
		id: number
		isEnabled: boolean
		displayNo: number
		dictCode: string
		dictName: string
		remark: string
	}
	export interface ResItemList {
		id: number
		dictCode: string
		displayNo: number
		itemKey: string
		itemValue: string
		remark: string
	}
}

// * 部门管理模块
export namespace Org {
	export interface ResList {
		id: number
		isEnabled: boolean
		displayNo: number
		orgCode: string
		orgName: string
		parentCode: string
		parentName: string
		headName: string
		headMobile: string
		headEmail: string
		remark: string
	}
}

// * 角色管理模块
export namespace Role {
	export interface ResList {
		id: number
		isEnabled: boolean
		displayNo: number
		roleCode: string
		roleName: string
		parentCode: string
		parentName: string
		remark: string
	}
}

// * 用户管理模块
export namespace User {
	export interface ResList {
		id: number
		allowLogin: boolean
		displayNo: number
		userCode: string
		password: string
		userName: string
		orgCode: string
		sex: string
		mobile: string
		email: string
		address: string
		remark: string
	}
}

// * 日志管理模块
export namespace Log {
	export interface ResList {
		id: number
		apiUrl: string
		apiType: string
		apiCost: number
		visitor: string
		visitIp: string
		remark: string
		createTime: string
	}
}

// Array<number> == number[]  表示数组且元素为数字 [1, 2, 3, 4]
// [x: string]: any  表示这个属性的类型为字符串， any表示这个属性的值为任意数据类型
// say(): string  表示这个是say方法，返回值是一个字符串

// extends 继承
// interface ReqUserParams extends ReqPage { username: string } 表示ReqUserParams继承了ReqPage， 并且多添加了一个username属性

// // 相当于: type PartialUser = { id?: number; age?: number; name?: string; }
// type PartialUser = Partial<User>
