import Topic from "./Topic";

export const topics: Topic [] = [
    {
        id: "react-hooks",
        title: "React Hooks",
        schedule: new Date(2019, 7, 18),
        speaker: "Dongyu Zhao",
        speakerAvatar: require("../avatars/donz.jpg"),
        description: "Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.",
    },
    {
        id: "android-perf",
        title: "Android Performance",
        schedule: new Date(2019, 7, 25),
        speaker: "Xinguo Shui",
        speakerAvatar: require("../avatars/xishui.jpg"),
        description: "Android is the world's most popular mobile platform. It powers phones, tablets, watches, TVs, cars, and anything your imagination can dream up.",
    },
    {
        id: "web-assembly",
        title: "WebAssembly",
        schedule: new Date(2019, 8, 1),
        speaker: "Vince Liu",
        speakerAvatar: require("../avatars/xiaoml.jpg"),
        description: "WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable target for compilation of high-level languages like C/C++/Rust, enabling deployment on the web for client and server applications."
    },
    {
        id: "flutter",
        title: "Flutter",
        schedule: new Date(2019, 8, 8),
        speaker: "Yuzhe Zhou",
        speakerAvatar: require("../avatars/yuzzho.jpg"),
        description: "Flutter is Google’s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase."
    },
    {
        id: "swift",
        title: "Swift & Swift CortanaSDK",
        schedule: new Date(2019, 8, 15),
        speaker: "Fan Xia",
        speakerAvatar: require("../avatars/faxia.jpg"),
        description: "Swift is a powerful and intuitive programming language for macOS, iOS, watchOS, tvOS and beyond. Writing Swift code is interactive and fun, the syntax is concise yet expressive, and Swift includes modern features developers love. Swift code is safe by design, yet also produces software that runs lightning-fast."
    },
    {
        id: "react-router",
        title: "React Router 4",
        schedule: new Date(2019, 8, 22),
        speaker: "Huiyang Shan",
        speakerAvatar: require("../avatars/hushan.jpg"),
        description: "React Router is a collection of navigational components that compose declaratively with your application. Whether you want to have bookmarkable URLs for your web app or a composable way to navigate in React Native, React Router works wherever React is rendering--so take your pick!"
    },
    {
        id: "swift-ui",
        title: "Swift & SwiftUI",
        schedule: new Date(2019, 8, 29),
        speaker: "Eric Yang",
        speakerAvatar: require("../avatars/eryang.jpg"),
        description: "SwiftUI is an innovative, exceptionally simple way to build user interfaces across all Apple platforms with the power of Swift. Build user interfaces for any Apple device using just one set of tools and APIs. With a declarative Swift syntax that’s easy to read and natural to write, SwiftUI works seamlessly with new Xcode design tools to keep your code and design perfectly in sync. Automatic support for Dynamic Type, Dark Mode, localization, and accessibility means your first line of SwiftUI code is already the most powerful UI code you’ve ever written."
    },
];