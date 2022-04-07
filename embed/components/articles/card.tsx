import cn from "classnames";
import { Duration, formatDuration } from "date-fns";
import Image, { ImageProps } from "next/image";
import { ReactNode, useState } from "react";
import cardStyles from "./card.module.css";

interface Props {
  title?: ReactNode;
  content?: ReactNode;
  image?: ImageProps["src"];
  duration?: Duration;
}

export const Card = ({ title, content, image, duration }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="not-prose flex flex-col">
      <div
        className={cn(
          cardStyles["imageContainer"],
          isLoading && cardStyles["isLoading"]
        )}
      >
        {isLoading && <div className={cardStyles["placeholder"]} />}
        {image && (
          <Image
            src={image}
            objectFit="cover"
            layout="fill"
            onLoadingComplete={() => {
              setIsLoading(false);
            }}
          />
        )}
      </div>
      {title && <h4 className="mb-1 font-bold text-lg">{title}</h4>}
      {content && <p>{content}</p>}
      {duration && (
        <p className="mt-4 opacity-60 tracking-widest font-fancy uppercase text-sm text-gray-600">
          Est. {formatDuration(duration)}
        </p>
      )}
    </div>
  );
};
