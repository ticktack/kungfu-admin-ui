<template>
	<Popup
		v-model="popupVisible"
		width="670px"
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
			<div class="columns-form-item">
				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model="popupProps.formData.userName" placeholder="请填写用户姓名" clearable />
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="popupProps.formData.mobile" placeholder="请填写手机号" clearable />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="popupProps.formData.password" placeholder="不填，默认为手机后六位" clearable />
				</el-form-item>
				<el-form-item label="登陆账号" prop="userCode">
					<el-input
						v-model="popupProps.formData.userCode"
						:value="popupProps.formData.mobile"
						placeholder="同手机号"
						clearable
						disabled
					/>
				</el-form-item>
				<el-form-item label="所属部门" prop="orgCode">
					<el-tree-select
						v-model="popupProps.formData.orgCode"
						placeholder="请选所属部门"
						:data="enumMap.orgTreeData"
						node-key="orgCode"
						check-strictly
						:render-after-expand="false"
						:default-expanded-keys="[enumMap.orgTreeData[0].orgCode]"
						:props="{ label: 'orgName' }"
						@node-click="handleTreeNodeClick"
					/>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="popupProps.formData.sex" placeholder="请选择性别">
						<el-option v-for="i in enumMap.sexDict" :key="i.value" :label="i.text" :value="Number(i.value)" />
					</el-select>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="popupProps.formData.email" placeholder="请填写邮箱" clearable />
				</el-form-item>
				<el-form-item label="允许登录" prop="allowLogin">
					<el-radio-group v-model="popupProps.formData.allowLogin">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
			<el-form-item label="地址">
				<el-input v-model="popupProps.formData.address" placeholder="请填写地址" clearable />
			</el-form-item>
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="UserPopup">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { User } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

const rules = reactive({
	allowLogin: [{ required: true }],
	userName: [{ required: true, message: '请填写用户姓名' }],
	mobile: [{ required: true, message: '请填写手机号' }],
	userCode: [{ required: true, message: '请填写用户编号' }],
	email: [{ required: true, message: '请填写邮箱' }],
	orgCode: [{ required: true, message: '请选择所属部门' }],
	sex: [{ required: true, message: '请选择性别' }]
})

interface PopupProps {
	act: string
	title: string
	formData: Partial<User.ResList>
	api?: (params: any) => Promise<any>
	refreshData?: () => void
}

withDefaults(defineProps<{ enumMap: { [key: string]: any } }>(), {
	enumMap: () => ({})
})

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

const handleTreeNodeClick = (data: { [key: string]: any }) => {
	popupProps.value.formData.orgCode = data.orgCode
}

// 提交
const ruleFormRef = ref<FormInstance>()
const handleConfirm = () => {
	if (popupProps.value.act == 'view') return (popupVisible.value = false)

	popupProps.value.formData.userCode = popupProps.value.formData.mobile

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
