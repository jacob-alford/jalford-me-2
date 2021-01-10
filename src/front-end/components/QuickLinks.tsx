import styled from "styled-components";
import { S } from "front-end/utils/S";
import { C } from "front-end/styles/C";
import _Link from "@material-ui/core/Link";

const LinkContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const Link = styled(_Link)`
  margin: 0px 6px 0px 6px !important;
  color: ${C.text_function} !important;
`;

const GITHUB_LINK = "https://github.com/jacob-alford";
const RESUME_LINK = "https://www.visualcv.com/jacob-alford/";
const WEBSITE_SOURCE_LINK = "https://github.com/jacob-alford/jalford-me-2";

export const QuickLinks = S(() => (
  <LinkContainer>
    <Link href={GITHUB_LINK} variant="body2">
      GitHub
    </Link>
    <Link href={RESUME_LINK} variant="body2">
      Resume
    </Link>
    <Link href={WEBSITE_SOURCE_LINK} variant="body2">
      Source Code
    </Link>
  </LinkContainer>
));
