import http from '@/api'
import { ReqPage, Dict, Org, Role, User } from '@/api/interface/index'

// * [菜单]-树查询
export const fetchMenuTreeAll = (params?: { menuType: number }) => {
	return http.get(`/sys-menu/tree`, params)
}

// * [菜单]-分页查询
export const fetchMenuList = (data: ReqPage) => {
	return http.post(`/sys-menu/queryPage`, data)
}

// * [菜单]-设置状态
export const setMenuStatus = (params: { menuId: number; isEnabled: boolean }) => {
	return http.get(`/sys-menu/setStatus`, params)
}

// * [菜单]-新增或修改
export const saveOrUpdateMenu = (data: any) => {
	return http.post(`/sys-menu/saveOrUpdate`, data)
}

// * [菜单]-删除
export const deleteMenuById = (sysMenuId: number) => {
	return http.get(`/sys-menu/deleteById`, { sysMenuId })
}

// * [菜单]-角色菜单树查询
export const fetchRoleMenuTree = (roleCode: string) => {
	return http.get(`/sys-menu/roleMenuTree`, { roleCode })
}

// * [字典]-树查询
export const fetchDictTreeAll = () => {
	return http.get(`/sys-dict/tree`)
}

// * [字典]-分页查询
export const fetchDictList = (data: ReqPage) => {
	return http.post(`/sys-dict/queryPage`, data)
}

// * [字典]-新增或修改
export const saveOrUpdateDict = (data: Dict.ResList) => {
	return http.post(`/sys-dict/saveOrUpdate`, data)
}

// * [字典]-删除
export const deleteDictByIds = (ids: number[]) => {
	return http.get(`/sys-dict/deleteByIds`, { sysDictIds: ids.join() })
}

// * [字典]-详情
export const getDictInfo = (dictCode: string) => {
	return http.get(`/sys-dict/queryDict`, { dictCode })
}

// * [字典数据]-分页查询
export const fetchDictItemList = (data: ReqPage) => {
	return http.post(`/sys-dict-item/queryPage`, data)
}

// * [字典数据]-新增或修改
export const saveOrUpdateDictItem = (data: Dict.ResItemList) => {
	return http.post(`/sys-dict-item/saveOrUpdate`, data)
}

// * [字典数据]-删除
export const deleteDictItemByIds = (ids: number[]) => {
	return http.get(`/sys-dict-item/deleteByIds`, { sysDictItemIds: ids.join() })
}

// * [部门]-树查询
export const fetchOrgTreeAll = () => {
	return http.get(`/sys-org/tree`)
}

// * [部门]-新增或修改
export const saveOrUpdateOrg = (data: Org.ResList) => {
	return http.post(`/sys-org/saveOrUpdate`, data)
}

// * [部门]-删除
export const deleteOrgByIds = (ids: number[]) => {
	return http.get(`/sys-org/deleteByIds`, { sysOrgIds: ids.join() })
}

// * [角色]-树查询
export const fetchRoleTreeAll = () => {
	return http.get(`/sys-role/tree`)
}

// * [角色]-新增或修改
export const saveOrUpdateRole = (data: Role.ResList) => {
	return http.post(`/sys-role/saveOrUpdate`, data)
}

// * [角色]-删除
export const deleteRoleByIds = (ids: number[]) => {
	return http.get(`/sys-role/deleteByIds`, { sysRoleIds: ids.join() })
}

// * [角色]-保存菜单权限
export const saveRoleMenu = (params: { roleCode: string; menuCodes: string }) => {
	return http.get(`/sys-role/saveRoleMenus`, params)
}

// * [角色]-菜单权限查询
export const getRoleMenuCodes = (roleCode: string) => {
	return http.get(`/sys-role/getRoleMenuCodes`, { roleCode })
}

// * [用户]-分页查询
export const fetchUserList = (data: ReqPage) => {
	return http.post(`/sys-user/queryPage`, data)
}

// * [用户]-新增或修改
export const saveOrUpdateUser = (data: User.ResList) => {
	return http.post(`/sys-user/saveOrUpdate`, data)
}

// * [用户]-删除
export const deleteUserByIds = (ids: number[]) => {
	return http.get(`/sys-user/deleteByIds`, { sysUserIds: ids.join() })
}

// * [用户]-重置密码
export const resetUserPwdByIds = (ids: number[]) => {
	return http.get(`/sys-user/resetPassword`, { userIds: ids.join() })
}

// * [用户]-设置登录状态
export const setUserAllowLoginStatus = (params: { userId: number; isAllowLogin: boolean }) => {
	return http.get(`/sys-user/setAllowLogin`, params)
}

// * [用户]-设置用户角色
export const saveUserRole = (params: { userCode: string; roleCodes: string }) => {
	return http.get(`/sys-user/saveUserRole`, params)
}

// * [用户]-角色查询
export const getUserRoleCodes = (userCode: string) => {
	return http.get(`/sys-user/getUserRoleCodes`, { userCode })
}

// * [日志]-分页查询
export const fetchLogList = (data: ReqPage) => {
	return http.post(`/sys-log/queryPage`, data)
}

// * [日志]-删除
export const deleteLogById = (sysLogId: number) => {
	return http.get(`/sys-log/deleteById`, { sysLogId })
}

// * [日志]-日志详情查询
export const getLogInfo = (sysLogId: number) => {
	return http.get(`/sys-log/getInfo`, { sysLogId })
}
