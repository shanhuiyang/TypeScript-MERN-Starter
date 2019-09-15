import { getHostUrl } from "../../core/src/shared/fetch";

export const getAvatarSource = (url: string): any => {
    if (url) {
        return { uri: `${getHostUrl()}${url}` };
    } else {
        return { uri: `${getHostUrl()}/images/avatar.png` };
    }
};
