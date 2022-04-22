/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import { Joi } from "@docusaurus/utils-validation";
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
} from "@docusaurus/types";

export interface Options {}

export interface PluginOptions {
  mainScript?: string;
}

export default function pluginZaraz(
  context: LoadContext,
  options: PluginOptions
): Plugin {
  const { mainScript } = options;
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "docusaurus-plugin-zaraz",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              referrerPolicy: "origin",
              src: mainScript ?? "/cdn-cgi/zaraz/i.js",
            },
          },
        ],
      };
    },
  };
}

// const pluginOptionsSchema = Joi.object<PluginOptions>({
//   mainScript: Joi.string().optional(),
// });

// export function validateOptions({
//   validate,
//   options,
// }: OptionValidationContext<Options, PluginOptions>): PluginOptions {
//   return validate(pluginOptionsSchema, options);
// }
