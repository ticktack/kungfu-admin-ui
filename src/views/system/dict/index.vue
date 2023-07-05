<template>
	<MainBox tree-grid :tree-width="270">
		<template #left>
			<TreeFilter
				ref="treeFilterRef"
				label="dictName"
				show-filter
				:show-head-operation="BUTTONS['dict:add']"
				return-all-data
				:data="treeData"
				id="dictCode"
				:defaultValue="currentTreeKey"
				@change="changeTreeFilter"
				@head-confirm="openDictPopup('add')"
			>
				<template #operation="scope">
					<template v-if="scope.node.level == 2">
						<el-link v-auth="'dict:edit'" type="primary" icon="Edit" @click="openDictPopup('edit', scope.node.data)" />
						<el-link
							v-auth="'dict:delete'"
							type="primary"
							icon="Delete"
							style="margin-left: 6px"
							@click="deleteDict(scope.node.data)"
						/>
					</template>
				</template>
			</TreeFilter>

			<DictPopup ref="dictPopupRef" />
		</template>

		<template #right>
			<ProTable
				ref="proTable"
				title="字典数据列表"
				rowKey="id"
				stripe
				:columns="columns"
				:requestApi="fetchDictItemList"
				:requestAuto="false"
				:initParam="initParam"
				:toolButton="false"
				highlight-current-row
			>
				<!-- 表格 header 按钮 -->
				<template #tableHeader v-if="initParam.dictCode">
					<el-button v-auth="'dict:add'" type="primary" icon="CirclePlus" @click="openDictItemPopup('add')">新增</el-button>
				</template>

				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button v-auth="'dict:view'" type="primary" link icon="View" @click="openDictItemPopup('view', scope.row)"
						>查看</el-button
					>
					<el-button v-auth="'dict:edit'" type="primary" link icon="EditPen" @click="openDictItemPopup('edit', scope.row)"
						>编辑</el-button
					>
					<el-button v-auth="'dict:delete'" type="primary" link icon="Delete" @click="deleteDictItem(scope.row)">删除</el-button>
				</template>
			</ProTable>

			<DictItemPopup ref="dictDataPopupRef" />
		</template>
	</MainBox>
</template>

<script setup lang="tsx" name="Dict">
import { onMounted, reactive, ref } from 'vue'
import { pick } from 'lodash'
import { Dict } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import TreeFilter from '@/components/TreeFilter/index.vue'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import DictPopup from './components/DictPopup.vue'
import DictItemPopup from './components/DictItemPopup.vue'

import {
	fetchDictTreeAll,
	saveOrUpdateDict,
	deleteDictByIds,
	fetchDictItemList,
	saveOrUpdateDictItem,
	deleteDictItemByIds
} from '@/api/modules/system'

import { useAuthButtons } from '@/hooks/useAuthButtons'
const { BUTTONS } = useAuthButtons()

onMounted(() => {
	getTreeData()
})

// 获取 ProTable 元素
const proTable = ref()
const currentTreeKey = ref('root')

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
let initParam = reactive<{
	dictCode?: string | undefined
	orderColumnName: string
	orderBy: string
}>({
	dictCode: undefined,
	orderColumnName: 'dictCode,displayNo',
	orderBy: 'asc,asc'
})

// 获取 树 数据
const treeData = ref<any>([])

const getTreeData = async () => {
	let { data } = await fetchDictTreeAll()
	data.dictCode = 'root'
	treeData.value = [data]

	proTable.value.getTableList()

	setTimeout(() => {
		treeFilterRef.value?.treeRef?.setCurrentKey(currentTreeKey.value)

		const filterText = treeFilterRef.value?.filterText
		if (filterText) treeFilterRef.value?.treeRef?.filter(filterText)
	})
}

// 树形筛选切换
const changeTreeFilter = (val: any) => {
	currentTreeKey.value = val.data.dictCode
	if (val.data.dictCode == 'root') {
		initParam.dictCode = undefined
		initParam.orderColumnName = 'dictCode,displayNo'
		initParam.orderBy = 'asc,asc'
		return
	}

	initParam.dictCode = val.data.dictCode
	initParam.orderColumnName = 'displayNo'
	initParam.orderBy = 'asc'
}

// 表格配置项
const columns: ColumnProps<Dict.ResItemList>[] = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'itemKey', label: '数据名称' },
	{ prop: 'itemValue', label: '数据值' },
	{ prop: 'displayNo', label: '排序', width: 100 },
	{ prop: 'remark', label: '备注' },
	{
		prop: 'operation',
		label: '操作',
		width: 300,
		fixed: 'right',
		isShow: BUTTONS.value['dict:view'] || BUTTONS.value['dict:edit'] || BUTTONS.value['dict:delete']
	}
]

// 删除字典
const deleteDict = async (row: Dict.ResList) => {
	await useHandleData(deleteDictByIds, [row.id], `删除【${row.dictName}】字典，字典数据项会同时被删除`)

	if (row.dictCode == initParam.dictCode) {
		currentTreeKey.value = 'root'
		initParam.dictCode = undefined
		initParam.orderColumnName = 'dictCode,displayNo'
		initParam.orderBy = 'asc,asc'
	}
	getTreeData()
}

// 删除字典数据项
const deleteDictItem = async (row: Dict.ResItemList) => {
	await useHandleData(deleteDictItemByIds, [row.id], `删除【${row.itemKey}】字典数据项`)

	proTable.value.getTableList()
}

// 打开字典弹窗(新增、查看、编辑)
const dictPopupRef = ref<InstanceType<typeof DictPopup> | null>(null)
const treeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null)
const openDictPopup = (act: string, row: Partial<Dict.ResList> = {}) => {
	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}字典`,
		formData:
			act == 'add'
				? { isEnabled: true, displayNo: 1 }
				: pick(row, ['id', 'dictCode', 'dictName', 'isEnabled', 'displayNo', 'remark']),
		api: saveOrUpdateDict,
		refreshData: getTreeData
	}
	dictPopupRef.value?.acceptParams(params)
}

// 打开字典数据弹窗(新增、查看、编辑)
const dictDataPopupRef = ref<InstanceType<typeof DictItemPopup> | null>(null)
const openDictItemPopup = (act: string, row: Partial<Dict.ResItemList> = {}) => {
	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}字典数据`,
		formData:
			act == 'add'
				? {
						dictCode: initParam.dictCode,
						displayNo: 1,
						remark: `字典编号：${initParam.dictCode}`
				  }
				: pick(row, ['id', 'dictCode', 'itemKey', 'itemValue', 'displayNo', 'remark']),
		api: saveOrUpdateDictItem,
		refreshData: proTable.value.getTableList
	}
	dictDataPopupRef.value?.acceptParams(params)
}
</script>
