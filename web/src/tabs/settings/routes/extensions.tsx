import Title from "../../../components/Primitive/Title";
import TabText from "../../../components/Tabs/TabText";
import useExtensions from "../../../hooks/useExtensions";
import { Card, CardContent, CardTitle } from "../../../components/Card/Card";
import { CardsGrid } from "../../../components/Card/CardsGrid";

export default function ExtensionsRoute() {
  const extensions = useExtensions();
  return (
    <div>
      <Title>Extensions</Title>
      <TabText>Currently loaded extensions:</TabText>
      <CardsGrid>
        {extensions.map(({ extension }) => (
          <Card key={extension.id} title={extension.id} tabIndex={1}>
            <CardTitle>
              {extension.name}
            </CardTitle>
            <CardContent>
              {extension.author}
            </CardContent>
            <CardContent>
              v{extension.version}
            </CardContent>
          </Card>
        ))}
      </CardsGrid>
    </div>
  );
}
