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
			<el-form-item label="上级菜单" prop="parentCode">
				<el-tree-select
					v-model="popupProps.formData.parentCode"
					placeholder="请选择上级菜单"
					:data="enumMap.treeData"
					node-key="menuCode"
					check-strictly
					:render-after-expand="false"
					:default-expanded-keys="[enumMap.treeData[0].menuCode]"
					:props="{ label: 'menuName' }"
					:disabled="menuType === 1"
					@node-click="handleTreeNodeClick"
				/>
			</el-form-item>
			<el-form-item label="菜单名称" prop="menuName" v-if="menuType === 0">
				<el-input v-model="popupProps.formData.menuName" placeholder="请填写菜单名称" clearable />
			</el-form-item>
			<el-form-item label="按钮类型" prop="menuName" v-else>
				<el-select v-model="popupProps.formData.menuName" @change="changeBtnType">
					<el-option v-for="(i, index) in enumMap.authButtonDict" :key="index" :label="i.text" :value="i.text" />
				</el-select>
			</el-form-item>
			<el-form-item :label="`${menuType === 0 ? '菜单' : '按钮'}编号`" prop="menuCode">
				<el-input
					v-model="popupProps.formData.menuCode"
					placeholder="请填写菜单编号"
					clearable
					:disabled="popupProps.act != 'add' || menuType === 1"
				/>
			</el-form-item>
			<el-form-item label="菜单图标" prop="icon" v-if="menuType === 0">
				<el-popover placement="bottom" width="500px" trigger="click" popper-class="select-icon-popover" :visible="selectIconShow">
					<template #reference>
						<el-input
							v-model="popupProps.formData.icon"
							readonly
							placeholder="请选择菜单图标"
							@click="switchSelectIcon"
							@blur="selectIconShow = false"
						>
							<template #append>
								<el-button :icon="customIcons[popupProps.formData.icon || 'Menu']" />
							</template>
						</el-input>
					</template>
					<el-scrollbar v-if="Object.keys(iconsList).length" style="height: 250px">
						<div class="icon-list">
							<div v-for="item in iconsList" :key="item" class="icon-item" @click="selectIcon(item)">
								<component :is="item"></component>
								<span>{{ item.name }}</span>
							</div>
						</div>
					</el-scrollbar>
				</el-popover>
			</el-form-item>
			<div class="columns-form-item">
				<el-form-item :label="`${menuType === 0 ? '菜单' : '按钮'}排序`" prop="displayNo">
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
		</el-form>
	</Popup>
</template>

<script setup lang="ts" name="MenuPopup">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Menu } from '@/api/interface'
import Popup from '@/components/Popup/index.vue'

import * as Icons from '@element-plus/icons-vue'
const inputValue = ref('')
const selectIconShow = ref(false)
const customIcons: { [key: string]: any } = Icons
const iconsList = computed((): { [key: string]: any } => {
	if (!inputValue.value) return Icons
	let result: { [key: string]: any } = {}
	for (const key in customIcons) {
		if (key.toLowerCase().indexOf(inputValue.value.toLowerCase()) > -1) result[key] = customIcons[key]
	}
	return result
})
const switchSelectIcon = () => {
	selectIconShow.value = !selectIconShow.value
}
const selectIcon = (item: any) => {
	popupProps.value.formData.icon = item.name
	selectIconShow.value = false
}

const menuType = computed(() => popupProps.value.formData.menuType)
const rules = reactive({
	parentCode: [{ required: true, message: '请选择上级菜单' }],
	menuName: [{ required: true, message: '请填写菜单名称' }],
	menuCode: [{ required: true, message: '请填写菜单编号' }],
	displayNo: [{ required: true, message: '请填写菜单排序' }],
	icon: [{ required: true, message: '请选择菜单图标' }]
})

interface PopupProps {
	act: string
	title: string
	formData: Partial<Menu.ResList>
	api?: (params: any) => Promise<any>
	refreshData?: () => void
}

const props = withDefaults(defineProps<{ enumMap: { [key: string]: any } }>(), {
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

	if (popupProps.value.act == 'add' && popupProps.value.formData.menuType === 1) {
		popupProps.value.formData.menuCode = popupProps.value.formData.parentCode + ':'
	}
}

// 切换按钮类型
const changeBtnType = (val: string) => {
	const btnItem = props.enumMap.authButtonDict.find((item: any) => item.text === val)
	popupProps.value.formData.menuCode = popupProps.value.formData.parentCode + ':' + btnItem.value
}

const handleTreeNodeClick = (data: { [key: string]: any }) => {
	popupProps.value.formData.parentName = data.menuName
}

// 提交
const ruleFormRef = ref<FormInstance>()
const handleConfirm = () => {
	if (!popupProps.value.formData.icon) popupProps.value.formData.icon = 'Menu'

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

watch(popupVisible, val => {
	if (!val) selectIconShow.value = false
})

defineExpose({
	acceptParams
})
</script>

<style lang="scss"></style>
