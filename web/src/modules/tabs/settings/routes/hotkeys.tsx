import Title from "components/Primitive/Title";
import { Card, CardContent, CardTitle } from "components/Card/Card";
import { CardsGrid } from "components/Card/CardsGrid";
import { useCommands } from "hooks";

export default function HotkeysRoute() {
  const { commands, loadedCommands } = useCommands();

  // TODO(marc2332): Ability to add shortcuts

  return (
    <div>
      <Title>Hotkeys</Title>
      <CardsGrid>
        {Object.keys(commands).map((commandID) => {
          const command = commands[commandID];
          const { name } = loadedCommands[commandID];
          return (
            <Card key={commandID} title={commandID} tabIndex={1}>
              <CardTitle>
                {name}
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
