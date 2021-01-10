import { C } from "utils/C";

export const S = (Render: () => JSX.Element) => C<{}>({ equals: () => true }, Render);
