import { Translation } from "../models/Translation";
import EnUS from "../shared/translations/en-us";

const initialState: Translation = EnUS;

const translations = (state: Translation = initialState, action: any): Translation => {
    return state;
};

export default translations;
