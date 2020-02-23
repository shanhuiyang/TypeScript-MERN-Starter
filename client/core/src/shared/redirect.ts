import { ComponentProps } from "./ComponentProps";

export const pendingRedirect = (props: ComponentProps): boolean => {
    return !props.state.redirectTask.redirected
    && props.state.redirectTask.to !== props.match.url;
};