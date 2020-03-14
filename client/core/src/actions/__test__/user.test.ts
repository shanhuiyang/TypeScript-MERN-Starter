import userActionCreator, * as types from "../user";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE } from "../../shared/constants";
import User from "../../models/User";
import Gender from "../../models/Gender";
import { initStorage } from "../../shared/storage";
import storageWrapper from "../../website/components/storage";
import { getHostUrl } from "../../shared/fetch";
import { DEFAULT_PREFERENCES } from "../../shared/preferences";
import AuthenticationResponse from "../../models/response/AuthenticationResponse";

// Initialize local storage provider
initStorage(storageWrapper);

const DUMMY_USER_1: User = {
    email: "dummy@corp.com",
    password: "dummy",
    name: "Dummy User",
    avatarUrl: "https://avatar.corp.com/dummy",
    gender: Gender.MALE,
    preferences: DEFAULT_PREFERENCES,
    _id: "somedummyid"
};
const DUMMY_ACCESS_TOKEN: string = "dummy token";

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);
const fetchMock = new MockAdapter(axios);

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
        fetchMock.onPost(`${getHostUrl()}/oauth2/login`).reply(
            200,
            {
                user: DUMMY_USER_1,
                accessToken: DUMMY_ACCESS_TOKEN,
                notifications: [],
                others: []
            } as AuthenticationResponse,
            {
                "content-type": RESPONSE_CONTENT_TYPE.JSON
            }
        );

        const expectedActions = [
            { type: types.USER_REQUEST_START },
            { type: types.LOGIN_SUCCESS, user: DUMMY_USER_1, notifications: [], others: []}
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