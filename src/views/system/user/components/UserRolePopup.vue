<template>
	<Popup
		v-model="popupVisible"
		width="450px"
		drawer
		:destroy-on-close="true"
		:title="`${popupProps.title}`"
		@confirm="handleConfirm"
	>
		<TreeFilter
			ref="treeFilterRef"
			default-expand-all
			label="roleName"
			check-strictly
			multiple
			:data="enumMap.roleTreeData"
			id="roleCode"
		/>
	</Popup>
</template>

<script setup lang="ts" name="UserPopup">
import { ref /*, reactive*/ } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@/api/interface'
import TreeFilter from '@/components/TreeFilter/index.vue'
import Popup from '@/components/Popup/index.vue'

interface PopupProps {
	title: string
	formData: Partial<User.ResList>
	api?: (params: any) => Promise<any>
}

withDefaults(defineProps<{ enumMap: { [key: string]: any } }>(), {
	enumMap: () => ({})
})

const popupVisible = ref(false)
const popupProps = ref<PopupProps>({
	title: '',
	formData: {}
})

// 接收父组件传过来的参数
const acceptParams = (params: PopupProps) => {
	popupProps.value = params
	popupVisible.value = true
}

// 提交
const treeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null)
const handleConfirm = async () => {
	const userRoleCodes = treeFilterRef.value?.treeRef?.getCheckedKeys()
	let roleCodes: any = userRoleCodes?.join()
	try {
		let res = await popupProps.value.api!({ userCode: popupProps.value.formData.userCode, roleCodes })
		ElMessage.success({ message: `${res.msg}` })
		popupVisible.value = false
	} catch (error) {
		console.log(error)
	}
}

defineExpose({
	acceptParams,
	treeFilterRef
})
</script>
