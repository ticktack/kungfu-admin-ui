<template>
	<Popup
		v-model="popupVisible"
		width="650px"
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
			<el-form-item label="上级部门" prop="parentName">
				<el-input v-model="popupProps.formData.parentName" disabled />
			</el-form-item>
			<div class="columns-form-item">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model="popupProps.formData.orgName" placeholder="请填写部门名称" clearable />
				</el-form-item>
				<el-form-item label="部门编码" prop="orgCode">
					<el-input v-model="popupProps.formData.orgCode" placeholder="请填写部门编码" clearable />
				</el-form-item>
				<el-form-item label="部门排序" prop="displayNo">
					<el-input-number
						v-model="popupProps.formData.displayNo"
						:min="1"
						:max="1000"
						:step="1"
						:precision="0"
						controls-position="right"
					/>
				</el-form-item>
				<el-form-item label="是否启用" prop="isEnabled">
					<el-radio-group v-model="popupProps.formData.isEnabled">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="负责人姓名">
					<el-input v-model="popupProps.formData.headName" placeholder="请填写负责人姓名" clearable />
				</el-form-item>
				<el-form-item label="负责人手机">
					<el-input v-model="popupProps.formData.headMobile" placeholder="请填写负责人手机" clearable />
				</el-form-item>
				<el-form-item label="负责人邮箱">
					<el-input v-model="popupProps.formData.headEmail" placeholder="请填写负责人邮箱" clearable />
				</el-form-item>
			</div>
			<el-form-item label="描述">
				<el-input v-model="popupProps.formData.remark" placeholder="请填写描述" clearable />
			</el-form-item>
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="OrgPopup">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Org } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

const rules = reactive({
	isEnabled: [{ required: true }],
	displayNo: [{ required: true, message: '请填写字典排序' }],
	orgCode: [{ required: true, message: '请填写部门编码' }],
	orgName: [{ required: true, message: '请填写部门名称' }],
	parentName: [{ required: true }]
})

interface PopupProps {
	act: string
	title: string
	formData: Partial<Org.ResList>
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
