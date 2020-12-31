import { FunctionComponent, useReducer } from "react";

interface ReducerComponentArgs<P, S, A> {
  reducer: (store: S | undefined, action: A) => S;
  init: S;
  render: (renderArgs: { store: S; props: P; dispatch: (a: A) => void }) => JSX.Element;
}
export const makeReducerComponent = <P, S, A>(
  args: ReducerComponentArgs<P, S, A>
): FunctionComponent<P> => (props: P) => {
  const { reducer, render, init } = args;
  const [store, dispatch] = useReducer(reducer, init);
  return render({ store, props, dispatch });
};
