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
      transforms: ["name/kebab"],
      buildPath: "shared/ui/",
      files: [
        {
          destination: "index.css",
          format: "css/variables",
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
