// ==UserScript==
// @name         Blue Marble
// @namespace    https://github.com/SwingTheVine/
// @version      0.81.0
// @description  A userscript to automate and/or enhance the user experience on Wplace.live. Make sure to comply with the site's Terms of Service, and rules! This script is not affiliated with Wplace.live in any way, use at your own risk. This script is not affiliated with TamperMonkey. The author of this userscript is not responsible for any damages, issues, loss of data, or punishment that may occur as a result of using this script. This script is provided "as is" under the MPL-2.0 license. The "Blue Marble" icon is licensed under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. The image is owned by NASA.
// @author       SwingTheVine
// @license      MPL-2.0
// @supportURL   https://discord.gg/tpeBPy46hf
// @homepageURL  https://github.com/SwingTheVine/Wplace-BlueMarble
// @icon         https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/a3b4a288514dc48a9232b1aeeb6b377af6fdfe7c/dist/assets/Favicon.png
// @updateURL    https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/main/dist/BlueMarble.user.js
// @downloadURL  https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/main/dist/BlueMarble.user.js
// @run-at       document-start
// @match        *://*.wplace.live/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM_getValue
// @resource     CSS-BM-File https://raw.githubusercontent.com/AloeSapling/Wplace-BlueMarble/refs/heads/overhaul/dist/BlueMarble.user.css
// @resource     HTML-BM-File https://raw.githubusercontent.com/AloeSapling/Wplace-BlueMarble/refs/heads/overhaul/src/overlay.html
// ==/UserScript==

// Wplace  --> https://wplace.live
// License --> https://www.mozilla.org/en-US/MPL/2.0/

(()=>{var t={};(async()=>{t.t=await async function(){return fetch(await GM.getResourceUrl("HTML-BM-File")).then(t=>t.text())}(),t.o=await GM.getResourceUrl("CSS-BM-File"),function(t,n){const c=document.createElement("script");c.textContent=`(${t=>{console.log("Test",t);const n=document.createElement("link");n.rel="stylesheet",n.href=t.o||"",document.head.appendChild(n),document.body.innerHTML+=t.t}})(${JSON.stringify(n)});`,document.documentElement?.appendChild(c),c.remove()}(0,t)})()})();