<template>
	<div class="login-container flx-center">
		<div class="login-box">
			<SwitchDark class="dark" />
			<div class="login-left">
				<ChatGpt></ChatGpt>
			</div>

			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" src="@/assets/images/logo.png" alt="" />
					<h2 class="logo-text">Kungfu-Admin</h2>
				</div>
				<LoginForm />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from '@/components/SwitchDark/index.vue'
import ChatGpt from './components/ChatGpt.vue'
import LoginForm from './components/LoginForm.vue'
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
