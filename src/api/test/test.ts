export const category = '系统菜单接口'
const baseUrl = '/sys-menu'

/**
 * @name 系统管理模块
 */
export default [
	{
		name: '获取菜单树',
		method: 'fetchMenuTreeAll',
		url: `${baseUrl}/tree`,
		type: 'get'
	}
]
