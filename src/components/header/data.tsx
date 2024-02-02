import { LinkData, LinksCategory } from "@/lib/interfaces";
import {
  blogLink,
  changeLogLink,
  comparisonLinks,
  customStories,
  docsLink,
  featuresLinks,
  pricingLink,
  signInLink,
} from "@/lib/links";

export const data = {
  navLinks: [
    docsLink,
    pricingLink,
    blogLink,
    signInLink,
  ] satisfies Array<LinkData>,
  productLinks: [
    [
      {
        name: "Features",
        links: featuresLinks,
      },
    ],
    [
      {
        name: "Resources",
        links: [customStories, changeLogLink],
      },
      {
        name: "Product Comparisons",
        links: comparisonLinks,
      },
    ],
  ] satisfies Array<Array<LinksCategory>>,
};
