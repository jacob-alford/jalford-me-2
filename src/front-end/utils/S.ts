import { C } from "front-end/utils/C";
import { constEqTrue } from "utils/constEqTrue";

export const S = (Render: () => JSX.Element) => C<{}>(constEqTrue(), Render);
