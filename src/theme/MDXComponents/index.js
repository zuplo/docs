/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MDXA from "@theme/MDXComponents/A";
import MDXCode from "@theme/MDXComponents/Code";
import MDXDetails from "@theme/MDXComponents/Details";
import MDXHead from "@theme/MDXComponents/Head";
import MDXHeading from "@theme/MDXComponents/Heading";
import MDXImg from "@theme/MDXComponents/Img";
import MDXPre from "@theme/MDXComponents/Pre";
import MDXUl from "@theme/MDXComponents/Ul";
import React from "react";
import CtaButton from "../../components/CtaButton";
import PolicyConfig from "../../components/PolicyConfig";
import PolicyExample from "../../components/PolicyExample";
import PolicyOptions from "../../components/PolicyOptions";
import PolicyStatus from "../../components/PolicyStatus";
import SizedImage from "../../components/SizedImage";
import {
  ApiTestConsoleTabIcon,
  BuildStatusTabIcon,
  CodeEditorTabIcon,
  DashboardTabIcon,
  GithubIcon,
  LiveLogsTabIcon,
  SettingsTabIcon,
} from "../../components/ui-icons";
import ZupIt from "../../components/ZupIt";

const MDXComponents = {
  head: MDXHead,
  code: MDXCode,
  a: MDXA,
  pre: MDXPre,
  details: MDXDetails,
  ul: MDXUl,
  img: MDXImg,
  h1: (props) => <MDXHeading as="h1" {...props} />,
  h2: (props) => <MDXHeading as="h2" {...props} />,
  h3: (props) => <MDXHeading as="h3" {...props} />,
  h4: (props) => <MDXHeading as="h4" {...props} />,
  h5: (props) => <MDXHeading as="h5" {...props} />,
  h6: (props) => <MDXHeading as="h6" {...props} />,
  PolicyConfig,
  PolicyExample,
  PolicyOptions,
  ZupIt,
  CodeEditorTabIcon,
  BuildStatusTabIcon,
  SettingsTabIcon,
  CodeEditorTabIcon,
  DashboardTabIcon,
  ApiTestConsoleTabIcon,
  LiveLogsTabIcon,
  GithubIcon,
  PolicyStatus,
  SizedImage,
  CtaButton,
};
export default MDXComponents;
