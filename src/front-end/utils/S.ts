import { C } from "front-end/utils/C";

export const S = (Render: () => JSX.Element) => C<{}>({ equals: () => true }, Render);
