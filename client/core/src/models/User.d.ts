import Gender from "./Gender";
import { UnifiedModel } from "./UnifiedModel";
import Preferences from "./Preferences";
export default interface User extends UnifiedModel {
    email: string;
    password?: string;
    name: string;
    gender: Gender;
    avatarUrl: string;
    address?: string;
    website?: string;
    preferences: Preferences;
}