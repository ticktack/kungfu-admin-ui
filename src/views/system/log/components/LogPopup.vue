<template>
	<Popup
		v-model="popupVisible"
		width="550px"
		:destroy-on-close="true"
		:title="`${popupProps.title}`"
		:show-confirm-btn="popupProps.act != 'view'"
		:show-cancel-btn="popupProps.act != 'view'"
	>
		<el-form
			ref="ruleFormRef"
			label-width="auto"
			label-suffix=":"
			:disabled="popupProps.act == 'view'"
			:model="popupProps.formData"
			:hide-required-asterisk="popupProps.act == 'view'"
		>
			<el-form-item label="请求地址" prop="apiUrl">
				<el-input v-model="popupProps.formData.apiUrl" placeholder="" clearable />
			</el-form-item>

			<el-form-item label="行为用户" prop="visitor">
				<el-input v-model="popupProps.formData.visitor" clearable />
			</el-form-item>

			<el-form-item label="行为时间" prop="createTime">
				<el-input v-model="popupProps.formData.createTime" clearable />
			</el-form-item>

			<el-form-item label="行为备注" prop="remark">
				<el-input v-model="popupProps.formData.remark" clearable />
			</el-form-item>

			<!--TODO apiParam 用json方式高亮显示-->

			<!--TODO apiResult 用json方式高亮显示-->
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="DictPopup">
import { ref } from 'vue'
import { Log } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

interface PopupProps {
	act: string
	title: string
	formData: Partial<Log.ResList>
	api?: (params: any) => Promise<any>
	refreshData?: () => void
}

const popupVisible = ref(false)
const popupProps = ref<PopupProps>({
	act: 'view',
	title: '',
	formData: {}
})

// 接收父组件传过来的参数
const acceptParams = (params: PopupProps) => {
	popupProps.value = params
	popupVisible.value = true
}

defineExpose({
	acceptParams
})
</script>
