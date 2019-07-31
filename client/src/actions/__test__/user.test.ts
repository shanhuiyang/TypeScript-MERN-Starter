import userActionCreator, * as types from "../user";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE } from "../../shared/constants";
import User from "../../models/User";
import Gender from "../../models/Gender";

const DUMMY_USER_1: User = {
    email: "dummy@corp.com",
    password: "dummy",
    name: "Dummy User",
    avatarUrl: "https://avatar.corp.com/dummy",
    gender: Gender.MALE,
    _id: "somedummyid"
};
const DUMMY_ACCESS_TOKEN: string = "dummy token";
const LOCAL_HOST_URI: string = "http://localhost";

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);

describe("logout", () => {
    it("should create an action to LOGOUT", () => {
        const expectedAction = {
            type: types.LOGOUT,
        };
        localStorage.setItem(ACCESS_TOKEN_KEY, DUMMY_ACCESS_TOKEN);
        expect(userActionCreator.logout()).toEqual(expectedAction);
        expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toEqual("");
    });
});

describe("login", () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it("return LOGIN_SUCCESS when login has been done", () => {
        fetchMock.postOnce(`${LOCAL_HOST_URI}/oauth2/login`, {
            body: { user: DUMMY_USER_1, accessToken: DUMMY_ACCESS_TOKEN },
            headers: { "content-type": RESPONSE_CONTENT_TYPE.JSON }
        });

        const expectedActions = [
            { type: types.USER_REQUEST_START },
            { type: types.LOGIN_SUCCESS, user: DUMMY_USER_1 }
        ];
        const store = mockStore({
            loading: false,
            currentUser: undefined
        });

        return store.dispatch(
            userActionCreator.login(DUMMY_USER_1.email, DUMMY_USER_1.password as string)
        ).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});