import React, { Fragment } from "react";
import { Text, Header, Title, Body, Content, Button, Left, Right, Icon, H2, Card, CardItem, Thumbnail } from "native-base";
import { RouteComponentProps, Redirect } from "react-router-native";
import Topic from "./Topic.d";

interface IProps extends RouteComponentProps<any> {};

interface IStates {};

export default class TopicDetail extends React.Component<IProps, IStates> {
    render(): any {
        const topic: Topic | undefined = this.props.location.state;
        // console.log("render the topic " + JSON.stringify(this.props));
        if (topic) {
            return <Fragment>
                <Header >
                    <Left>
                        <Button transparent onPress={this.props.history.goBack}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Topic Detail</Title>
                    </Body>
                    <Right>{/* nothing but counterbalance */}</Right>
                </Header>
                <Content padder>
                    <Card>
                        <CardItem header>
                            <H2>{topic.title}</H2>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Thumbnail small source={topic.speakerAvatar} />
                                <Body>
                                <Text>{topic.speaker}</Text>
                                    <Text note>{topic.schedule.toLocaleDateString()}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    {topic.description}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                {/* No Footer in detail page */}
            </Fragment>;
        } else {
            return <Redirect to="/error" />
        }
    }
}