/* empty css                           */import { e as createAstro, f as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, h as addAttribute, u as unescapeHTML, i as renderComponent, F as Fragment, j as renderSlot, k as renderHead } from '../astro_44e0fc7b.mjs';
import 'clsx';
import { optimize } from 'svgo';

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({


});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({


});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$9 = createAstro();
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/node_modules/astro-icon/lib/Icon.astro", void 0);

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$8 = createAstro();
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet> ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)} </svg>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/node_modules/astro-icon/lib/Spritesheet.astro", void 0);

const $$Astro$7 = createAstro();
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/node_modules/astro-icon/lib/SpriteProvider.astro", void 0);

const $$Astro$6 = createAstro();
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}> ${title ? renderTemplate`<title>${title}</title>` : ""} <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use> </svg>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/node_modules/astro-icon/lib/Sprite.astro", void 0);

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$5 = createAstro();
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    size = "md",
    style = "primary",
    block,
    class: className,
    icon,
    id = "",
    ...rest
  } = Astro2.props;
  const sizes = {
    sm: "px-3 py-1",
    md: "px-5 py-2.5",
    lg: "px-6 py-3"
  };
  const styles = {
    primary: "bg-accent1 font-body text-lg text-background capitalize border-2 border-transparent rounded-md text-center border-accent1 hover:bg-background hover:text-accent1 font-bold"
  };
  return renderTemplate`${maybeRenderHead()}<button type="button"${spreadAttributes(rest)}${addAttribute([block && "w-full", sizes[size], styles[style], className], "class:list")}> ${icon && icon.side === "left" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon.name, "height": "24", "width": "24" })}`} ${renderSlot($$result, $$slots["default"])} ${icon && icon.side === "right" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon.name, "height": "24", "width": "24" })}`} </button>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/components/Button.astro", void 0);

const $$Astro$4 = createAstro();
const $$Input = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Input;
  const { id, label, placeholder, required, type, name } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="p-4 md:mb-4 md:mt-20"> <h3 class="font-body text-text text-lg leading-6 pt-3 text-center pb-2 font-bold">${label}</h3> <input class="border-text border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent2 w-full"${addAttribute(id, "id")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(type, "type")}${addAttribute(name, "name")}> </div>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/components/Input.astro", void 0);

const $$Astro$3 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  const socials = [
    {
      account: "Github",
      path: "https://github.com/sarahJDawns"
    },
    {
      account: "X",
      path: "https://twitter.com/sjdawns"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-background font-body text-text uppercase flex"> <div class="flex flex-col md:flex-row items-center md:justify-between mx-auto mt-3 mb-3 w-full"> <ul class="flex flex-row gap-10"> ${socials.map((item) => renderTemplate`<li class="flex flex-row"> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:spiral-bold", "width": "15", "height": "15", "class": "text-accent2 mt-5 mr-3" })} <a aria-label="navigation link"${addAttribute(item.path, "href")} target="_blank" class="font-body text-text hover:text-accent1 py-5 text-xs font-regular uppercase"> ${item.account} </a> </li>`)} </ul> <p class="text-text py-5 text-xs font-normal">
Copyright &copy; ${( new Date()).getFullYear()} | All rights reserved.
</p> </div> </footer>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/components/Footer.astro", void 0);

const $$Astro$2 = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  const {
    title = "Macro Meal Recipe Finder",
    description = "Search for recipes by macro nutrients.",
    image
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header> <div class="flex flex-row justify-start p-4"> ${renderComponent($$result, "Icon", $$Icon, { "name": "icon-park-outline:cook", "width": "50", "height": "50", "class": "text-accent2" })} <h1 class="text-xl md:text-4xl text-text font-body font-bold py-2 px-4">${title}</h1> </div> </header>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/components/Header.astro", void 0);

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Macro Meal Recipe Finder",
    description = "Search for recipes by macro nutrients.",
    image
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Sans&family=Hedvig+Letters+Serif:opsz@12..24&display=swap" rel="stylesheet"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta property="og:title"${addAttribute(image, "content")}><title>${title}</title>${renderHead()}</head> <body class="container mx-auto bg-background"> ${renderComponent($$result, "Header", $$Header, {})} <h2 class="text-xl md:text-2xl text-center font-body text-text2 mt-20 mb-20 md:mb-0">${description}</h2> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/layouts/Layout.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate(_a || (_a = __template(["", ' <script type="module">\n  const inputs = document.querySelectorAll("input");\n  const searchButton = document.querySelector("button.searchButton");\n  const clearButton = document.querySelector("button.clearButton");\n  const errorMessage = document.querySelector(".errorMessage");\n  const displayDiv = document.querySelector(".display");\n\n  const apiKey = "2fd96c48de8b49a7a03a8258cb64052b";\n\n  searchButton.addEventListener("click", function () {\n    const isEmpty = Array.from(inputs).some((input) => input.value === "");\n\n    if (isEmpty) {\n      errorMessage.textContent = "Please enter search criteria.";\n    } else {\n      errorMessage.textContent = "";\n      const [maxCalories, maxCarbs, maxFat, minProtein] = Array.from(\n        inputs\n      ).map((input) => input.value);\n      getRecipesWithMacros(maxCalories, maxCarbs, maxFat, minProtein);\n    }\n  });\n\n  clearButton.addEventListener("click", () => {\n    inputs.forEach((input) => (input.value = ""));\n  });\n\n  async function getRecipesWithMacros(\n    maxCalories,\n    maxCarbs,\n    maxFat,\n    minProtein\n  ) {\n    try {\n      const url = `https://api.spoonacular.com/recipes/complexSearch?number=2&addRecipeInformation=true&instructionsRequired=true&apiKey=${apiKey}&maxCarbs=${maxCarbs}&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;\n      const response = await fetch(url);\n      const data = await response.json();\n\n      const { results } = data;\n\n      displayDiv.innerHTML = "";\n\n      for (const recipe of results) {\n        const { image, nutrition, title, analyzedInstructions } = recipe;\n\n        const calories = nutrition.nutrients[0].amount;\n        const protein = nutrition.nutrients[1].amount;\n        const fat = nutrition.nutrients[2].amount;\n        const carbs = nutrition.nutrients[3].amount;\n\n        const html = `\n        <div class="md:w-1/2 w-3/4 p-4 items-center w-full">\n          <div class="border border-text2 p-2 ">\n          <h2 class="text-2xl font-bold mt-4 mb-2 font-body text-text ">${title}</h2>\n          <img src="${image}" alt="${title}" >\n          <div class="flex flex-row flex-wrap gap-2 mt-2">\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Calories:</strong> ${calories} kcal</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Carbs:</strong> ${carbs} g</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Fat:</strong> ${fat} g</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Protein:</strong> ${protein} g</p>\n          </div>\n          <p class="font-body text-text2 mt-4 mb-2">${analyzedInstructions[0].steps\n          .map((step) => step.step)\n          .join(" ")}</p>\n          </div>\n        </div>\n      `;\n        displayDiv.innerHTML += html;\n      }\n    } catch (error) {\n      console.error(error);\n    }\n  }\n<\/script>'], ["", ' <script type="module">\n  const inputs = document.querySelectorAll("input");\n  const searchButton = document.querySelector("button.searchButton");\n  const clearButton = document.querySelector("button.clearButton");\n  const errorMessage = document.querySelector(".errorMessage");\n  const displayDiv = document.querySelector(".display");\n\n  const apiKey = "2fd96c48de8b49a7a03a8258cb64052b";\n\n  searchButton.addEventListener("click", function () {\n    const isEmpty = Array.from(inputs).some((input) => input.value === "");\n\n    if (isEmpty) {\n      errorMessage.textContent = "Please enter search criteria.";\n    } else {\n      errorMessage.textContent = "";\n      const [maxCalories, maxCarbs, maxFat, minProtein] = Array.from(\n        inputs\n      ).map((input) => input.value);\n      getRecipesWithMacros(maxCalories, maxCarbs, maxFat, minProtein);\n    }\n  });\n\n  clearButton.addEventListener("click", () => {\n    inputs.forEach((input) => (input.value = ""));\n  });\n\n  async function getRecipesWithMacros(\n    maxCalories,\n    maxCarbs,\n    maxFat,\n    minProtein\n  ) {\n    try {\n      const url = \\`https://api.spoonacular.com/recipes/complexSearch?number=2&addRecipeInformation=true&instructionsRequired=true&apiKey=\\${apiKey}&maxCarbs=\\${maxCarbs}&minProtein=\\${minProtein}&maxCalories=\\${maxCalories}&maxFat=\\${maxFat}\\`;\n      const response = await fetch(url);\n      const data = await response.json();\n\n      const { results } = data;\n\n      displayDiv.innerHTML = "";\n\n      for (const recipe of results) {\n        const { image, nutrition, title, analyzedInstructions } = recipe;\n\n        const calories = nutrition.nutrients[0].amount;\n        const protein = nutrition.nutrients[1].amount;\n        const fat = nutrition.nutrients[2].amount;\n        const carbs = nutrition.nutrients[3].amount;\n\n        const html = \\`\n        <div class="md:w-1/2 w-3/4 p-4 items-center w-full">\n          <div class="border border-text2 p-2 ">\n          <h2 class="text-2xl font-bold mt-4 mb-2 font-body text-text ">\\${title}</h2>\n          <img src="\\${image}" alt="\\${title}" >\n          <div class="flex flex-row flex-wrap gap-2 mt-2">\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Calories:</strong> \\${calories} kcal</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Carbs:</strong> \\${carbs} g</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Fat:</strong> \\${fat} g</p>\n            <p class="font-body text-sm text-text2 flex-grow"><strong>Protein:</strong> \\${protein} g</p>\n          </div>\n          <p class="font-body text-text2 mt-4 mb-2">\\${analyzedInstructions[0].steps\n          .map((step) => step.step)\n          .join(" ")}</p>\n          </div>\n        </div>\n      \\`;\n        displayDiv.innerHTML += html;\n      }\n    } catch (error) {\n      console.error(error);\n    }\n  }\n<\/script>'])), renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container flex w-full flex-col"> <section> <div class="flex flex-col md:flex-row items-center justify-around"> ${renderComponent($$result2, "Input", $$Input, { "id": "calories", "type": "number", "name": "calories", "label": "Calories", "placeholder": "Enter max", "required": "true" })} ${renderComponent($$result2, "Input", $$Input, { "id": "carbs", "type": "number", "name": "carbs", "label": "Carbohydrates", "placeholder": "Enter max", "required": "true" })} ${renderComponent($$result2, "Input", $$Input, { "id": "fat", "type": "number", "name": "fat", "label": "Fat", "placeholder": "Enter max", "required": "true" })} ${renderComponent($$result2, "Input", $$Input, { "id": "protein", "type": "number", "name": "protein", "label": "Protein", "placeholder": "Enter min", "required": "true" })} </div> <div class="flex flex-row justify-center gap-4 mt-10 md:mt-0"> ${renderComponent($$result2, "Button", $$Button, { "style": "primary", "size": "sm", "class": "flex searchButton", "id": "search" }, { "default": ($$result3) => renderTemplate`
Search!
` })} ${renderComponent($$result2, "Button", $$Button, { "style": "primary", "size": "sm", "class": "flex clearButton", "id": "clear" }, { "default": ($$result3) => renderTemplate`
Clear!
` })} </div> <div class="p-5"> <p class="errorMessage text-text2 font-bold text-lg mt-10 flex flex-row text-center justify-center uppercase"></p> </div> </section> <section> <div class="display md:flex-row flex flex-col flex-wrap items-center w-full mb-10 min-h-[400px]" id="display"></div> </section> </main> ` }));
}, "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/pages/index.astro", void 0);

const $$file = "C:/Users/sarah/Documents/github/current-repos/macro-meal-recipe-finder/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
