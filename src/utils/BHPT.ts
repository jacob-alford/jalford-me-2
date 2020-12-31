import * as TE from "fp-ts/lib/TaskEither";

export interface BHPT<Bo, Hd, Pm, Tk> {
  body: Bo;
  headers: Hd;
  params: Pm;
  token: Tk;
}

export const mapBo = <A, B>(f: (a: A) => B) => <Hd, Pm, Tk>(
  fa: BHPT<A, Hd, Pm, Tk>
): BHPT<B, Hd, Pm, Tk> => ({
  body: f(fa.body),
  headers: fa.headers,
  params: fa.params,
  token: fa.token
});

export const mapHd = <A, B>(f: (a: A) => B) => <Bo, Pm, Tk>(
  fa: BHPT<Bo, A, Pm, Tk>
): BHPT<Bo, B, Pm, Tk> => ({
  body: fa.body,
  headers: f(fa.headers),
  params: fa.params,
  token: fa.token
});

export const mapPm = <A, B>(f: (a: A) => B) => <Bo, Hd, Tk>(
  fa: BHPT<Bo, Hd, A, Tk>
): BHPT<Bo, Hd, B, Tk> => ({
  body: fa.body,
  headers: fa.headers,
  params: f(fa.params),
  token: fa.token
});

export const mapTk = <A, B>(f: (a: A) => B) => <Bo, Hd, Pm>(
  fa: BHPT<Bo, Hd, Pm, A>
): BHPT<Bo, Hd, Pm, B> => ({
  body: fa.body,
  headers: fa.headers,
  params: fa.params,
  token: f(fa.token)
});

export type Handler = <B, H, P, T, E, A>(bhpt: BHPT<B, H, P, T>) => TE.TaskEither<E, A>;
