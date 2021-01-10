import { animated as a, useSpring } from "react-spring";
import styled from "styled-components";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { S } from "front-end/utils/S";
import { C } from "front-end/styles/C";
import meImg from "front-end/assets/6-20-pro-alt-1024-70.jpg";

const VSCODE_THEME = "https://marketplace.visualstudio.com/items?itemName=teabyii.ayu";

const HeaderContainer = styled.div`
  height: 33vh;
  min-height: 232px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-flow: row wrap-reverse;
  background-color: ${C.container};
  justify-content: center;
  align-items: center;
  padding: 16px 24px 16px 24px;
  width: calc(100% - 48px);
  height: calc(100% - 32px);
`;

const Me = a(styled(Avatar)`
  cursor: pointer;
  height: 200px !important;
  width: 200px !important;
  margin: 0px 24px 0px 24px;
  filter: ${C.shadow(2)} !important;
`);

const TextBlock = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  height: 100%;
  justify-content: center;
  @media (max-width: 608px) {
    text-align: center;
  }
  @media (min-width: 609px) {
    text-align: right;
  }
`;

const Name = styled(Typography)`
  color: ${C.text_constructor} !important;
`;

const LinkUrl = styled(Typography)`
  color: ${C.text_operator} !important;
  text-decoration: underline;
`;

const Description = styled(Typography)`
  max-width: 421px;
`;

export const Header = S(() => {
  const meImgStyles = useSpring({
    opacity: 1,
    transform: `scale3d(1, 1, 1)`,
    from: {
      opacity: 0,
      transform: `scale3d(0, 0, 0)`
    },
    config: {
      tension: 169,
      friction: 18,
      precision: 0.0001
    }
  });
  return (
    <HeaderContainer>
      <TextBlock>
        <Name variant="h1">Jacob Alford</Name>
        <LinkUrl variant="h2" gutterBottom>
          jalf.io
        </LinkUrl>
        <Description variant="body1" gutterBottom>
          Full Stack • Mathematics • Design • Writing
        </Description>
        <Link href={VSCODE_THEME} variant="body2">
          Get this VS Code theme
        </Link>
      </TextBlock>
      <Me
        style={meImgStyles}
        onClick={() => void (window.location.href = "mailto: jalford-website@pm.me")}
        src={meImg}
      />
    </HeaderContainer>
  );
});
