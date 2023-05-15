// const files = require.context('.', true, /\.\/.*\.ts$/)

const files: any = import.meta.globEager('./*.ts')
const apiDocs = Object.keys(files)
	.filter((key: string) => !['./index.ts'].includes(key))
	.map((fileName: string) => ({
		category: files[fileName].category,
		apiConfig: files[fileName].default
	}))

const apiConfig = apiDocs.map(item => item.apiConfig).flat(1)

export { apiDocs }
export default apiConfig
