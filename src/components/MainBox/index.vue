<template>
	<div class="main-box" :class="{ card: card, 'tree-grid': treeGrid }">
		<!-- 树形表格，左右布局 -->
		<template v-if="treeGrid">
			<div class="card tree-box" :style="{ width: `${treeWidth}px` }">
				<slot name="left"></slot>
			</div>

			<div class="table-box" :style="{ width: `calc(100% - ${treeWidth + 10}px)` }">
				<slot name="right"></slot>
			</div>
		</template>

		<template v-else>
			<slot></slot>
		</template>
	</div>
</template>

<script setup lang="ts" name="MainBox">
interface BoxProps {
	card?: boolean
	treeGrid?: boolean
	treeWidth?: number
}

withDefaults(defineProps<BoxProps>(), {
	card: false,
	treeGrid: false,
	treeWidth: 220
})
</script>
