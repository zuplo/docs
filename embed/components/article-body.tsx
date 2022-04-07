import { MDXRemote } from "next-mdx-remote";
import { MdxScopeContext } from "../lib/context";
import { ArticleScope } from "../lib/interfaces";
import articleStyles from "./article-styles.module.css";
import { articleComponents } from "./articles";

type Props = {
  isMdx: boolean;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter?: Record<string, any>;
  scope?: ArticleScope;
};

const ArticleBody = ({ content, frontmatter, scope, isMdx }: Props) => {
  return isMdx ? (
    <div className={`${articleStyles["markdown"]} prose min-h-fit`}>
      <MdxScopeContext.Provider value={scope}>
        <MDXRemote
          compiledSource={content}
          scope={scope}
          frontmatter={frontmatter}
          components={articleComponents}
        />
      </MdxScopeContext.Provider>
    </div>
  ) : (
    <div
      className={`${articleStyles["markdown"]} ${articleStyles["reference"]} prose min-h-fit`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ArticleBody;
