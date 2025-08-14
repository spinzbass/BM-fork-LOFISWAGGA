import { Context } from "./types";
import { getGMResourceText } from "./utils";

/** Injects code into the client
 * This code will execute outside of TamperMonkey's sandbox
 * @param {*} callback - The code to execute
 * @since 0.11.15
 */
function inject(callback: Function, context: Context) {
    const script: HTMLScriptElement = document.createElement('script');
    script.textContent = `(${callback})(${JSON.stringify(context)});`;
    document.documentElement?.appendChild(script);
    script.remove();
}


const context: Context = {};

// Needs to be wrapped in async functionality to keep synchronous flow with the async GM functions
(async () => {

    context.HTMLData = await getGMResourceText("HTML-BM-File");
    context.CSSUrl = await GM.getResourceUrl("CSS-BM-File");

    /** What code to execute instantly in the client (webpage) to spy on fetch calls.
     * This code will execute outside of TamperMonkey's sandbox.
     * @since 0.11.15
    */
    inject((ctx: Context) => {
        console.log("Test", ctx)

        const link: HTMLLinkElement = document.createElement("link") // Create element in order to link css
        link.rel = "stylesheet";
        link.href = ctx.CSSUrl || "";
        document.head.appendChild(link); // Links the css to the document

        document.body.innerHTML += ctx.HTMLData; // Inserts the raw html into body

    }, context);
})();