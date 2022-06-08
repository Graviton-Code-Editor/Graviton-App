import Title from "../../../components/Primitive/Title";
import TabText from "../../../components/Tabs/TabText";
import WebPackage from "../../../../package.json";

export default function AboutRoute() {
  return (
    <div>
      <Title>Graviton Editor</Title>
      <TabText>You are running v{WebPackage.version} (pre-alpha)</TabText>
      <TabText>MIT License</TabText>
    </div>
  );
}
