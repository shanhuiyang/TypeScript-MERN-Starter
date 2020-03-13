import { TRANSLATION as EnUS } from "./en-us";
import { TRANSLATION as ZhCN } from "./zh-cn";
import Translation from "../../client/core/src/models/Translation";
import _ from "lodash";
import { IntlMessageFormat } from "intl-messageformat";

export const getString = (id: string, locale: string): string => {
    let translation: Translation;
    switch (_.toLower(locale)) {
        case "zh":
        case "zh-cn":
        case "zh-hans":
        case "zh-hans-cn":
            translation = ZhCN;
            break;
        case "en-us":
        default:
            translation = EnUS;
    }
    return translation.messages[id];
};
export const getFormattedString = (id: string, locale: string, params: any): string => {
    const formatter = new IntlMessageFormat(
        getString(id, locale),
        locale
    );
    return formatter.format(params) as string;
};