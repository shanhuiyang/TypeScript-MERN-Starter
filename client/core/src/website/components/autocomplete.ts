import { Textcomplete, Textarea } from "textcomplete";
import { AUTO_COMPLETE_MAX_CANDIDATES } from "../../shared/constants";

/**
 * Register a textarea for autocomplete, now only mention someone is supported
 * @param textComplete the textarea element
 * @param nameList the names of users
 */
export const registerAutoComplete = (textComplete: HTMLTextAreaElement, nameList: string[]): void => {
    const editor: any = new Textarea(textComplete);
    const autoCompleteContent: any = new Textcomplete(editor);
    autoCompleteContent.register([{
        match: /(.*)@(.*?)$/, // triggering of @Someone
        search: (term: string, callback: (results: string[]) => void): void => {
            callback(nameList
                .filter(name => { return name.startsWith(term); })
                .slice(0, AUTO_COMPLETE_MAX_CANDIDATES)
            );
        },
        replace: (value: string) => {
            return "$1@" + value + " ";
        }
    }]);
};