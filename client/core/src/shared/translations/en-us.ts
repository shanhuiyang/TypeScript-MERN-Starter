import Translation from "../../models/Translation";

const TRANSLATION: Translation = {
    locale: "en-US",
    messages: {
        // App basic info
        "app.name": "Typescript MERN Starter",
        "app.footer": "Copyright © 2020 Company, Inc. All Rights Reserved.",
        "app.connect_error": "Failed to fetch", // Do not change this phrase, it is used as keywords.

        // Pages.
        // pattern: page.<page_name>.<section>
        "page.home": "Home",
        "page.about": "About ",
        "page.about.introduction": "This project is intended to build a RESTful web app for all platforms in TypeScript. With this project you can build a web app including server, website, Android app and iOS app in one programming language.",
        "page.about.learn_more": "Learn More",
        "page.me": "Me",
        "page.me.login": "Sign in",
        "page.me.forget_password": "Forget password?",
        "page.me.sign_up": "Sign up",
        "page.me.profile": "Profile",
        "page.me.logout": "Log out",
        "page.me.preferences": "Preferences",
        "page.me.security": "Change Password",
        "page.me.change_password": "Change Password",
        "page.me.reset_password": "Forget Password",
        "page.me.reset_password_step_1": "Fill Your Account",
        "page.me.reset_password_step_2": "Verify Email",
        "page.me.reset_password_step_3": "Reset Password",
        "page.me.notifications": "Notifications",
        "page.threads": "Forum",
        "page.thread.add": "Add thread",
        "page.thread.empty": "No threads are added up to now.",
        "page.thread.placeholder": "Anything you would like to post...",
        "page.thread.removed": ">>> The original thread has been removed <<<",
        "page.thread.delete": "Delete Thread: {title}",
        "page.thread.delete_confirmation": "You cannot restore this thread after delete. Are you sure to delete?",
        "page.avatar.title": "Adjust Your Profile Image",
        "page.avatar.rotate": "Rotate",
        "page.avatar.zoom": "Zoom",
        "page.avatar.inquiry": "Is it okay to use this photo?",
        "page.consent.greeting": "Hi {email},",
        "page.consent.description": "{app_name} is requesting access to your account.",
        "page.consent.inquiry": "Do you approve?",
        "page.consent.OTP": "Please fill the code sent to your mailbox, it will expire in 10 minutes.",
        "page.consent.OTP_not_received": "Have not received the code?",
        "page.consent.OTP_resend": "Resend",
        "page.article.add": "Add Article",
        "page.article.edit": "Edit Article",
        "page.article.preview": "Preview",
        "page.article.delete": "Delete Article: {title}",
        "page.article.delete_confirmation": "You cannot restore this article after delete. Are you sure to delete?",
        "page.article.empty": "No articles are added up to now.",
        "page.article.load_more": "Load More",
        "page.article.clear_edit": "Clear Your Editing",
        "page.article.clear_edit_confirmation": "You cannot restore your editing after clear. Are you sure to clear?",
        "page.insert_image.title": "Insert Image",
        "page.insert_image.fill_description": "Image Description",
        "page.insert_image.fill_link": "Image Link",
        "page.insert_image.upload": "Upload from Disk",
        "page.notification.event_comment": "replied",
        "page.notification.event_like": "liked",
        "page.notification.event_unlike": "cancelled like on",
        "page.notification.object_article": "your article",
        "page.notification.object_comment": "your comment",
        "page.notification.object_thread": "your thread",
        "page.notification.empty": "No new notification.",
        "page.notification.load_all": "See all read notifications",
        "page.notification.set_as_read": "Set as read",

        // Models.
        // pattern: <model_name>.<model_property>.<model_property_values>
        "user.email": "Email",
        "user.password": "Password",
        "user.confirm_password": "Confirm Password",
        "user.old_password": "Old Password",
        "user.new_password": "New Password",
        "user.name": "Name",
        "user.photo": "Photo",
        "user.gender": "Gender",
        "user.gender.male": "Male",
        "user.gender.female": "Female",
        "user.gender.other": "Other",
        "user.address": "Address",
        "user.website": "Web site",
        "user.OTP": "OTP",
        "preferences.editor_type": "Editor type",
        "preferences.editor_type.markdown": "Markdown",
        "preferences.editor_type.wysiwyg": "WYSIWYG",
        "article.title": "Title",
        "article.content": "Content",
        "article.content_placeholder": "no less than {minimum_length} characters",
        "post.created_at": "Created at ",
        "post.updated_at": "Last updated at ",
        "post.replied_at": "Last replied at ",
        "post.no_reply_yet": "No reply yet",

        // Components.
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
        "component.button.preview": "Preview",
        "component.button.see_all": "Read all",
        "component.button.create": "Create",
        "component.button.next": "next",
        "component.button.scroll_up": "Scroll to top",
        "component.button.clear_edit": "Clear edit",
        "component.comment.title": "Comment",
        "component.comment.placeholder": "Leave a reply",
        "component.comment.submit": "Add Reply",
        "component.comment.reply": "Reply",
        "component.comment.delete": "Delete",
        "component.comment.delete_title": "Delete Comment",
        "component.comment.delete_confirmation": "You cannot restore this comment after delete. Are you sure to delete?",
        "component.footer.nothing_more": "No more articles",

        // Toasts.
        // pattern: toast.<model>.<info>
        "toast.user.general_error": "Cannot find the user, please check.",
        "toast.user.invalid_token_error": "Please log in first.",
        "toast.user.sign_in_successfully": "Sign in successfully.",
        "toast.user.sign_in_failed": "Sign in failed.",
        "toast.user.deny_consent": "Please approve to finish signing up.",
        "toast.user.update_successfully": "Update successfully.",
        "toast.user.update_failed": "Update failed.",
        "toast.user.upload_avatar_failed": "Upload avatar failed.",
        "toast.user.upload_exist_account": "Account with that email address already exists.",
        "toast.user.account_not_found": "Account cannot be found.",
        "toast.user.error_OTP": "Error OTP!",
        "toast.user.expired_OTP": "Expired OTP!",
        "toast.user.password_not_change": "New password cannot be the same as the old one.",
        "toast.user.old_password_error": "Old password is incorrect.",
        "toast.client.invalid": "Invalid client!",
        "toast.client.incorrect_url": "Incorrect redirectUri!",
        "toast.post.title_empty": "Title could not be empty.",
        "toast.post.content_empty": "Content could not be empty.",
        "toast.post.title_too_long": "Title could not be longer than 50 characters.",
        "toast.post.content_too_short": "Content could not be shorter than 150 characters.",
        "toast.article.save_successfully": "Save your article successfully.",
        "toast.article.delete_successfully": "Delete your article successfully.",
        "toast.article.invalid_author": "You are not the author!",
        "toast.article.not_found": "Article not found!",
        "toast.article.insert_image_failed": "Failed to insert the image",
        "toast.user.attack_alert": "Malicious attack is detected.",
        "toast.user.email": "Invalid email.",
        "toast.user.email_not_found": "This email is not found.",
        "toast.user.password_error": "Password is incorrect.",
        "toast.user.password_too_short": "Password should be longer than or equal to 6 characters.",
        "toast.user.password_empty": "Password could not be empty.",
        "toast.user.confirm_password": "confirmed password field must have the same value as the password field",
        "toast.user.name": "Name could not be empty.",
        "toast.user.gender": "Invalid gender.",
        "toast.user.otp_send_failed": "Send OTP failed!",
        "toast.user.preferences.editor_type": "Invalid editor type",
        "toast.comment.content_empty": "Comment could not be empty.",
        "toast.comment.add_successfully": "Comment successfully.",
        "toast.comment.add_failed": "Comment failed.",
        "toast.comment.delete_parent": "Sorry, you cannot delete a comment someone has replied to it.",
        "toast.comment.delete_successfully": "Delete successfully.",
        "toast.comment.delete_failed": "Delete failed.",
        "toast.comment.not_found": "Cannot find this comment.",
        "toast.notification.not_found": "Cannot find this notification",
        "toast.thread.add_successfully": "Your thread created.",
        "toast.thread.add_failed": "Your thread cannot be created.",
        "toast.thread.delete_successfully": "Your thread has been deleted",
        "toast.thread.delete_failed": "Your thread cannot be deleted."
    }
};

export default TRANSLATION;