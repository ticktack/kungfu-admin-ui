<template>
	<component
		:is="drawer ? 'el-drawer' : 'el-dialog'"
		v-model="popupVisible"
		v-bind="$attrs"
		:width="width"
		draggable
		:size="isFullscreen ? '100%' : width"
		:fullscreen="isFullscreen"
		align-center
		destroy-on-close
		:show-close="false"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<template #header="{ close, titleId, titleClass }">
			<div class="popup-header flx-justify-between">
				<div :id="titleId" :class="titleClass">{{ title }}</div>
				<div class="headerbtn">
					<SvgIcon
						:name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
						:iconStyle="{ width: '16px', height: '16px' }"
						@click="switchFullScreen"
					/>
					<el-icon @click="close"><Close /></el-icon>
				</div>
			</div>
		</template>

		<slot></slot>

		<template #footer v-if="$slots.footer || showConfirmBtn || showCancelBtn">
			<el-button icon="CircleClose" v-if="showCancelBtn" @click="handleCancel">{{ cancelBtnText }}</el-button>
			<el-button type="primary" icon="CircleCheck" v-if="showConfirmBtn" @click="handleConfirm">{{ confirmBtnText }}</el-button>
			<slot name="footer"></slot>
		</template>
	</component>
</template>

<script setup lang="ts" name="Popup">
import SvgIcon from '@/components/SvgIcon/index.vue'

import { ref, computed, watch } from 'vue'

interface PopupProps {
	modelValue: boolean
	title: string
	drawer?: boolean
	confirmBtnText?: string
	cancelBtnText?: string
	showConfirmBtn?: boolean
	showCancelBtn?: boolean
	width?: string
	fullscreen?: boolean
}

const props = withDefaults(defineProps<PopupProps>(), {
	modelValue: false,
	title: '',
	drawer: false,
	confirmBtnText: '确 定',
	cancelBtnText: '取 消',
	showConfirmBtn: true,
	showCancelBtn: true,
	width: '',
	fullscreen: false
})

const popupVisible = computed({
	get() {
		return props.modelValue
	},
	set(val: boolean) {
		emit('update:modelValue', val)
	}
})

// const defineEmits(['confirm', 'cancel'])
type EmitProps = {
	(e: 'update:modelValue', val: boolean): void
	(e: 'update:fullscreen', val: boolean): void
	(e: 'confirm'): void
	(e: 'cancel'): void
}
const emit = defineEmits<EmitProps>()

const handleConfirm = () => {
	emit('confirm')
}

const handleCancel = () => {
	popupVisible.value = false
	emit('cancel')
}

const isFullscreen = ref(false)
watch(
	() => props.modelValue,
	() => {
		isFullscreen.value = !!props.fullscreen
	},
	{ immediate: true }
)

const switchFullScreen = () => {
	isFullscreen.value = !isFullscreen.value
}

defineExpose({
	handleCancel
})
</script>

<style lang="scss" scoped></style>
