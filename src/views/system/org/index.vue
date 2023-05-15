<template>
	<MainBox tree-grid :tree-width="270">
		<template #left>
			<TreeFilter
				ref="treeFilterRef"
				label="orgName"
				show-filter
				show-head-operation
				return-all-data
				:data="treeData"
				id="orgCode"
				:defaultValue="initParam.orgCode"
				@change="changeTreeFilter"
				@head-confirm="openOrgPopup('add', treeData[0])"
			>
				<template #operation="scope">
					<el-link type="primary" icon="DocumentAdd" @click="openOrgPopup('add', scope.node.data)" />
					<template v-if="scope.node.level != 1">
						<el-link type="primary" icon="Edit" style="margin-left: 6px" @click="openOrgPopup('edit', scope.node.data)" />
						<el-link type="primary" icon="Delete" style="margin-left: 6px" @click="deleteOrg(scope.node.data)" />
					</template>
				</template>
			</TreeFilter>

			<OrgPopup ref="orgPopupRef" />
		</template>

		<template #right>
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
			/>
		</template>
	</MainBox>
</template>

<script setup lang="tsx" name="Org">
import { onMounted, reactive, ref } from 'vue'
import { pick } from 'lodash'
import { Org, User } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import TreeFilter from '@/components/TreeFilter/index.vue'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import OrgPopup from './components/OrgPopup.vue'
import { fetchOrgTreeAll, saveOrUpdateOrg, deleteOrgByIds, fetchUserList, getDictInfo } from '@/api/modules/system'

onMounted(() => {
	getTreeData()
})

// 获取 ProTable 元素
const proTable = ref()

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
let initParam = reactive<{
	orgCode?: string | undefined
}>({
	orgCode: 'root'
})

// 获取 树 数据
const treeData = ref<any>([])

const getTreeData = async () => {
	let { data } = await fetchOrgTreeAll()

	treeData.value = [data]
}

// // 树形筛选切换
const changeTreeFilter = (val: any) => {
	initParam.orgCode = val.data.orgCode
}

// 表格配置项
const columns: ColumnProps<User.ResList>[] = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'userCode', label: '登陆账号', search: { el: 'input' } },
	{ prop: 'userName', label: '用户姓名', search: { el: 'input' } },
	{
		prop: 'sex',
		label: '性别',
		width: 80,
		enum: () => getDictInfo('sex'),
		search: { el: 'select', props: { filterable: true } },
		fieldNames: { label: 'text', value: 'value' }
	},
	{ prop: 'mobile', label: '手机号' },
	{ prop: 'email', label: '邮箱' },
	{
		prop: 'allowLogin',
		label: '允许登录',
		width: 100,
		render: (scope: any) => {
			return <el-tag type={scope.row.allowLogin ? '' : 'danger'}>{scope.row.allowLogin ? '允许' : '禁止'}</el-tag>
		}
	}
]

// 删除部门
const deleteOrg = async (row: Org.ResList) => {
	await useHandleData(deleteOrgByIds, [row.id], `删除【${row.orgName}】部门`)

	if (row.orgCode == initParam.orgCode) {
		initParam.orgCode = 'root'
	}
	getTreeData()
}

// 打开弹窗(新增、查看、编辑)
const orgPopupRef = ref<InstanceType<typeof OrgPopup> | null>(null)
const openOrgPopup = (act: string, row: Partial<Org.ResList> = {}) => {
	const params = {
		act,
		title: `${act == 'add' ? '新增' : act == 'edit' ? '编辑' : '查看'}部门`,
		formData:
			act == 'add'
				? { isEnabled: true, displayNo: 1, parentCode: row.orgCode, parentName: row.orgName }
				: pick(row, [
						'id',
						'orgCode',
						'orgName',
						'parentCode',
						'parentName',
						'headName',
						'headMobile',
						'headEmail',
						'isEnabled',
						'displayNo',
						'remark'
				  ]),
		api: saveOrUpdateOrg,
		refreshData: getTreeData
	}
	orgPopupRef.value?.acceptParams(params)
}
</script>
