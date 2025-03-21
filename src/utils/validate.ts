// 校验手机号
export const validateTelephone = (phoneNumber: string) => {
  const phoneRegExp =
    /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  return phoneRegExp.test(phoneNumber);
};
