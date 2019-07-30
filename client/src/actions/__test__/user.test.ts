import userActionCreator, * as types from "../user";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import { ACCESS_TOKEN_KEY } from "../../shared/constants";
import User from "../../models/User";
import Gender from "../../models/Gender";

const dummyUser1: User = {
    email: "dummy@corp.com",
    password: "dummy",
    name: "Dummy User",
    avatarUrl: "https://avatar.corp.com/dummy",
    gender: Gender.MALE,
    _id: "somedummyid"
};

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);

describe("logout", () => {
    it("should create an action to LOGOUT", () => {
        const expectedAction = {
            type: types.LOGOUT,
        };
        localStorage.setItem(ACCESS_TOKEN_KEY, "dummy token");
        expect(userActionCreator.logout()).toEqual(expectedAction);
        expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toEqual("");
    });
});
