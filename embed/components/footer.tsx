import cn from "classnames";
import Image from "next/image";
import { HTMLProps, useState } from "react";
import { useForm } from "react-hook-form";
import ghSrc from "../public/assets/img/gh.svg";
import inSrc from "../public/assets/img/in.svg";
import sendSrc from "../public/assets/img/send.svg";
import twSrc from "../public/assets/img/tw.svg";
import logoSrc from "../public/logo.svg";
import styles from "./footer.module.css";

const year = new Date().getFullYear();

const links = {
  primary: [
    { href: "https://docs.zuplo.com/", name: "Docs" },
    { href: `https://zuplo.com/about`, name: "About Us" },
    { href: "#", name: "Contact Us" }, // TODO: Contact modal
    { href: "https://zuplo.com/careers", name: "Careers" },
  ],
  secondary: [
    {
      href: "https://zuplo.com/legal/privacy-policy",
      name: "Privacy Policy",
    },
    { href: "#", name: "Terms of Service" }, // TODO: Empty on the zuplo.com too
  ],
  socials: [
    { href: "https://github.com/zuplo", src: ghSrc },
    { href: "https://twitter.com/zuplo", src: twSrc },
    { href: "https://www.linkedin.com/company/zuplo/", src: inSrc },
  ],
};

const trimMessage = (message: string) =>
  message.endsWith('"') && message.startsWith('"')
    ? message.slice(1, -1)
    : message;

const Newsletter = (props: HTMLProps<HTMLDivElement>) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      validator: "",
    },
  });

  const onSubmit = async ({
    email,
    validator,
  }: {
    email: string;
    validator: string;
  }) => {
    setIsSuccess(false);
    const result = await fetch(
      "https://zuplo-www-mktg.zuplo.workers.dev/new-contact",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, validator }),
      }
    );
    if (result.status === 200) {
      setIsSuccess(true);
    } else {
      const message = await result.text();
      setError("email", { message: trimMessage(message) });
    }
  };

  return (
    <div {...props}>
      <label htmlFor="email" className="font-fancy text-lg mb-4 block">
        Join Our Newsletter
      </label>
      <form className="w-80 relative" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("validator")} />
        {isSuccess ? (
          <div className="flex flex-col">
            <h5 className="text-pink text-xl">Thank you!</h5>
            <h6 className="text-xl">Your submission has been sent.</h6>
          </div>
        ) : (
          <>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Your Email"
              className="transition-all hover:border-pink hover:border-2 focus:outline-0 focus:bg-white focus:text-black rounded-2xl border-gray-600 p-4 w-full border h-16 bg-black placeholder:font-light placeholder:text-gray-600 text-lg"
            />
            <div className="absolute top-0.5 right-0">
              <button
                type="submit"
                className="h-16 w-16 transition-opacity hover:opacity-50"
              >
                <Image src={sendSrc} />
              </button>
            </div>
            {errors.email && (
              <div className="mt-3 bg-pink bg-opacity-25 rounded-lg p-3 font-light leading-7 text-opacity-80 text-white">
                {errors.email.message}
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export const Footer = () => (
  <div
    className={cn(
      "grid gap-5 text-white mx-auto justify-between w-full max-w-screen-xl px-5 py-14 text-gray-500 text-sm py-10",
      styles.root
    )}
  >
    <a href="https://zuplo.com" className={styles.logo}>
      <Image src={logoSrc} />
    </a>
    <Newsletter
      className={cn("mt-6 md:mb-10 md:mt-3 lg:mt-0", styles.newsletter)}
    />
    <nav
      className={cn(
        "flex flex-row flex-wrap my-5 md:my-0",
        styles.linksPrimary
      )}
    >
      {links.primary.map(({ href, name }) => (
        <a
          key={name}
          href={href}
          className="font-fancy no-underline text-lg text-white w-1/2 md:w-auto lg:w-1/2 mb-3 md:mr-7 last:md:mr-0 lg:mr-0"
        >
          {name}
        </a>
      ))}
    </nav>
    <nav className={cn("flex", styles.linksSocial)}>
      {links.socials.map(({ href, src }) => (
        <a
          key={href}
          href={href}
          className="mr-5 transition-opacity hover:opacity-50"
        >
          <Image src={src} />
        </a>
      ))}
    </nav>
    <nav className={cn("flex flex-row flex-wrap", styles.linksSecondary)}>
      {links.secondary.map(({ href, name }) => (
        <a
          href={href}
          className="font-light no-underline last:mr-0 mr-6 text-white text-xs opacity-80"
        >
          {name}
        </a>
      ))}
    </nav>
    <p className={cn("text-xs opacity-80", styles.copyright)}>
      © {year} zuplo. All right reserved.
    </p>
  </div>
);
