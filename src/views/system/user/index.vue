<template>
	<MainBox>
		<div class="table-box">
			<ProTable
				ref="proTable"
				title="用户列表"
				rowKey="id"
				stripe
				:columns="columns"
				:requestApi="fetchUserList"
				:requestAuto="true"
				:initParam="initParam"
				:toolButton="false"
				highlight-current-row
				@enum-done="enumDone"
			>
				<!-- 表格 header 按钮 -->
				<template #tableHeader>
					<el-button v-auth="'user:add'" type="primary" icon="CirclePlus" @click="openUserPopup('add')">新增</el-button>
				</template>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button v-auth="'user:edit'" type="primary" link icon="View" @click="openUserPopup('edit', scope.row)"
						>编辑</el-button
					>
					<el-button v-auth="'user:addRole'" type="primary" link icon="EditPen" @click="openUserRolePopup(scope.row)"
						>角色</el-button
					>
					<el-button v-auth="'user:resetPassword'" type="primary" link icon="Lock" @click="resetUserPwd(scope.row)"
						>重置密码</el-button
					>
					<el-button v-auth="'user:delete'" type="primary" link icon="Delete" @click="deleteUser(scope.row)">删除</el-button>
				</template>
			</ProTable>
		</div>
		<UserPopup ref="userPopupRef" :enum-map="enumMap" />

		<UserRolePopup ref="userRolePopupRef" :enum-map="enumMap" />
	</MainBox>
</template>

<script setup lang="tsx" name="User">
import { onMounted, reactive, ref } from 'vue'
import { pick } from 'lodash'
import { ElMessage } from 'element-plus'
import { User } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import UserPopup from './components/UserPopup.vue'
import UserRolePopup from './components/UserRolePopup.vue'
import {
	fetchUserList,
	getDictInfo,
	deleteUserByIds,
	setUserAllowLoginStatus,
	saveOrUpdateUser,
	fetchOrgTreeAll,
	resetUserPwdByIds,
	fetchRoleTreeAll,
	saveUserRole,
	getUserRoleCodes
} from '@/api/modules/system'

import { useAuthButtons } from '@/hooks/useAuthButtons'
const { BUTTONS } = useAuthButtons()

onMounted(() => {
	getRoleTree()
})

// 字典
const enumMap = ref<any>({})
const enumDone = (e: any) => {
	enumMap.value.sexDict = e.get('sex')
	enumMap.value.orgTreeData = [e.get('orgCode')]
}

const getRoleTree = async () => {
	const { data } = await fetchRoleTreeAll()
	enumMap.value.roleTreeData = [data]
}

// 获取 ProTable 元素
const proTable = ref()

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
const initParam = reactive({})

// 表格配置项
const columns: ColumnProps<User.ResList>[] = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'userCode', label: '登陆账号', search: { el: 'input' } },
	{ prop: 'userName', label: '用户名', search: { el: 'input' } },
	{
		prop: 'orgCode',
		label: '所属部门',
		isShow: false,
		enum: () => fetchOrgTreeAll(),
		search: {
			el: 'tree-select',
			formatterData: (data: any) => {
				data.disabled = true
				return [data]
			},
			props: {
				'check-strictly': true,
				'highlight-current': true,
				'default-expand-all': true,
				'expand-on-click-node': false,
				'check-on-click-node': false
			}
		},
		fieldNames: { label: 'orgName', value: 'orgCode' }
	},
	{
		prop: 'orgName',
		label: '所属部门'
	},
	{
		prop: 'sex',
		label: '性别',
		width: 80,
		enum: () => getDictInfo('sex'),
		search: { el: 'select', props: { label: 'text', value: 'value' } },
		fieldNames: { label: 'text', value: 'value' }
	},
	{ prop: 'mobile', label: '手机号' },
	{ prop: 'email', label: '邮箱' },
	{
		prop: 'allowLogin',
		label: '允许登录',
		width: 140,
		render: (scope: any) => {
			return BUTTONS.value['user:loginAllow'] ? (
				<el-switch
					model-value={scope.row.allowLogin}
					active-text={scope.row.allowLogin ? '允许' : '禁止 '}
					onClick={() => changeAllowLogin(scope.row)}
				/>
			) : (
				<span>{scope.row.allowLogin ? '允许' : '禁止'}</span>
			)
		}
	},
	{
		prop: 'operation',
		label: '操作',
		width: 330,
		fixed: 'right',
		isShow:
			BUTTONS.value['user:edit'] ||
			BUTTONS.value['user:addRole'] ||
			BUTTONS.value['user:resetPassword'] ||
			BUTTONS.value['user:delete']
	}
]

// 切换允许登录状态
const changeAllowLogin = async (row: User.ResList) => {
	const { code, msg } = await setUserAllowLoginStatus({ userId: row.id, isAllowLogin: !row.allowLogin })
	if (code == 200) {
		ElMessage.success(`${msg}`)
		proTable.value.getTableList()
	}
}

// 删除用户
const deleteUser = async (row: User.ResList) => {
	await useHandleData(deleteUserByIds, [row.id], `删除【${row.userName}】用户`)

	proTable.value.getTableList()
}

// 重置用户密码
const resetUserPwd = async (row: User.ResList) => {
	await useHandleData(resetUserPwdByIds, [row.id], `重置【${row.userName}】用户密码`)

	// proTable.value.getTableList()
}

// 打开弹窗(新增、查看、编辑)
const userPopupRef = ref<InstanceType<typeof UserPopup> | null>(null)
const openUserPopup = (act: string, row: Partial<User.ResList> = {}) => {
	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}用户`,
		formData:
			act == 'add'
				? { allowLogin: true }
				: pick(row, ['id', 'userName', 'mobile', 'userCode', 'password', 'orgCode', 'sex', 'email', 'address', 'allowLogin']),
		api: saveOrUpdateUser,
		refreshData: proTable.value.getTableList
	}
	userPopupRef.value?.acceptParams(params)
}

// 打开角色弹窗
const userRolePopupRef = ref<InstanceType<typeof UserRolePopup> | null>(null)
const openUserRolePopup = async (row: User.ResList) => {
	const { data } = await getUserRoleCodes(row.userCode)

	const userRoleCodes = data.roleCodes ? data.roleCodes.split(',') : []

	setTimeout(() => {
		console.log(userRolePopupRef.value?.treeFilterRef)
		userRolePopupRef.value?.treeFilterRef?.treeRef?.setCheckedKeys(userRoleCodes)
	})

	const params = {
		title: `编辑角色`,
		formData: { userCode: row.userCode },
		api: saveUserRole
	}
	userRolePopupRef.value?.acceptParams(params)
}
</script>
