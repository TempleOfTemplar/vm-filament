// import {MenuItem} from "vditor/dist/ts/toolbar/MenuItem";
// import {getEventName} from "vditor/dist/ts/util/compatibility";
// import {Constants} from "vditor/dist/ts/constants";
// import {uploadFiles} from "vditor/dist/ts/upload";
// import {toggleSubMenu} from "vditor/dist/ts/toolbar/setToolbar";
//
// export class UploadVariant extends MenuItem {
//     public element: HTMLElement;
//
//     constructor(vditor: IVditor, menuItem: IMenuItem) {
//         super(vditor, menuItem);
//
//         const panelElement = document.createElement("div");
//         panelElement.className = `vditor-hint${menuItem.level === 2 ? "" : " vditor-panel--arrow"}`;
//         panelElement.innerHTML = `<button data-mode="simple-upload">simple</button>
//                                   <button data-mode="scroll-detector-upload">scroll-detector</button>`;
//
//         this.element.appendChild(panelElement);
//
//         this._bindEvent(vditor, panelElement, menuItem);
//
//         let inputHTML = '<input type="file"';
//         if (vditor.options.upload.multiple) {
//             inputHTML += ' multiple="multiple"';
//         }
//         if (vditor.options.upload.accept) {
//             inputHTML += ` accept="${vditor.options.upload.accept}"`;
//         }
//         this.element.children[0].innerHTML = `${(menuItem.icon || '<svg><use xlink:href="#vditor-icon-upload"></use></svg>')}${inputHTML}>`;
//         this._bindEvent(vditor);
//     }
//
//     public _bindEvent(vditor: IVditor, panelElement: HTMLElement, menuItem: IMenuItem) {
//         const actionBtn = this.element.children[0] as HTMLElement;
//         toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
//
//         panelElement.children.item(0).addEventListener(getEventName(), (event: Event) => {
//             // wysiwyg
//             console.log("event", event)
//             // setEditMode(vditor, "wysiwyg", event);
//             event.preventDefault();
//             event.stopPropagation();
//         });
//
//         panelElement.children.item(1).addEventListener(getEventName(), (event: Event) => {
//             // ir
//             console.log("event", event)
//             // setEditMode(vditor, "ir", event);
//             event.preventDefault();
//             event.stopPropagation();
//         });
//
//         this.element.children[0].addEventListener(getEventName(), (event) => {
//             if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
//                 event.stopPropagation();
//                 event.preventDefault();
//                 return;
//             }
//         });
//         this.element.querySelector("input").addEventListener("change",
//             (event: InputEvent & { target: HTMLInputElement }) => {
//                 if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
//                     event.stopPropagation();
//                     event.preventDefault();
//                     return;
//                 }
//                 if (event.target.files.length === 0) {
//                     return;
//                 }
//                 uploadFiles(vditor, event.target.files, event.target);
//             });
//     }
// }
