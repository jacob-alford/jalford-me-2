import { FunctionComponent } from "react";
import * as Eq from "fp-ts/lib/Eq";
import { Store, Actions } from "features/store";
import { useStoreState } from "hooks/useStoreState";
import { useDispatch } from "hooks/useDispatch";

interface ReduxComponentArgs<P, A> {
  selector: (s: Store) => A;
  eq?: Eq.Eq<A>;
  render: (args: { props: P; state: A; dispatch: (a: Actions) => void }) => JSX.Element;
}

export const makeReduxComponent = <P, A>(
  args: ReduxComponentArgs<P, A>
): FunctionComponent<P> => (props: P) => {
  const { selector, eq, render } = args;
  const state = useStoreState(selector, eq);
  const dispatch = useDispatch();
  return render({ props, state, dispatch });
};
