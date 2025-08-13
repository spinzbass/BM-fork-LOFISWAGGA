import { Context } from "./types";
import { getGMResourceTextAsync } from "./utils";

function inject(callback: Function, ...args: any) {
    const script: HTMLScriptElement = document.createElement('script');
    script.textContent = `(${callback})(${args.map(arg => JSON.stringify(arg)).join(', ')});`;
    document.documentElement?.appendChild(script);
    script.remove();
}
/** What code to execute instantly in the client (webpage) to spy on fetch calls.
 * This code will execute outside of TamperMonkey's sandbox.
 * @since 0.11.15
*/
// declare function GM_getResourceText(resourceName: string): string;
// declare function GM_addStyle(resourceName: string): void;
// const html = GM_getResourceText('HTML-BM-FILE');

// const cssOverlay = GM_getResourceText("CSS-BM-File");
// GM_addStyle(cssOverlay);

const context: Context = {};

(async () => {
    context.HTMLData = await getGMResourceTextAsync("HTML-BM-File");
    await GM.getResourceUrl("CSS-BM-File").then((dataURL)=>{
        const base64Data = dataURL.split(',')[1];
        context.CSSData = atob(base64Data);
    });
    inject((ctx: Context) => {
        console.log("Test", ctx)
        const style: HTMLStyleElement = document.createElement("style")
        style.textContent = ctx.CSSData || "";
            document.body.appendChild(style);
        document.body.innerHTML += ctx.HTMLData;
    }, context);
})();