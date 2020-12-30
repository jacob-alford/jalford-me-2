export interface Known<A> {
  _tag: "Known";
  processed: A;
}

export interface Unknown {
  _tag: "Unknown";
  unprocessed: unknown;
}

export type Knowledge<A> = Known<A> | Unknown;

export const known = <A>(a: A): Known<A> => ({ _tag: "Known", processed: a });
export const notKnown = (a: unknown): Unknown => ({ _tag: "Unknown", unprocessed: a });

export const isKnown = <A>(fa: Knowledge<A>): fa is Known<A> => fa._tag === "Known";
export const isNotKnown = <A>(fa: Knowledge<A>): fa is Unknown => fa._tag === "Unknown";

export const fold = <A, B>(onKnown: (a: A) => B, onUnknown: (a: unknown) => B) => (
  fa: Knowledge<A>
): B => (isKnown(fa) ? onKnown(fa.processed) : onUnknown(fa.unprocessed));
