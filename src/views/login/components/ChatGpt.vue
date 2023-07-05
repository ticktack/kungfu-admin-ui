<template>
	<div class="chat-gpt">
		<div class="chat question">
			<img src="@/assets/images/chat_q.png" />
			<div class="content"></div>
		</div>
		<div class="chat answer" v-show="answerShow">
			<img src="@/assets/images/chat_a.png" />
			<el-scrollbar ref="answerRef" max-height="200">
				<div class="content"></div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="ChatGpt">
import TypeIt from 'typeit'
import { ref, onMounted } from 'vue'
import { chatGpt } from '@/api/modules/login'

let answerShow = ref(false)

const answerRef = ref()
onMounted(async () => {
	const { data } = await chatGpt()

	const instanceQ: any = new (TypeIt as any)(`.question .content`, {
		strings: data.question,
		speed: 200,
		afterComplete: () => {
			instanceQ.destroy()
			answerShow.value = true
			const instanceA: any = new (TypeIt as any)(`.answer .content`, {
				strings: data.answer,
				speed: 150,
				startDelay: 1000,
				afterStep: async () => {
					answerRef.value.update()
					answerRef.value.setScrollTop(100000)
				},
				afterComplete: () => instanceA.destroy()
			}).go()
		}
	}).go()
})
</script>
