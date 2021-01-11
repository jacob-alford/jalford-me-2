import styled from "styled-components";
import { C } from "front-end/styles/C";

export const Card = styled.div`
  background: ${C.container};
  padding: 24px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  filter: ${C.shadow(1)};
  border: ${C.card_border("rgba(0, 0, 0, 0.1)")};
  border-radius: ${C.border_radius};
`;
