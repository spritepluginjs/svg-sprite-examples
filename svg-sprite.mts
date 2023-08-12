import SVGSpriter from "svg-sprite";
import { globbySync } from "globby";
import pathe from "pathe";
import fse from "fs-extra";

import type { BufferFile } from "vinyl";

const spriter = new SVGSpriter({
  dest: "output",
  mode: {
    // Usage:
    // .svg-[name] {
    //   background: url(svg/sprite.css-903d7890.svg) 0 0 no-repeat;
    //   width: 410px;
    //   height: 404px;
    // }
    css: {
      example: true,
    },
    view: {
      example: true,
    },
    // Compared to the defs mode, one of the main benefits is that you don't have to provide the viewBox attribute on every <use> element which makes it a lot easier.
    // ref: https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md#defs--symbol-mode
    defs: {
      example: true,
    },
    symbol: {
      example: true,
    },
    stack: {
      example: true,
    },
  },
});

globbySync("assets/**/*.svg", { absolute: true }).forEach((item) => {
  spriter.add(pathe.normalize(item), "", fse.readFileSync(item, { encoding: "utf-8" }));
});

const { result, data } = (await spriter.compileAsync()) as {
  result: { [mode: string]: { sprite: BufferFile } };
  data: any;
};
for (const mode of Object.values(result)) {
  for (const resource of Object.values(mode)) {
    console.log("🚀 ~ file: svg-sprite.mts:19 ~ resource.path:", resource.path);
    fse.mkdirSync(pathe.dirname(resource.path), { recursive: true });
    fse.writeFileSync(resource.path, resource.contents);
  }
}
