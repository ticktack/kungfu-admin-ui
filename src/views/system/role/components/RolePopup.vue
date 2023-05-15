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
			<el-form-item label="上级角色" prop="parentName">
				<el-input v-model="popupProps.formData.parentName" disabled />
			</el-form-item>

			<div class="columns-form-item">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="popupProps.formData.roleName" placeholder="请填写角色名称" clearable />
				</el-form-item>
				<el-form-item label="角色编码" prop="roleCode">
					<el-input v-model="popupProps.formData.roleCode" placeholder="请填写角色编码" clearable />
				</el-form-item>
				<el-form-item label="角色排序" prop="displayNo">
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
			</div>
			<el-form-item label="描述">
				<el-input v-model="popupProps.formData.remark" placeholder="请填写描述" clearable />
			</el-form-item>
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="RolePopup">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Role } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

const rules = reactive({
	isEnabled: [{ required: true }],
	displayNo: [{ required: true, message: '请填写字典排序' }],
	roleCode: [{ required: true, message: '请填写角色编码' }],
	roleName: [{ required: true, message: '请填写角色名称' }],
	parentName: [{ required: true }]
})

interface PopupProps {
	act: string
	title: string
	formData: Partial<Role.ResList>
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
