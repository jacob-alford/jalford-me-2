import { Header } from "front-end/components/Header";
import { S } from "front-end/utils/S";
import { Layout } from "front-end/components/Layout";
import { QuickLinks } from "front-end/components/QuickLinks";

export const App = S(() => (
  <Layout>
    <QuickLinks />
    <Header />
  </Layout>
));

export default App;
