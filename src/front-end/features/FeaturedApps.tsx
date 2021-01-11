import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { S } from "front-end/utils/S";
import { AppIcon } from "front-end/components/AppIcon";
import { PageTitle } from "front-end/components/PageTitle";
import DS from "front-end/assets/duncan-strauss.png";
import { Card } from "front-end/components/Card";

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
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
    />
  ),
  app(
    "Mystery Novel",
    "/duncan-strauss",
    <AppIcon
      background="#F9D8A7"
      onClick={() => {}}
      width={75}
      height={75}
      src={DS}
      alt="Duncan Struass Mysteries"
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
      <Card>
        <FeaturedAppsCardContainer>
          {featuredApps.map(({ label, icon, id }) => (
            <LabeledIcon key={id}>
              {icon}
              <Typography variant="caption">{label}</Typography>
            </LabeledIcon>
          ))}
        </FeaturedAppsCardContainer>
      </Card>
    </CardContainer>
  </FeaturedAppsContainer>
));
