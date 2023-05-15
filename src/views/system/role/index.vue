<template>
	<MainBox tree-grid :tree-width="270">
		<template #left>
			<TreeFilter
				ref="treeFilterRef"
				label="roleName"
				show-filter
				show-head-operation
				return-all-data
				:data="treeData"
				id="roleCode"
				:defaultValue="initParam.roleCode"
				@change="changeTreeFilter"
				@head-confirm="openRolePopup('add', treeData[0])"
			>
				<template #operation="scope">
					<el-link type="primary" icon="DocumentAdd" @click="openRolePopup('add', scope.node.data)" />
					<template v-if="scope.node.level != 1">
						<el-link type="primary" icon="Edit" style="margin-left: 6px" @click="openRolePopup('edit', scope.node.data)" />
						<el-link type="primary" icon="Delete" style="margin-left: 6px" @click="deleteRole(scope.node.data)" />
					</template>
				</template>
			</TreeFilter>

			<RolePopup ref="rolePopupRef" />
		</template>

		<template #right>
			<div class="card" style="height: 100%">
				<!-- <div style="width: 400px"> -->
				<div class="card-title" style="margin-bottom: 16px">角色菜单权限</div>
				<TreeFilter
					:key="initParam.roleCode"
					ref="menuTreeFilterRef"
					:multiple="initParam.roleCode != 'root'"
					label="menuName"
					show-filter
					:data="menuTreeData"
					id="menuCode"
					:show-head-operation="initParam.roleCode != 'root'"
					head-operation-text="保存"
					@head-confirm="saveRoleMenus"
				/>
				<!-- </div> -->
			</div>
		</template>
	</MainBox>
</template>

<script setup lang="tsx" name="Role">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { pick } from 'lodash'
import { Role } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import TreeFilter from '@/components/TreeFilter/index.vue'
import RolePopup from './components/RolePopup.vue'
import {
	fetchRoleTreeAll,
	saveOrUpdateRole,
	deleteRoleByIds,
	fetchMenuTreeAll,
	getRoleMenuCodes,
	saveRoleMenu
	/*fetchRoleMenuTree*/
} from '@/api/modules/system'

onMounted(() => {
	getTreeData()

	getMenuTree()
})

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
let initParam = reactive<{
	roleCode: string
}>({
	roleCode: 'root'
})

// 获取 树 数据
const treeData = ref<any>([])
const menuTreeData = ref<any>([])

const getTreeData = async () => {
	let { data } = await fetchRoleTreeAll()
	treeData.value = [data]
}

const getMenuTree = async () => {
	const { data } = await fetchMenuTreeAll()
	menuTreeData.value = [data]
}

// 树形筛选切换
const changeTreeFilter = (val: any) => {
	initParam.roleCode = val.data.roleCode
}

const menuTreeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null)

watch(
	() => initParam.roleCode,
	async () => {
		// fetchRoleMenuTree(initParam.roleCode)
		const { data } = await getRoleMenuCodes(initParam.roleCode)
		const roleMenuCodes = data.menuCodes ? data.menuCodes.split(',') : []

		setTimeout(() => {
			// menuTreeFilterRef.value?.treeRef?.setCheckedKeys(roleMenuCodes)
			roleMenuCodes.forEach((code: string) => {
				const data: any = menuTreeFilterRef.value?.treeRef?.getNode(code).data
				if (!data.children || !data.children.length) {
					menuTreeFilterRef.value?.treeRef?.setChecked(code, true, false)
				}
			})
		})
	}
)

// 保存角色菜单
const saveRoleMenus = async () => {
	const roleMenuCodes1 = menuTreeFilterRef.value?.treeRef?.getCheckedKeys() || []
	const roleMenuCodes2 = menuTreeFilterRef.value?.treeRef?.getHalfCheckedKeys() || []
	const roleMenuCodes = roleMenuCodes1?.concat(roleMenuCodes2)

	let menuCodes: any = roleMenuCodes.join()
	try {
		let res = await saveRoleMenu({ roleCode: initParam.roleCode, menuCodes })
		ElMessage.success({ message: `${res.msg}` })
	} catch (error) {
		console.log(error)
	}
}

// 删除角色
const deleteRole = async (row: Role.ResList) => {
	await useHandleData(deleteRoleByIds, [row.id], `删除【${row.roleName}】部门`)
	if (row.roleCode == initParam.roleCode) {
		initParam.roleCode = 'root'
	}
	getTreeData()
}

// 打开弹窗(新增、查看、编辑)
const rolePopupRef = ref<InstanceType<typeof RolePopup> | null>(null)
const openRolePopup = (act: string, row: Partial<Role.ResList> = {}) => {
	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}角色`,
		formData:
			act == 'add'
				? { isEnabled: true, displayNo: 1, parentCode: row.roleCode, parentName: row.roleName }
				: pick(row, ['id', 'roleCode', 'roleName', 'parentCode', 'parentName', 'isEnabled', 'displayNo', 'remark']),
		api: saveOrUpdateRole,
		refreshData: getTreeData
	}
	rolePopupRef.value?.acceptParams(params)
}
</script>
