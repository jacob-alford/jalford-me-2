import { constTrue } from "fp-ts/lib/function";
import * as Eq from "fp-ts/lib/Eq";

export const constEqTrue = <A>(): Eq.Eq<A> => ({ equals: constTrue });
