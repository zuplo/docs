import { GitHubIcon } from "./ui-icons";

export default function GithubButton({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className={`clean-btn button button--primary}`}
    >
      {text} <GitHubIcon />
    </a>
  );
}
