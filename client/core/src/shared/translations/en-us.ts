import Translation from "../../models/client/Translation";

const TRANSLATION: Translation = {
    locale: "en-US",
    messages: {
        // App basic info
        "app.name": "Typescript MERN Starter",
        "app.footer": "Copyright © 2019 Company, Inc. All Rights Reserved.",

        // Pages.
        // pattern: page.<page_name>.<section>
        "page.home": "Home",
        "page.about": "About",
        "page.about.introduction": "This project is intended to build a RESTful web app for all platforms in TypeScript. With this project you can build a web app including server, website, Android app and iOS app in one programming language.",
        "page.about.learn_more": "Learn More",
        "page.me": "Me",
        "page.me.login": "Sign in",
        "page.me.sign_up": "Sign up",
        "page.me.update": "Update Profile",
        "page.me.logout": "Log out",
        "page.avatar.title": "Adjust Your Profile Image",
        "page.avatar.rotate": "Rotate",
        "page.avatar.zoom": "Zoom",
        "page.avatar.inquiry": "Is it okay to use this photo?",
        "page.consent.greeting": "Hi {email},",
        "page.consent.description": "{app_name} is requesting access to your account.",
        "page.consent.inquiry": "Do you approve?",
        "page.article.add": "Add Article",
        "page.article.edit": "Edit Article",
        "page.article.delete": "Delete Article: {title}",
        "page.article.delete_confirmation": "You cannot store this article after delete. Are you sure to delete?",
        "page.article.empty": "No articles are added up to now.",

        // Models.
        // pattern: <model_name>.<model_property>.<model_property_values>
        "user.email": "Email",
        "user.password": "Password",
        "user.confirm_password": "Confirm Password",
        "user.name": "Name",
        "user.photo": "Photo",
        "user.gender": "Gender",
        "user.gender.male": "Male",
        "user.gender.female": "Female",
        "user.gender.other": "Other",
        "user.address": "Address",
        "user.website": "Web site",
        "article.title": "Title",
        "article.content": "Content",
        "article.content_placeholder": "no less than 100 characters",
        "article.created_at": "Created at ",
        "article.updated_at": "Updated at ",

        // Component
        // pattern: component.<component_name>.<action>
        "component.button.file_select": "Choose File",
        "component.button.submit": "Submit",
        "component.button.confirm": "OK",
        "component.button.cancel": "Cancel",
        "component.button.approve": "Approve",
        "component.button.deny": "Deny",
        "component.button.update": "Update",
        "component.button.delete": "Delete",
        "component.button.edit": "Edit",
        "component.button.create": "Create",

        // Toast
        // pattern: toast.<model>.<info>
        "toast.user.general_error": "Cannot find the user, please check.",
        "toast.user.invalid_token_error": "Please log in first.",
        "toast.user.sign_in_successfully": "Sign in successfully.",
        "toast.user.sign_in_failed": "Sign in failed.",
        "toast.user.deny_consent": "Please approve to finish signing up.",
        "toast.user.update_profile_successfully": "Update profile successfully.",
        "toast.user.update_profile_failed": "Update profile failed.",
        "toast.user.upload_avatar_failed": "Upload avatar failed.",
        "toast.user.upload_exist_account": "Account with that email address already exists.",
        "toast.user.account_not_found": "Account cannot be found.",
        "toast.client.invalid": "Invalid client!",
        "toast.client.incorrect_url": "Incorrect redirectUri!",
        "toast.article.save_successfully": "Save your article successfully.",
        "toast.article.delete_successfully": "Delete your article successfully.",
        "toast.article.title_empty": "Title could not be empty.",
        "toast.article.content_empty": "Content could not be empty.",
        "toast.article.title_too_long": "Title could not be longer than 100 characters.",
        "toast.article.content_too_short": "Content could not be shorter than 100 characters.",
        "toast.article.invalid_author": "You are not the author!",
        "toast.article.not_found": "Article not found!",
        "toast.user.attack_alert": "Malicious attack is detected.",
        "toast.user.email": "Invalid email.",
        "toast.user.email_not_found": "This email is not found.",
        "toast.user.password_error": "Password is incorrect.",
        "toast.user.password_too_short": "Password should be longer than or equal to 6 characters.",
        "toast.user.password_empty": "Password could not be empty.",
        "toast.user.confirm_password": "confirmed password field must have the same value as the password field",
        "toast.user.name": "Name could not be empty.",
        "toast.user.gender": "Invalid gender.",
    }
};

export default TRANSLATION;