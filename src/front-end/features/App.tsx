import { Header } from "front-end/components/Header";
import { S } from "front-end/utils/S";
import { Layout } from "front-end/components/Layout";
import { QuickLinks } from "front-end/components/QuickLinks";
import { FeaturedApps } from "front-end/features/FeaturedApps";
import { PageContainer } from "front-end/components/PageContainer";

export const App = S(() => (
  <Layout>
    <QuickLinks />
    <Header />
    <PageContainer>
      <FeaturedApps />
    </PageContainer>
  </Layout>
));

export default App;
