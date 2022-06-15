import Title from "../../../components/Primitive/Title";
import { Card, CardContent, CardTitle } from "../../../components/Card/Card";
import { CardsGrid } from "../../../components/Card/CardsGrid";
import useCommands from "../../../hooks/useCommands";

export default function HotkeysRoute() {
  const { commands } = useCommands();

  // TODO(marc2332): Ability to add shortcuts

  return (
    <div>
      <Title>Hotkeys</Title>
      <CardsGrid>
        {Object.keys(commands).map((commandID) => {
          const command = commands[commandID];
          return (
            <Card key={commandID} title={commandID}>
              <CardTitle>
                {command.name}
              </CardTitle>
              <CardContent>
                {command.hotkey}
              </CardContent>
            </Card>
          );
        })}
      </CardsGrid>
    </div>
  );
}
