import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

// sd-transforms, 2nd parameter for options can be added
// See docs: https://github.com/tokens-studio/sd-transforms
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ["assets/tokens.json"],
  preprocessors: ["tokens-studio"], // <-- since 0.16.0 this must be explicit
  platforms: {
    css: {
      transformGroup: "tokens-studio", // <-- apply the tokens-studio transformGroup to apply all transforms
      transforms: ["name/kebab"], // <-- add a token name transform for generating token names, default is camel
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
