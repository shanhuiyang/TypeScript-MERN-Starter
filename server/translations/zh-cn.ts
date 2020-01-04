import Translation from "../../client/core/src/models/Translation";
import { default as fromClient } from "../../client/core/src/shared/translations/zh-cn";

export const TRANSLATION: Translation = {
    locale: "zh-CN",
    messages: {
        ...fromClient.messages,
        "email.OTP_subject": "来自{appName}的验证码",
        "email.OTP_content": `
            欢迎来到 {appName}!

            感谢你的注册。
            你的验证码是： {code} (10分钟内有效)

            祝好！
            {appName}团队`
    }
};