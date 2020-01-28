/**
 * This is modified from https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js
 */
import { Platform } from "react-native";

// this is converted to a stylesheet internally at run time with StyleSheet.create(
export const MARKDOWN_STYLES = {
    root: {
        fontSize: 18,
    },
    codeBlock: {
        borderWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 4,
    },
    codeInline: {
        borderWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 4,
    },
    em: {
        fontStyle: "italic",
    },
    // both heading and headingContainer are the same thing, here for backwards compatability
    headingContainer: {
        flexDirection: "row",
    },
    heading: {},
    heading1: {
        fontSize: 32,
        fontWeight: "bold"
    },
    heading2: {
        fontSize: 28,
        fontWeight: "bold"
    },
    heading3: {
        fontSize: 22,
        fontWeight: "bold"
    },
    heading4: {
        fontSize: 18,
        fontWeight: "bold"
    },
    heading5: {
        fontSize: 13,
    },
    heading6: {
        fontSize: 11,
    },
    text: {},
    textGroup: {},
    hr: {
        backgroundColor: "#000000",
        height: 1,
    },
    blockquote: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        backgroundColor: "#CCCCCC",
    },
    list: {},
    listItem: {
        flex: 1,
        flexWrap: "wrap",
    },
    listUnordered: {},
    listUnorderedItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    listUnorderedItemIcon: {
        marginLeft: 10,
        marginRight: 10,
        ...Platform.select({
            android: {
                marginTop: 5,
            },
            ios: {
                marginTop: 0,
            },
            default: {
                marginTop: 0,
            },
        }),
        ...Platform.select({
            ios: {
                lineHeight: 36,
            },
            android: {
                lineHeight: 30,
            },
            default: {
                lineHeight: 36,
            },
        }),
    },
    listOrdered: {},
    listOrderedItem: {
        flexDirection: "row",
    },
    listOrderedItemIcon: {
        marginLeft: 10,
        marginRight: 10,
        ...Platform.select({
            android: {
                marginTop: 4,
            },
            default: {
                marginTop: 0,
            },
        }),
        ...Platform.select({
            ios: {
                lineHeight: 36,
            },
            android: {
                lineHeight: 30,
            },
            default: {
                lineHeight: 36,
            },
        }),
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 10,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
    },
    hardbreak: {
        width: "100%",
        height: 1,
    },
    strong: {
        fontWeight: "bold",
    },
    table: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 3,
    },
    tableHeader: {},
    tableHeaderCell: {
        flex: 1,
        padding: 5,
    },
    tableRow: {
        borderBottomWidth: 1,
        borderColor: "#000000",
        flexDirection: "row",
    },
    tableRowCell: {
        flex: 1,
        padding: 5,
    },
    strikethrough: {
        textDecorationLine: "line-through",
    },
    link: {
        textDecorationLine: "underline",
    },
    blocklink: {
        flex: 1,
        borderColor: "#000000",
        borderBottomWidth: 1,
    },
    image: {
        flex: 1,
    },
};