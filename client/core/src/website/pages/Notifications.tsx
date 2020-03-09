import React from "react";
import { Container, Message, Button } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import { FormattedMessage } from "react-intl";
import connectAllProps from "../../shared/connect";
import Notification from "../../models/Notification";
import UserAvatar from "../components/user/UserAvatar";
import User from "../../models/User";
import InteractionType from "../../models/InteractionType";
import { Link } from "react-router-dom";
import PostType from "../../models/PostType";
import NothingMoreFooter from "../components/shared/NothingMoreFooter";
import { isMobile } from "../components/dimension";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import { Redirect } from "react-router";

interface States {
    loadedAll: boolean;
}
class Notifications extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loadedAll: false
        };
    }
    render(): React.ReactElement<any> {
        if (this.props.state.userState.currentUser) {
            return <Container text style={CONTAINER_STYLE}>
                <div>
                    {
                        this.props.state.userState.notifications.length > 0 ?
                        this.props.state.userState.notifications.map(this.renderMessage)
                        : this.renderEmptyNotification()
                    }
                    {
                        this.renderLoadAll()
                    }
                </div>
            </Container>;
        } else {
            return <Redirect to="login" />;
        }
    }
    private renderEmptyNotification = (): React.ReactElement<any> => {
        return <Message>
            <FormattedMessage id="page.notification.empty" />
        </Message>;
    }
    private renderMessage = (notification: Notification): React.ReactElement<any> | undefined => {
        const subject: User = this.props.state.userDictionary[notification.subject];
        if (!subject) {
            return undefined;
        }
        return <Message success={!notification.acknowledged} key={notification._id}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                fontSize: isMobile() ? 12 : 14
            }}>
            <UserAvatar user={subject}/>
            <span style={{paddingLeft: 8, paddingRight: 8}}>
                <b>{subject.name}</b>
                {this.getEventMessage(notification)}
                {this.getObjectMessage(notification)}
            </span>
            {
                notification.acknowledged ? undefined :
                <div style={{flex: "auto", flexDirection: "row", justifyContent: "flex-end"}}>
                    <Button basic size="small"
                        onClick={() => { this.props.actions.acknowledgeNotification(notification._id); }}>
                        <FormattedMessage id="page.notification.set_as_read" />
                    </Button>
                </div>
            }
        </Message>;
    }
    private getEventMessage = (notification: Notification): React.ReactElement<any> => {
        switch (notification.event) {
            case InteractionType.COMMENT:
                return <FormattedMessage id="page.notification.event_comment" />;
            case InteractionType.LIKE:
                return <FormattedMessage id="page.notification.event_like" />;
            case InteractionType.UNLIKE:
                return <FormattedMessage id="page.notification.event_unlike" />;
            case InteractionType.MENTION:
                return <FormattedMessage id="page.notification.event_mention" />;
            default:
                return <span/>;
        }
    }
    private getObjectMessage = (notification: Notification): React.ReactElement<any> => {
        let objectMessageId: string;
        const title: string = notification.objectText;
        switch (notification.objectType) {
            case PostType.ARTICLE:
                objectMessageId = "page.notification.object_article";
                break;
            case PostType.THREAD:
                objectMessageId = "page.notification.object_thread";
                break;
            case PostType.COMMENT:
                objectMessageId = "page.notification.object_comment";
                break;
            default:
                return <span/>;
        }
        return <Link to={notification.link}
            onClick={() => { this.props.actions.acknowledgeNotification(notification._id); }}>
            <FormattedMessage id={objectMessageId} />
            {title ? `: ${title}` : undefined }
        </Link>;
    }
    private renderLoadAll = (): React.ReactElement<any> | undefined => {
        const loading: boolean | undefined = this.props.state.userState.loading;
        if (loading) {
            return this.renderLoadButton(true);
        } else {
            if (!this.state.loadedAll) {
                return this.renderLoadButton(false);
            } else if (this.props.state.userState.notifications.length > 0) {
                return <NothingMoreFooter />;
            } else {
                return undefined;
            }
        }
    }
    private renderLoadButton = (loading: boolean): React.ReactElement<any> => {
        return <Button fluid basic
            onClick={this.loadMore}
            loading={loading}
            disabled={loading} >
            <Button.Content>
                <FormattedMessage id="page.notification.load_all" />
            </Button.Content>
        </Button>;
    }
    private loadMore = (): void => {
        this.props.actions.getAllNotifications();
        this.setState({loadedAll: true});
    }
}

export default connectAllProps(Notifications);