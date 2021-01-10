import { memo } from "react";
import * as Eq from "fp-ts/lib/Eq";
import { useReducer } from "react";

export const R = <P = unknown, S = unknown, A = unknown>(
  propsEq: Eq.Eq<P>,
  update: (store: S | undefined, action: A | { type: "@@INIT" }) => S,
  Render: (renderArgs: { model: S; props: P; dispatch: (a: A) => void }) => JSX.Element
) =>
  memo((props: P) => {
    const [model, dispatch] = useReducer(update, update(undefined, { type: "@@INIT" }));
    return Render({ model, props, dispatch });
  }, propsEq.equals);
