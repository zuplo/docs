import Image from "next/image";
import Link from "next/link";
import LogoSrc from "../public/logo.svg";

export default function Logo({
  className,
  width,
  height,
}: {
  className: string;
  width: number;
  height: number;
}) {
  return (
    <Link href={"https://zuplo.com"}>
      <a className={`hover:opacity-90 ${className}`}>
        <Image src={LogoSrc} height={height} width={width} />
      </a>
    </Link>
  );
}
