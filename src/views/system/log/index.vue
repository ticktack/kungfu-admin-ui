<template>
	<MainBox>
		<div class="table-box">
			<ProTable
				ref="proTable"
				title="日志列表"
				rowKey="id"
				stripe
				:columns="columns"
				:requestApi="fetchLogList"
				:requestAuto="true"
				:initParam="initParam"
				:toolButton="false"
				highlight-current-row
			>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button type="primary" link icon="View" @click="openLogPopup('view', scope.row)">查看详情</el-button>
					<el-button type="primary" link icon="Delete" @click="deleteLog(scope.row)">删除</el-button>
				</template>
			</ProTable>
		</div>

		<LogPopup ref="logPopupRef" :enum-map="null" />
	</MainBox>
</template>

<script setup lang="tsx" name="User">
import { reactive, ref } from 'vue'
import { Log } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import LogPopup from './components/LogPopup.vue'
import { fetchLogList, deleteLogById, getLogInfo } from '@/api/modules/system'

// 获取 ProTable 元素
const proTable = ref()

// 表格的初始化请求参数，改变此参数会自动刷新表格数据
const initParam = reactive({})

// 表格配置项
const columns: ColumnProps<Log.ResList>[] = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'visitor', label: '请求用户' },
	{ prop: 'apiUrl', label: '请求地址', search: { el: 'input' } },
	{ prop: 'apiType', label: '请求方式', search: { el: 'input' } },
	{ prop: 'apiCost', label: '请求耗时(ms)' },
	{ prop: 'visitIp', label: '请求IP' },
	{ prop: 'address', label: '请求地区' },
	{ prop: 'remark', label: '行为备注' },
	{ prop: 'createTime', label: '创建时间' },
	{ prop: 'operation', label: '操作', width: 200, fixed: 'right' }
]

// 删除日志
const deleteLog = async (row: Log.ResList) => {
	await useHandleData(deleteLogById, row.id, `删除本条日志`)

	proTable.value.getTableList()
}

// 打开日志详情弹窗
const logPopupRef = ref<InstanceType<typeof LogPopup> | null>(null)
const openLogPopup = async (act: string, row: Log.ResList) => {
	let { data } = await getLogInfo(row.id)
	const params = {
		act,
		title: `查看日志详情`,
		formData: data
	}
	logPopupRef.value?.acceptParams(params)
}
</script>
