import Translation from "../../models/Translation";

const TRANSLATION: Translation = {
    locale: "zh-CN",
    messages: {
        // App basic info
        "app.name": "Typescript MERN Starter",
        "app.footer": "Copyright © 2020 公司版权所有",
        "app.connect_error": "无法连接服务器",

        // Pages.
        // pattern: page.<page_name>.<section>
        "page.home": "首页",
        "page.about": "关于",
        "page.about.introduction": "本项目使用Typescript来构建一个REST架构的web应用。在这个项目的基础上你可以仅仅使用一种编程语言便能实现服务器端、web端、和移动端的应用开发。",
        "page.about.learn_more": "了解更多",
        "page.me": "我",
        "page.me.login": "登录",
        "page.me.forget_password": "忘记密码？",
        "page.me.sign_up": "注册",
        "page.me.profile": "个人资料",
        "page.me.logout": "退出登录",
        "page.me.preferences": "偏好设置",
        "page.me.security": "修改密码",
        "page.me.change_password": "修改密码",
        "page.me.reset_password": "忘记密码",
        "page.me.reset_password_step_1": "填写账号",
        "page.me.reset_password_step_2": "验证邮箱",
        "page.me.reset_password_step_3": "重置密码",
        "page.me.notifications": "通知",
        "page.threads": "论坛",
        "page.thread.add": "发新帖",
        "page.thread.empty": "目前还没有任何帖子。",
        "page.thread.placeholder": "输入任何内容…",
        "page.consent.greeting": "{email}你好，",
        "page.consent.description": "{app_name}需要访问你的账号。",
        "page.consent.inquiry": "请问是否授权？",
        "page.consent.OTP": "请在下方填入发送到你邮箱的验证码，验证码10分钟内有效。",
        "page.consent.OTP_not_received": "没有收到验证码？",
        "page.consent.OTP_resend": "重新发送",
        "page.avatar.title": "调整你的头像",
        "page.avatar.rotate": "旋转",
        "page.avatar.zoom": "缩放",
        "page.avatar.inquiry": "确定使用这张照片吗？",
        "page.article.add": "新建文章",
        "page.article.edit": "编辑文章",
        "page.article.preview": "预览",
        "page.article.delete": "删除文章：{title}",
        "page.article.delete_confirmation": "删除后的文章不可恢复，你确定要删除吗？",
        "page.article.clear_edit": "清空已编辑的内容",
        "page.article.clear_edit_confirmation": "清空的已编辑内容不可恢复，你确定要清空吗？",
        "page.article.empty": "目前还没有任何文章。",
        "page.article.load_more": "加载更多",
        "page.insert_image.title": "插入图片",
        "page.insert_image.fill_description": "图片描述",
        "page.insert_image.fill_link": "图片链接",
        "page.insert_image.upload": "本地上传",
        "page.notification.event_comment": "回复了",
        "page.notification.event_like": "点赞了",
        "page.notification.event_unlike": "取消点赞",
        "page.notification.object_article": "你的文章",
        "page.notification.object_comment": "你的评论",
        "page.notification.empty": "没有新的通知",
        "page.notification.load_all": "查看所有已读通知",
        "page.notification.set_as_read": "设为已读",

        // Models.
        // pattern: <model_name>.<model_property>.<model_property_values>
        "user.email": "邮箱",
        "user.password": "密码",
        "user.confirm_password": "确认密码",
        "user.old_password": "旧密码",
        "user.new_password": "新密码",
        "user.name": "名字",
        "user.photo": "头像",
        "user.gender": "性别",
        "user.gender.male": "男",
        "user.gender.female": "女",
        "user.gender.other": "其它",
        "user.address": "地址",
        "user.website": "个人网站",
        "user.OTP": "验证码",
        "preferences.editor_type": "编辑器类型",
        "preferences.editor_type.markdown": "Markdown",
        "preferences.editor_type.wysiwyg": "所见即所得",
        "article.title": "标题",
        "article.content": "正文",
        "article.content_placeholder": "不少于{minimum_length}字",
        "article.created_at": "创建于",
        "article.updated_at": "最后更新于",

        // Components.
        // pattern: component.<component_name>.<action>
        "component.button.file_select": "选择文件",
        "component.button.submit": "提交",
        "component.button.confirm": "确认",
        "component.button.cancel": "取消",
        "component.button.approve": "授权",
        "component.button.deny": "拒绝",
        "component.button.update": "更新",
        "component.button.delete": "删除",
        "component.button.edit": "编辑",
        "component.button.preview": "预览",
        "component.button.see_all": "查看全文",
        "component.button.create": "创建",
        "component.button.next": "下一步",
        "component.button.scroll_up": "回到顶部",
        "component.button.clear_edit": "清空编辑",
        "component.comment.title": "评论",
        "component.comment.placeholder": "留下你的看法",
        "component.comment.submit": "添加回复",
        "component.comment.reply": "回复",
        "component.comment.delete": "删除",
        "component.comment.delete_title": "删除评论",
        "component.comment.delete_confirmation": "删除后的评论不可恢复，你确定要删除吗？",
        "component.footer.nothing_more": "没有更多了",


        // Toasts.
        // pattern: toast.<model>.<info>
        "toast.user.general_error": "找不到该用户，请检查",
        "toast.user.invalid_token_error": "请先登录",
        "toast.user.sign_in_successfully": "登录成功",
        "toast.user.sign_in_failed": "登录失败",
        "toast.user.deny_consent": "请授权以完成注册",
        "toast.user.update_successfully": "更新成功",
        "toast.user.update_failed": "更新失败",
        "toast.user.upload_avatar_failed": "头像更新失败",
        "toast.user.upload_exist_account": "相同的账户已存在",
        "toast.user.account_not_found": "该账户不存在",
        "toast.user.error_OTP": "错误的验证码",
        "toast.user.expired_OTP": "验证码已经失效",
        "toast.user.password_not_change": "新的密码不能和旧的密码一样",
        "toast.user.old_password_error": "旧的密码不对",
        "toast.client.invalid": "非法客户端！",
        "toast.client.incorrect_url": "客户端redirectUri错误！",
        "toast.post.title_empty": "标题不能为空",
        "toast.post.content_empty": "正文不能为空",
        "toast.post.title_too_long": "标题不能长于100字",
        "toast.post.content_too_short": "正文不能短于150字",
        "toast.article.save_successfully": "成功保存你的文章",
        "toast.article.delete_successfully": "成功删除你的文章",
        "toast.article.invalid_author": "你并非本文的作者！",
        "toast.article.not_found": "不存在的文章！",
        "toast.article.insert_image_failed": "图片插入失败",
        "toast.user.attack_alert": "侦测到非法攻击",
        "toast.user.email": "这不是一个合法的邮箱",
        "toast.user.email_not_found": "找不到该邮箱",
        "toast.user.password_error": "密码错误",
        "toast.user.password_too_short": "密码不能短于6个字符",
        "toast.user.password_empty": "密码不能为空",
        "toast.user.confirm_password": "密码不一致",
        "toast.user.name": "名字不能为空",
        "toast.user.gender": "这不是一个合法的性别",
        "toast.user.otp_send_failed": "验证码发送失败！",
        "toast.user.preferences.editor_type": "这不是一个合法的编辑器类型",
        "toast.comment.content_empty": "评论不能为空",
        "toast.comment.add_successfully": "评论成功",
        "toast.comment.add_failed": "评论失败",
        "toast.comment.delete_parent": "抱歉，你不能删除一个有人回复过的评论",
        "toast.comment.delete_successfully": "删除成功",
        "toast.comment.delete_failed": "删除失败",
        "toast.notification.not_found": "找不到这条通知",
        "toast.thread.add_successfully": "你的帖子发表成功",
        "toast.thread.add_failed": "你的帖子发表失败",
        "toast.thread.delete_successfully": "你的帖子已删除",
        "toast.thread.delete_failed": "你的帖子删除失败"
    }
};

export default TRANSLATION;