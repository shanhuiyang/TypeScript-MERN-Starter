import React from "react";
import Topic from "./Topic.d";
import { Body, ListItem, Left, Thumbnail, Text, Right } from "native-base";
import { Link, RouteComponentProps, withRouter } from "react-router-native";

interface IProps extends RouteComponentProps<any> {
    value: Topic
};

interface IStates {};

class TopicItem extends React.Component<IProps, IStates> {
    render(): any {
        const topic: Topic = this.props.value;
        return <Link to={{
                pathname: `${this.props.match.url}/${topic.id}`,
                state: topic
            }} component={ListItem} avatar>
            <Left>
                <Thumbnail small source={topic.speakerAvatar} />
            </Left>
            <Body>
                <Text>{topic.title}</Text>
                <Text note>{topic.speaker}</Text>
            </Body>
            <Right>
                <Text note>{topic.schedule.toLocaleDateString()}</Text>
            </Right>
        </Link>;
    }
}

export default withRouter(TopicItem);