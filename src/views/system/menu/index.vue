<template>
	<MainBox tree-grid :tree-width="280">
		<template #left>
			<TreeFilter
				ref="treeFilterRef"
				label="menuName"
				show-filter
				:show-head-operation="BUTTONS['menu:add']"
				:data="treeData"
				id="menuCode"
				:defaultValue="initParam.menuCode"
				head-operation-text="新增"
				@change="changeTreeFilter"
				@head-confirm="openMenuPopup('add', treeData[0])"
			>
				<template #icon="scope">
					<template v-if="scope.node.level != 1">
						<component :is="scope.node.data.icon == 'Menu' ? MenuIcon : scope.node.data.icon"></component>
					</template>
				</template>

				<template #operation="scope">
					<el-link v-auth="'menu:add'" type="primary" icon="DocumentAdd" @click="openMenuPopup('add', scope.node.data)" />
					<template v-if="scope.node.level != 1">
						<el-link
							v-auth="'menu:edit'"
							type="primary"
							icon="Edit"
							style="margin-left: 6px"
							@click="openMenuPopup('edit', scope.node.data)"
						/>
						<el-link
							v-auth="'menu:delete'"
							type="primary"
							icon="Delete"
							style="margin-left: 6px"
							@click="deleteMenu(scope.node.data)"
						/>
					</template>
				</template>
			</TreeFilter>
		</template>

		<template #right>
			<ProTable
				ref="proTable"
				title="菜单列表"
				rowKey="id"
				stripe
				:columns="columns"
				:requestApi="fetchMenuList"
				:requestAuto="false"
				:initParam="initParam"
				:toolButton="false"
				highlight-current-row
			>
				<!-- 表格 header 按钮 -->
				<template #tableHeader v-if="isLastNode">
					<el-button v-auth="'menu:add'" type="primary" icon="CirclePlus" @click="openMenuPopup('add')">新增按钮</el-button>
				</template>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button v-auth="'menu:view'" type="primary" link icon="View" @click="openMenuPopup('view', scope.row)"
						>查看</el-button
					>
					<el-button v-auth="'menu:edit'" type="primary" link icon="EditPen" @click="openMenuPopup('edit', scope.row)"
						>编辑</el-button
					>
					<el-button v-auth="'menu:delete'" type="primary" link icon="Delete" @click="deleteMenu(scope.row)">删除</el-button>
				</template>
			</ProTable>

			<MenuPopup ref="menuPopupRef" :enum-map="{ ...enumMap, treeData }" />
		</template>
	</MainBox>
</template>

<script setup lang="tsx" name="Menu">
import { onMounted, reactive, ref } from 'vue'
import { pick } from 'lodash'
import { ElMessage } from 'element-plus'
import { Menu } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import TreeFilter from '@/components/TreeFilter/index.vue'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import MenuPopup from './components/MenuPopup.vue'
import { Menu as MenuIcon } from '@element-plus/icons-vue'

import {
	fetchMenuTreeAll,
	fetchMenuList,
	setMenuStatus,
	deleteMenuById,
	saveOrUpdateMenu,
	getDictInfo
} from '@/api/modules/system'

import { useAuthButtons } from '@/hooks/useAuthButtons'
const { BUTTONS } = useAuthButtons()

onMounted(async () => {
	getTreeData()

	enumMap.value.authButtonDict = (await getDictInfo('auth_button'))['data']
})

// 字典
const enumMap = ref<any>({})
// const enumDone = (e: any) => {
// 	enumMap.value.authButtonDict = e.get('menuName')
// }

// 获取 ProTable 元素
const proTable = ref()

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
const initParam = reactive({ menuCode: '', orderColumnName: 'displayNo', orderBy: 'asc', menuType: 1 })

// 获取 菜单树 数据
const treeData = ref<any>([])
const treeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null)
const getTreeData = async () => {
	let { data } = await fetchMenuTreeAll({ menuType: 0 })
	treeData.value = [data]

	if (!initParam.menuCode) initParam.menuCode = treeData.value[0].menuCode

	proTable.value.getTableList()
	setTimeout(() => {
		treeFilterRef.value?.treeRef?.setCurrentKey(initParam.menuCode)

		const filterText = treeFilterRef.value?.filterText
		if (filterText) treeFilterRef.value?.treeRef?.filter(filterText)
	})
}

// 树形筛选切换
let isLastNode = ref<boolean>(false)
const changeTreeFilter = (val: string) => {
	proTable.value.pageable.pageNumber = 1
	initParam.menuCode = val

	const currentNode: any = treeFilterRef.value?.treeRef?.getCurrentNode()
	isLastNode.value = !currentNode.children || !currentNode.children.length
}

// 表格配置项
const columns: ColumnProps<Menu.ResList>[] = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'parentName', label: '上级菜单' },
	{
		prop: 'menuName',
		label: '按钮名称'
		// enum: () => getDictInfo('auth_button'),
		// fieldNames: { label: 'text', value: 'value' }
	},
	{ prop: 'menuCode', label: '按钮编号' },
	{ prop: 'displayNo', label: '排序', width: 100 },
	{
		prop: 'status',
		label: '启用状态',
		render: (scope: any) => {
			return (
				<el-switch
					model-value={scope.row.isEnabled}
					active-text={scope.row.isEnabled ? '启用' : '禁用'}
					onClick={() => changeStatus(scope.row)}
				/>
			)
		}
	},
	{
		prop: 'operation',
		label: '操作',
		width: 250,
		fixed: 'right',
		isShow: BUTTONS.value['menu:view'] || BUTTONS.value['menu:edit'] || BUTTONS.value['menu:delete']
	}
]

// 设置菜单状态
const changeStatus = async (row: Menu.ResList) => {
	const { code } = await setMenuStatus({ menuId: row.id, isEnabled: !row.isEnabled })
	if (code == 200) {
		ElMessage.success('更新成功')
		proTable.value.getTableList()
	}
}

// 删除菜单
const deleteMenu = async (row: Menu.ResList) => {
	await useHandleData(deleteMenuById, row.id, `删除【${row.menuName}】菜单`)
	if (row.menuType === 0) {
		getTreeData()
	} else proTable.value.getTableList()
}

// 打开弹窗(新增、查看、编辑)
const menuPopupRef = ref<InstanceType<typeof MenuPopup> | null>(null)
const openMenuPopup = (act: string, row: Partial<Menu.ResList> = {}) => {
	const currentTreeData: any = treeFilterRef.value?.treeRef?.getCurrentNode()
	const defaultType = row.menuCode == 'root' ? 0 : row.menuType ?? 1

	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}${defaultType === 0 ? '菜单' : '按钮'}`,
		formData:
			act == 'add'
				? {
						isEnabled: true,
						displayNo: 1,
						parentName: row.menuName ? row.menuName : currentTreeData.menuName,
						parentCode: row.menuCode ? row.menuCode : currentTreeData.menuCode,
						icon: defaultType === 0 ? 'Menu' : 'Mouse',
						menuType: defaultType
				  }
				: pick(row, ['id', 'parentCode', 'parentName', 'menuCode', 'menuName', 'isEnabled', 'displayNo', 'icon', 'menuType']),
		api: saveOrUpdateMenu,
		refreshData: defaultType === 0 ? getTreeData : proTable.value.getTableList
	}
	menuPopupRef.value?.acceptParams(params)
}
</script>
