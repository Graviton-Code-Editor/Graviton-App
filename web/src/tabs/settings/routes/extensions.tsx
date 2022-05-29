import Title from "../../../components/Primitive/title";
import List from "../../../components/Primitive/List";
import TabText from "../../../components/Tabs/TabText";
import useExtensions from "../../../hooks/useExtensions";

export default function ExtensionsRoute() {
  const extensions = useExtensions();
  return (
    <div>
      <Title>Extensions</Title>
      <TabText>These are the currently loaded extensions:</TabText>
      <List>
        {extensions.map((ext) => (
          <li key={ext.extension.id}>{ext.extension.name}</li>
        ))}
      </List>
    </div>
  );
}
