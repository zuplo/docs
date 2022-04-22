"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
exports.__esModule = true;
function pluginZaraz(context, options) {
  var mainScript = options.mainScript;
  var isProd = process.env.NODE_ENV === "production";
  return {
    name: "docusaurus-plugin-zaraz",
    injectHtmlTags: function () {
      if (!isProd) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              referrerPolicy: "origin",
              src:
                mainScript !== null && mainScript !== void 0
                  ? mainScript
                  : "/cdn-cgi/zaraz/i.js",
            },
          },
        ],
      };
    },
  };
}
exports["default"] = pluginZaraz;
// const pluginOptionsSchema = Joi.object<PluginOptions>({
//   mainScript: Joi.string().optional(),
// });
// export function validateOptions({
//   validate,
//   options,
// }: OptionValidationContext<Options, PluginOptions>): PluginOptions {
//   return validate(pluginOptionsSchema, options);
// }
