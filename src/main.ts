function inject(callback: Function) {
    const script: HTMLScriptElement = document.createElement('script');
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
}

/** What code to execute instantly in the client (webpage) to spy on fetch calls.
 * This code will execute outside of TamperMonkey's sandbox.
 * @since 0.11.15
 */
inject(() => {
const variable: string = "Test variable";
console.log(variable);
})