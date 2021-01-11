import Typography from "@material-ui/core/Typography";
import * as Eq from "fp-ts/lib/Eq";
import styled from "styled-components";
import { C } from "front-end/utils/C";
import { Divider } from "front-end/components/Divider";

interface PageTitleProps {
  children: string;
}

const TitleContainer = styled.div`
  margin: 24px;
  width: calc(100% - 48px);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const TitleBox = styled.div`
  max-width: 100%;
  width: 350px;
  text-align: center;
`;

const pageTitleEq = Eq.getStructEq({
  children: Eq.eqString
});

export const PageTitle = C<PageTitleProps>(pageTitleEq, ({ children: title }) => (
  <TitleContainer>
    <TitleBox>
      <Typography variant="h3">{title}</Typography>
      <Divider />
    </TitleBox>
  </TitleContainer>
));
