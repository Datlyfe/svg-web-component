const GLOBAL = window;
const CACHE = {};
const TEMPLATE = document.createElement("template");
const usingShadyCss = () => !!GLOBAL.ShadyCSS;

TEMPLATE.innerHTML = `
<style>
:host {
  display: inline-block;
  font-size: initial;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
}
:host([size=xs]) {
    width: 0.8rem;
    height: 0.8rem;
}
:host([size=sm]) {
    width: 1.55rem;
    height: 1.55rem;
}
:host([size=md]) {
    width: 2.25rem;
    height: 2.25rem;
}
:host([size=lg]) {
    width: 3.0rem;
    height: 3.0rem;
}

:host([size]:not([size=""]):not([size=xs]):not([size=sm]):not([size=md]):not([size=lg])) {
    width: auto;
    height: auto;
}
:host([pull=left]) #icon {
    float: left;
    margin-right: .3em!important;
}
:host([pull=right]) #icon {
    float: right;
    margin-left: .3em!important;
}
:host([border=square]) #icon {
    padding: .25em;
    border: .07em solid rgba(0,0,0,.1);
    border-radius: .25em;
}
:host([border=circle]) #icon {
    padding: .25em;
    border: .07em solid rgba(0,0,0,.1);
    border-radius: 50%;
}
#icon,
svg {
  width: 100%;
  height: 100%;
}
#icon {
    box-sizing: border-box;
} 
</style>
<div id="icon"></div>`;

/**
 * A Custom Element for displaying an svg icon
 */
export class SvgWebComponent extends HTMLElement {
  /**
   * The html tag name to be use
   * @type {String}
   */
  static get tagName() {
    return "svg-icon";
  }

  static get observedAttributes() {
    return ["type", "name", "color"];
  }

  /**
   * Returns string with the svg source.
   *
   * @param {String} iconName
   *  The icon name that should be loaded.
   *
   * @return {Promise<String, Error>}
   */
  static getIconSvg(iconName) {
    if (iconName && CACHE[iconName]) {
      return CACHE[iconName];
    }

    CACHE[iconName] = new Promise((resolve, reject) => {
      if (!this.iconData[iconName]) {
        reject(
          new Error(
            `Please make sure to call the load function with the svg data`
          )
        );
        return;
      }
      resolve(this.iconData[iconName]);
    });

    return CACHE[iconName];
  }

  /**
   * Define (register) the component
   *
   * @param {String} [tagName=this.tagName]
   */
  static define(tagName) {
    tagName = tagName || this.tagName;
    if (usingShadyCss()) {
      GLOBAL.ShadyCSS.prepareTemplate(TEMPLATE, tagName);
    }
    customElements.define(tagName, this);
  }

  static load(data) {
    this.iconData = data;
  }

  constructor() {
    super();

    this.$ui = this.attachShadow({ mode: "open" });
    this.$ui.appendChild(this.ownerDocument.importNode(TEMPLATE.content, true));
    if (usingShadyCss()) {
      GLOBAL.ShadyCSS.styleElement(this);
    }
    this._state = {
      $iconHolder: this.$ui.getElementById("icon"),
      type: this.getAttribute("type")
    };
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    const $iconHolder = this._state.$iconHolder;

    switch (attr) {
      case "name":
        handleNameChange(this, oldVal, newVal);
        break;
      case "color":
        $iconHolder.style.fill = newVal || "";
        break;
    }
  }

  connectedCallback() {
    if (usingShadyCss()) {
      GLOBAL.ShadyCSS.styleElement(this);
    }
  }
}
function handleNameChange(inst, oldVal, newVal) {
  const state = inst._state;
  state.currentName = newVal;
  state.$iconHolder.textContent = "";

  if (newVal) {
    inst.constructor
      .getIconSvg(newVal)
      .then(svgData => {
        if (state.currentName === newVal) {
          state.$iconHolder.innerHTML = svgData;
        }
      })
      .catch(error => {
        console.error(`Failed to load icon: ${newVal + "\n"}${error}`); //eslint-disable-line
      });
  }
}

export default SvgWebComponent;
