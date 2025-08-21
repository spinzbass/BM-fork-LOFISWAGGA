import { dataManager } from "./main";

export function createElementWithAttributes<T extends keyof HTMLElementTagNameMap>(tagName: T, attributes?: Record<string, string>): HTMLElement{

    const elem = document.createElement(tagName);
    if(attributes) {
        Object.entries(attributes).forEach(([attr, value])=>{
            if(attr === "className") {elem.setAttribute("class", value)}
            else elem.setAttribute(attr, value);
        })
    }

    return elem;
}

export function download(data: any){

    try {
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob); // Create a web-accessible link for the templatesJSON resource (necessary for it to be downloaded)
        const anchor = document.createElement("a");
        anchor.download = "ExportJson.json"; // Default fileName of download file
        anchor.href = url; // Set the resource / download link
        anchor.click(); // Simulate clicking on a download link (starts the download)
        URL.revokeObjectURL(url); // Free the URL from memory as it's unnecessary now
    } catch (err) {
        console.error("An error occurded while exporting the templates: ", err);
    }
}

export function generateUUID(): string{

    let uuid = crypto.randomUUID();
    if(dataManager.get()){
        while(dataManager.get()?.templates.some((template)=>{template.uuid==uuid})){
            uuid = crypto.randomUUID()
        }
    }
    
    return uuid;
}