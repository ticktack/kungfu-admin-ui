<template>
	<Popup
		v-model="popupVisible"
		width="550px"
		:destroy-on-close="true"
		:title="`${popupProps.title}`"
		@confirm="handleConfirm"
		:show-confirm-btn="popupProps.act != 'view'"
		:show-cancel-btn="popupProps.act != 'view'"
	>
		<el-form
			ref="ruleFormRef"
			label-width="auto"
			label-suffix=":"
			:rules="rules"
			:disabled="popupProps.act == 'view'"
			:model="popupProps.formData"
			:hide-required-asterisk="popupProps.act == 'view'"
		>
			<el-form-item label="数据名称" prop="itemKey">
				<el-input v-model="popupProps.formData.itemKey" placeholder="请填写数据名称" clearable />
			</el-form-item>
			<el-form-item label="数据值" prop="itemValue">
				<el-input
					v-model="popupProps.formData.itemValue"
					:disabled="popupProps.act != 'add'"
					placeholder="请填写数据值"
					clearable
				/>
			</el-form-item>

			<el-form-item label="字典排序" prop="displayNo">
				<el-input-number
					v-model="popupProps.formData.displayNo"
					:min="1"
					:max="1000"
					:step="1"
					:precision="0"
					controls-position="right"
				/> </el-form-item
			><el-form-item label="备注" prop="remark">
				<el-input v-model="popupProps.formData.remark" clearable />
			</el-form-item>
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="DictPopup">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dict } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

const rules = reactive({
	displayNo: [{ required: true, message: '请填写字典排序' }],
	itemValue: [{ required: true, message: '请填写数据值' }],
	itemKey: [{ required: true, message: '请填写数据名称' }]
})

interface PopupProps {
	act: string
	title: string
	formData: Partial<Dict.ResItemList>
	api?: (params: any) => Promise<any>
	refreshData?: () => void
}

const popupVisible = ref(false)
const popupProps = ref<PopupProps>({
	act: 'add',
	title: '',
	formData: {}
})

// 接收父组件传过来的参数
const acceptParams = (params: PopupProps) => {
	popupProps.value = params
	popupVisible.value = true
}

// 提交
const ruleFormRef = ref<FormInstance>()
const handleConfirm = () => {
	if (popupProps.value.act == 'view') return (popupVisible.value = false)

	ruleFormRef.value!.validate(async valid => {
		if (!valid) return
		try {
			let res = await popupProps.value.api!(popupProps.value.formData)
			ElMessage.success({ message: `${res.msg}` })
			popupProps.value.refreshData!()
			popupVisible.value = false
		} catch (error) {
			console.log(error)
		}
	})
}

defineExpose({
	acceptParams
})
</script>
