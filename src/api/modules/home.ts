import http from '@/api'

// * 浏览统计
export const visitStat = () => {
	return http.get(`/sys-log/visitStat`)
}
