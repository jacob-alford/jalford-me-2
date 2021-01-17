import styled from "styled-components";
import * as Eq from "fp-ts/lib/Eq";
import { C } from "front-end/utils/C";

const Aligner = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  margin: 0px 12px 0px 12px;
  max-width: calc(100% - 24px);
  width: 650px;
`;

interface PageContainerProps {
  children: Array<JSX.Element>;
}

const pageContainerEq: Eq.Eq<PageContainerProps> = Eq.getStructEq({
  children: { equals: () => true }
});

export const PageContainer = C<PageContainerProps>(pageContainerEq, ({ children }) => (
  <Aligner>
    <Container>{children}</Container>
  </Aligner>
));
