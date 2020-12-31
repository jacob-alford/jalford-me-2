import { FunctionComponent } from "react";
import { useQuery, UseQueryOptions, QueryKey, QueryStatus } from "react-query";
import * as Rd from "@devexperts/remote-data-ts";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

const getRemoteData = <E, A>(
  data: undefined | E.Either<E, A>,
  error: unknown,
  status: QueryStatus,
  onUnknownError: (ue: unknown) => E
): Rd.RemoteData<E, A> => {
  if (status === "idle") return Rd.initial;
  if (data === undefined || status === "loading") return Rd.pending;
  if (status === "error") {
    console.error("Encountered the following unknown error: ", error);
    return Rd.failure(onUnknownError(error));
  }
  return pipe(
    data,
    E.fold(
      err => Rd.failure(err) as Rd.RemoteData<E, A>,
      data => Rd.success(data) as Rd.RemoteData<E, A>
    )
  );
};

export const makeAsyncComponent = <P, E, A>(args: {
  task: TE.TaskEither<E, A>;
  key: QueryKey;
  options: UseQueryOptions<E.Either<E, A>>;
  onUnknownError: (ue: unknown) => E;
  render: (
    result: Rd.RemoteData<E, A>,
    args: {
      props: P;
      refetch: () => void;
    }
  ) => JSX.Element;
}): FunctionComponent<P> => (props: P) => {
  const { task, key, options, onUnknownError, render } = args;
  const { data, error, status, refetch } = useQuery(key, task, options);
  const result = getRemoteData(data, error, status, onUnknownError);
  return render(result, { props, refetch });
};
