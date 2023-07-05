<template>
	<div class="dataVisualize-box">
		<div class="card top-box">
			<div class="top-content">
				<el-row :gutter="40">
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
						<div class="item-left sle">
							<span class="left-title">访问总数</span>
							<div class="img-box">
								<img src="./images/book-sum.png" alt="" />
							</div>
							<span class="left-number">{{ allVisitor }}</span>
						</div>
					</el-col>
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="18" :xl="18"
						><div class="curve-echarts"><Curve ref="curveRef" /></div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="Home">
import { ref, onMounted } from 'vue'
import Curve from './components/curve.vue'
import { visitStat } from '@/api/modules/home'

const curveRef = ref()
const allVisitor: any = ref(0)

onMounted(async () => {
	const { data } = await visitStat()
	allVisitor.value = data.allVisitor
	curveRef.value.initChart(
		data.topTenList.map((val: any) => {
			return {
				name: val.address,
				value: val.count
			}
		})
	)
	// console.log(data.addressVisitStat)
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
