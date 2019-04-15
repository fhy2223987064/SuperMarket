/* 工具函数 */ 
// 验证密码 (以字母开头，长度在3~6之间，只能包含字符、数字和下划线)
export function passwordReg(val) {
    const reg = /^[a-zA-Z]\w{2,5}$/;
    return reg.test(val)
}


// 校验数字正则   验证0-10000000位的数字
export function numReg( val ){
    const reg = /^\d{0,10000000}$/;
    return reg.test(val)
}

