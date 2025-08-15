
  const miniCSSStyleElem = document.createElement("style");
  miniCSSStyleElem.textContent=`#bm-overlay{position:fixed;background-color:#153063e6;color:#fff;padding:10px;border-radius:8px;z-index:9000;transition:all .3s ease,transform 0s;max-width:300px;width:auto;will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d;-webkit-transform-style:preserve-3d}#bm-contain-userinfo,#bm-overlay hr,#bm-contain-automation,#bm-contain-buttons-action{transition:opacity .2s ease,height .2s ease}div#bm-overlay{font-family:Roboto Mono,Courier New,Monaco,DejaVu Sans Mono,monospace,Arial;letter-spacing:.05em}#bm-bar-drag{margin-bottom:.5em;background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5"><circle cx="3" cy="3" r="1.5" fill="CornflowerBlue" /></svg>') repeat;cursor:grab;width:100%;height:1em}#bm-bar-drag.dragging{cursor:grabbing}#bm-overlay:has(#bm-bar-drag.dragging){pointer-events:none;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}#bm-bar-drag.dragging{pointer-events:auto}#bm-contain-header{margin-bottom:.5em}#bm-contain-header[style*="text-align: center"]{display:flex;flex-direction:column;align-items:center;justify-content:center}#bm-overlay[style*="padding: 5px"]{width:auto!important;max-width:300px;min-width:200px}#bm-overlay img{display:inline-block;height:2.5em;margin-right:1ch;vertical-align:middle;transition:opacity .2s ease}#bm-contain-header[style*="text-align: center"] img{display:block;margin:0 auto}#bm-bar-drag{transition:margin-bottom .2s ease}#bm-overlay h1{display:inline-block;font-size:x-large;font-weight:700;vertical-align:middle}#bm-contain-automation input[type=checkbox]{vertical-align:middle;margin-right:.5ch}#bm-contain-automation label{margin-right:.5ch}.bm-help{border:white 1px solid;height:1.5em;width:1.5em;margin-top:2px;text-align:center;line-height:1em;padding:0!important}#bm-button-coords{vertical-align:middle}#bm-button-coords svg{width:50%;margin:0 auto;fill:#111}div:has(>#bm-button-teleport){display:flex;gap:.5ch}#bm-button-favorite svg,#bm-button-template svg{height:1em;margin:2px auto 0;text-align:center;line-height:1em;vertical-align:bottom}#bm-contain-coords input[type=number]{appearance:auto;-moz-appearance:textfield;width:5.5ch;margin-left:1ch;background-color:#0003;padding:0 .5ch;font-size:small}#bm-contain-coords input[type=number]::-webkit-outer-spin-button,#bm-contain-coords input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}#bm-contain-buttons-template{display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:center;align-items:center;gap:1ch}div:has(>#bm-input-file-template)>button{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#bm-input-file-template,input[type=file][id*=template]{display:none!important;visibility:hidden!important;position:absolute!important;left:-9999px!important;top:-9999px!important;width:0!important;height:0!important;opacity:0!important;z-index:-9999!important;pointer-events:none!important}#bm-output-status{font-size:small;background-color:#0003;padding:0 .5ch;height:3.75em;width:100%}#bm-contain-buttons-action{display:flex;justify-content:space-between}#bm-overlay small{font-size:x-small;color:#d3d3d3}#bm-contain-userinfo,#bm-contain-automation,#bm-contain-coords,#bm-contain-buttons-template,div:has(>#bm-input-file-template),#bm-output-status{margin-top:.5em}#bm-overlay button{background-color:#144eb9;border-radius:1em;padding:0 .75ch}#bm-overlay button:hover,#bm-overlay button:focus-visible{background-color:#1061e5}#bm-overlay button:active,#bm-overlay button:disabled{background-color:#2e97ff}#bm-overlay button:disabled{text-decoration:line-through}
`;
  document.body.appendChild(miniCSSStyleElem);

document.querySelector("body").innerHTML += `<!-- body -->
<div id="bm-overlay" style="top: 10px; right: 75px">
  <header id="bm-contain-header">
    <div id="bm-bar-drag">
      <img
        src="https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/main/dist/assets/Favicon.png"
        alt="Blue Marble Icon - Click to minimize/maximize"
        style="cursor: pointer"
        onclick="VAR_clickfunc"
      />
      <h1>VAR_name</h1>
    </div>
    <hr />
    <div id="bm-contain-userinfo">
      <p id="bm-user-name">Name:</p>
      <p id="bm-user-droplets">Droplets:</p>
      <p id="bm-user-nextlevel">Next level in...</p>
    </div>
    <hr />
    <section id="bm-contain-automation">
      <div id="bm-contain-coords">
        <button id="bm-button-coords" class="bm-help" style="margin-top: 0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 6">
            <circle cx="2" cy="2" r="2"></circle>
            <path d="M2 6 L3.7 3 L0.3 3 Z"></path>
            <circle cx="2" cy="2" r="0.7" fill="white"></circle>
          </svg>
        </button>
        <input
          type="number"
          id="bm-input-tx"
          placeholder="Tl X"
          min="0"
          max="2047"
          step="1"
          required="true"
        />
        <input
          type="number"
          id="bm-input-ty"
          placeholder="Tl Y"
          min="0"
          max="2047"
          step="1"
          required="true"
        />
        <input
          type="number"
          id="bm-input-px"
          placeholder="Px X"
          min="0"
          max="2047"
          step="1"
          required="true"
        />
        <input
          type="number"
          id="bm-input-py"
          placeholder="Px Y"
          min="0"
          max="2047"
          step="1"
          required="true"
        />
      </div>
      <label>
        Upload Template
        <input
          id="bm-input-file-template"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/bmp, image/gif"
        />
      </label>
      <div id="bm-contain-buttons-template">
        <button id="bm-button-enable">Enable</button>
        <button id="bm-button-create">Create</button>
        <button id="bm-button-disable">Disable</button>
      </div>
      <textarea id="overlayMain.outputStatusId" placeholder="Status: Sleeping...\nVersion: {version}" readonly></textarea>
      <div id="bm-contain-buttons-action">
        <button id="bm-button-convert" class="bm-help" title="Template Color Converter">🎨</button>
        <p style="margin-top: auto">Made by SwingTheVine</p>
      </section>
    </div>
  </header>
</div>
`;