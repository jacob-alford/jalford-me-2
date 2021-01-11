import _ButtonBase from "@material-ui/core/ButtonBase";
import styled from "styled-components";
import * as Eq from "fp-ts/lib/Eq";
import { C } from "front-end/styles/C";
import { C as Co } from "front-end/utils/C";

const squircle = (radius: number) => (theta: number) => ({
  x:
    Math.pow(Math.abs(Math.cos(theta)), 2 / radius) * 50 * Math.sign(Math.cos(theta)) +
    50,
  y:
    Math.pow(Math.abs(Math.sin(theta)), 2 / radius) * 50 * Math.sign(Math.sin(theta)) + 50
});

const SQUIRCLE_BORDER_RADIUS = 4;
const squirclePath = Array.from({ length: 360 })
  .map((_, i) => i)
  .map(v => v * (Math.PI / 180)) // Defined as deg => deg * Math.PI / 180 elsewhere
  .map(squircle(SQUIRCLE_BORDER_RADIUS)) // We'll use a border-radius of 4
  .map(({ x, y }) => ({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })) // Round to the ones place
  .map(({ x, y }) => `${x}% ${y}%`)
  .join(", ");

interface IconProps {
  width?: number;
  height?: number;
  background?: string;
}

const IconImg = styled.img`
  width: ${({ width }: IconProps) => width || "50px"};
  height: ${({ height }: IconProps) => height || "50px"};
  clip-path: polygon(${squirclePath}) !important;
  background-color: ${({ background }: IconProps) => background || C.container};
`;

const ButtonBase = styled(_ButtonBase)`
  clip-path: polygon(${squirclePath}) !important;
  margin: 6px !important;
`;

interface AppIconProps extends IconProps {
  src: string;
  alt: string;
  onClick: () => void;
}

const appIconEq: Eq.Eq<AppIconProps> = Eq.getStructEq<AppIconProps>({
  src: Eq.eqString,
  alt: Eq.eqString,
  width: { equals: (a, b) => a === b },
  height: { equals: (a, b) => a === b },
  background: { equals: (a, b) => a === b },
  onClick: { equals: () => true }
});

export const AppIcon = Co<AppIconProps>(
  appIconEq,
  ({ width, height, background, src, alt, onClick }) => (
    <ButtonBase onClick={onClick}>
      <IconImg
        width={width}
        height={height}
        background={background}
        src={src}
        alt={alt}
      />
    </ButtonBase>
  )
);
