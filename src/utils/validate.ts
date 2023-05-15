// * Element 常用表单校验规则

/**
 *  @rule 邮箱
 */
export const validateEmail = (str: string) => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(str)

/**
 *  @rule 手机号
 */
export const validateTelphone = (str: string) => /^1[3456789]\d{9}$/.test(str)

/**
 *  @rule 固定电话
 */
export const validateFixedphone = (str: string) => /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(str)

/**
 *  @rule 身份证号
 */
export const validateIdCard = (str: string) =>
	/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str)

/**
 *  @rule URL
 */
export const validateUrl = (str: string) =>
	/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/.test(str)

/**
 *  @rule IPv4地址
 */
export const validateIPv4 = (str: string) =>
	/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)

/**
 *  @rule 金额
 */
export const amount = (str: string) => /((^-?[1-9]\d*)|^-?0)(\.\d{0,4}){0,1}$/.test(str)

/**
 *  @rule 用户名，4到16位（字母，数字，下划线，减号）
 */
export const validateUserName = (str: string) => /^[a-zA-Z0-9_-]{2,50}$/.test(str)

/**
 *  @rule 密码强度，6-20位，数字，字母，特殊字符至少包含两种，不能包含中文和空格
 */
export const validatePwd = (str: string) =>
	/(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/.test(str)

/**
 *  @rule 全中文校验
 */
export const validateCNChar = (str: string) => /^((?![\u3000-\u303F])[\u2E80-\uFE4F])*$/.test(str)

/**
 *  @rule 包含中文
 */
export const validateContainsCNChar = (str: string) => /((?![\u3000-\u303F])[\u2E80-\uFE4F])/.test(str)

/**
 *  @rule 只能包含数字
 */
export const validateNum = (str: string) => /^[0-9]*\.?[0-9]*$/i.test(str)

/**
 *  @rule 只能包含字母字符
 */
export const validateAlpha = (str: string) => /^[A-Z]*$/i.test(str)

/**
 *  @rule 只能包含字母字符或数字
 */
export const validateAlphaNum = (str: string) => /^[0-9A-Z]*$/i.test(str)

/**
 *  @rule 只能包含字母字符或空格
 */
export const validateAlphaSpaces = (str: string) => /^[A-Z\s]*$/i.test(str)

/**
 *  @rule 只能包含字母字符，数字，破折号或下划线
 */
export const validateAlphaDash = (str: string) => /^[0-9A-Z_-]*$/i.test(str)

export const validateSimpleCode = (str: string) => /^[A-Za-z0-9:*_-]*$/.test(str)

/**
 *  @rule 只能包含中文、字母，数字
 */
export const validateCNCharAlphaNum = (str: string) => /^((?![\u3000-\u303F])[\u2E80-\uFE4Fa-zA-Z0-9])*$/i.test(str)

/**
 *  @rule 校验统一社会信用代码
 */
export const validateSocialCode = (str: string) => /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/.test(str)

/**
 *  @rule 校验银行账号
 */
export const bankAccount = (str: string) => /^[1-9]\d{9,29}$/.test(str)
