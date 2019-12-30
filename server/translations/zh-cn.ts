import Translation from "../../client/core/src/models/Translation";
import { default as fromClient } from "../../client/core/src/shared/translations/zh-cn";

export const TRANSLATION: Translation = {
    locale: "zh-CN",
    messages: {
        ...fromClient.messages,
        "email.activation_code_subject": "来自{appName}的激活码",
        "email.activation_code_content": `
            欢迎来到 {appName}!

            感谢你的注册。
            你的激活码是： {code}

            祝好！
            {appName}团队`
    }
};