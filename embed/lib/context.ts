import React from "react";
import { ArticleScope } from "./interfaces";

export const MdxScopeContext = React.createContext<ArticleScope>({
  embed: false,
});
