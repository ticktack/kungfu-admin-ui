<template>
	<div class="filter-header" v-if="showHeadOperation || showFilter">
		<el-button type="primary" v-if="showHeadOperation" @click="handleHeadConfirm">{{ headOperationText }}</el-button>
		<el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable v-if="showFilter" />
	</div>

	<el-scrollbar
		:style="{ height: `calc(100% - ${showHeadOperation || showFilter ? 'var(--el-input-inner-height) - 15px' : '0px'})` }"
	>
		<el-tree
			ref="treeRef"
			default-expand-all
			:node-key="id"
			:data="treeData"
			:show-checkbox="multiple"
			v-bind="$attrs"
			:current-node-key="!multiple ? selected : ''"
			:highlight-current="!multiple"
			:expand-on-click-node="false"
			:check-on-click-node="multiple"
			:props="defaultProps"
			:filter-node-method="filterNode"
			:default-checked-keys="multiple ? selected : []"
			@node-click="handleNodeClick"
			@check="handleCheckChange"
		>
			<template #default="{ node }">
				<span
					class="custom-tree-node"
					:class="['el-tree-node__label', `label-level-${node.level}`, { 'is-leaf-label': node.isLeaf }]"
				>
					<div class="icon">
						<slot name="icon" :node="node"></slot>
					</div>

					<div class="tree-title">{{ node.label }}</div>

					<div class="operation" v-if="$slots.operation" @click.stop>
						<slot name="operation" :node="node"></slot>
					</div>
				</span>
			</template>
		</el-tree>
	</el-scrollbar>
</template>

<script setup lang="ts" name="MenuTree">
import { ref, watch, onBeforeMount, nextTick } from 'vue'
import { ElTree } from 'element-plus'

// 接收父组件参数并设置默认值
interface TreeFilterProps {
	requestApi?: (data?: any) => Promise<any> // 请求分类数据的 api ==> 非必传
	data?: { [key: string]: any }[] // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
	title?: string // treeFilter 标题 ==> 非必传
	id?: string // 选择的id ==> 非必传，默认为 “id”
	label?: string // 显示的label ==> 非必传，默认为 “label”
	defaultValue?: any // 默认选中的值 ==> 非必传
	multiple?: boolean // 是否为多选 ==> 非必传，默认为 false
	showFilter?: boolean // 是否开启搜索 ==> 非必传，默认为 false
	showHeadOperation?: boolean // 是否显示顶部操作按钮 ==> 非必传，默认为 false
	headOperationText?: string // 顶部操作按钮文字 ==> 非必传，默认为 ‘新建’
	returnAllData?: boolean
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
	id: 'id',
	label: 'label',
	multiple: false,
	showFilter: false,
	showHeadOperation: false,
	headOperationText: '新建',
	returnAllData: false
})

const defaultProps = {
	children: 'children',
	label: props.label
}

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<{ [key: string]: any }[]>([])

const selected = ref()
const setSelected = () => {
	selected.value = props.defaultValue
	// selected.value = typeof props.defaultValue === 'string' ? props.defaultValue : ''
}

onBeforeMount(async () => {
	setSelected()
	if (props.requestApi) {
		const { data } = await props.requestApi!()
		treeData.value = data
	}
})

// 使用 nextTick 防止打包后赋值不生效
watch(
	() => props.defaultValue,
	() => nextTick(() => setSelected()),
	{ deep: true, immediate: true }
)

watch(
	() => props.data,
	() => {
		if (props.data?.length) {
			treeData.value = props.data
		}
	},
	{ deep: true, immediate: true }
)

const filterText = ref('')
watch(filterText, val => {
	treeRef.value!.filter(val)
})

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
	if (!value) return true
	let parentNode = node.parent,
		labels = [node.label],
		level = 1
	while (level < node.level) {
		labels = [...labels, parentNode.label]
		parentNode = parentNode.parent
		level++
	}
	return labels.some(label => label.indexOf(value) !== -1)
}

interface EmitProps {
	(e: 'change', value: any): void
	(e: 'head-confirm'): void
}
const emit = defineEmits<EmitProps>()

const handleHeadConfirm = () => {
	emit('head-confirm')
}

// 单选
const handleNodeClick = (data: { [key: string]: any }, node: any) => {
	emit('change', props.returnAllData ? node : data[props.id])
}

// 多选
const handleCheckChange = () => {
	emit('change', treeRef.value?.getCheckedKeys())
}

defineExpose({ treeData, treeRef, filterText })
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
