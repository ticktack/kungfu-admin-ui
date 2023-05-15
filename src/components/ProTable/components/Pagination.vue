<template>
	<!-- 分页组件 -->
	<el-pagination
		:current-page="pageable.pageNumber"
		:page-size="pageable.pageSize"
		:page-sizes="[10, 25, 50, 100]"
		:background="true"
		layout="total, sizes, prev, pager, next, jumper"
		:total="pageable.totalRow"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
interface Pageable {
	pageNumber: number
	pageSize: number
	totalRow: number
}

interface PaginationProps {
	pageable: Pageable
	handleSizeChange: (size: number) => void
	handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>
