import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

// sd-transforms, 2nd parameter for options can be added
// See docs: https://github.com/tokens-studio/sd-transforms
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ["assets/tokens.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      transforms: ["name/camel"],
      buildPath: "shared/ui/",
      files: [
        {
          destination: "index.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
