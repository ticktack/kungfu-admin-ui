import { Login } from '@/api/interface/index'
import { GlobalStore } from '@/stores'
// import qs from 'qs'
import http from '@/api'

/**
 * @name 登录模块
 */
// * 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(`/user-login/login`, params, { headers: { noLoading: true } })
}

// * 获取按钮权限
export const getAuthButtonListApi = () => {
	const globalStore = GlobalStore()
	const userCode = globalStore.userInfo.userCode
	return http.get<Login.ResAuthButtons>(`/sys-menu/userAuthButtons`, { userCode }, { headers: { noLoading: true } })
}

// * 获取菜单列表
export const getAuthMenuListApi = async () => {
	const globalStore = GlobalStore()
	const userCode = globalStore.userInfo.userCode
	return http.get<Menu.MenuOptions[]>(`/sys-menu/userMenuTree`, { userCode }, { headers: { noLoading: true } })
}
