export interface Known<A> {
  _tag: "Known";
  value: A;
}

export interface Unknown {
  _tag: "Unknown";
  __UNSAFE__unknown: unknown;
}

export type Knowledge<A> = Known<A> | Unknown;

export const known = <A>(a: A): Known<A> => ({ _tag: "Known", value: a });
export const unknown = (a: unknown): Unknown => ({
  _tag: "Unknown",
  __UNSAFE__unknown: a
});

export const isKnown = <A>(fa: Knowledge<A>): fa is Known<A> => fa._tag === "Known";
export const isUnknown = <A>(fa: Knowledge<A>): fa is Unknown => fa._tag === "Unknown";

export const fold = <A, B>(onKnown: (a: A) => B, onUnknown: (a: unknown) => B) => (
  fa: Knowledge<A>
): B => (isKnown(fa) ? onKnown(fa.value) : onUnknown(fa.__UNSAFE__unknown));
