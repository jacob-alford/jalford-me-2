import { memo } from "react";
import * as Eq from "fp-ts/lib/Eq";

export const C = <P>(propsEq: Eq.Eq<P>, Render: (props: P) => JSX.Element) =>
  memo(Render, propsEq.equals);
