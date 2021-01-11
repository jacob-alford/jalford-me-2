import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { S } from "front-end/utils/S";
import { AppIcon } from "front-end/components/AppIcon";
import { PageTitle } from "front-end/components/PageTitle";
import { Card } from "front-end/components/Card";
import { C } from "front-end/styles/C";
import localLibrary from "front-end/assets/mui-local-library-sharp.svg";
import libraryBook from "front-end/assets/mui-library-book-sharp.svg";
import extension from "front-end/assets/mui-extension-sharp.svg";
import dialpad from "front-end/assets/mui-horizontal-split-sharp.svg";
import school from "front-end/assets/mui-school-sharp.svg";
import work from "front-end/assets/mui-work-sharp.svg";

interface App {
  label: string;
  icon: JSX.Element;
  href: string;
  id: string;
}
const app = (label: string, href: string, icon: JSX.Element): App => ({
  label,
  icon,
  href,
  id: Math.random().toString(36)
});
const featuredApps = [
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={localLibrary}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Posts",
    "/posts",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={libraryBook}
      alt="Posts"
    />
  ),
  app(
    "Puzzles",
    "/puzzles",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={extension}
      alt="Puzzles"
    />
  ),
  app(
    "RPN Calculator",
    "/rpn",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={dialpad}
      alt="RPN Calculator"
    />
  ),
  app(
    "Academic Papers",
    "/academic-papers",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={school}
      alt="Academic Papers"
    />
  ),
  app(
    "Hire Me",
    "/hire",
    <AppIcon
      background={C.container}
      onClick={() => {}}
      width={75}
      height={75}
      src={work}
      alt="Hire Me"
    />
  )
];

const FeaturedAppsCardContainer = styled.div`
  display: grid;
  grid-gap: 24px;
  justify-items: center;
  align-items: center;
  @media (max-width: 290px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (min-width: 291px) {
    grid-template-columns: repeat(2, 0.3333333333333333333333333333333333fr);
  }
  @media (min-width: 410px) {
    grid-template-columns: repeat(3, 0.5fr);
  }
  @media (min-width: 609px) {
    grid-template-columns: repeat(4, 0.25fr);
  }
`;

const LabeledIcon = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const CardContainer = styled.div`
  width: max-content;
`;

const FeaturedAppsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

export const FeaturedApps = S(() => (
  <FeaturedAppsContainer>
    <PageTitle>Apps</PageTitle>
    <CardContainer>
      <FeaturedAppsCardContainer>
        {featuredApps.map(({ label, icon, id }) => (
          <LabeledIcon key={id}>
            {icon}
            <Typography align="center" variant="caption">
              {label}
            </Typography>
          </LabeledIcon>
        ))}
      </FeaturedAppsCardContainer>
    </CardContainer>
  </FeaturedAppsContainer>
));
