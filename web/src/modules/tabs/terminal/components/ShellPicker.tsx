import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TerminalShellBuilderInfo } from "services/clients/client.types";
import { Card, CardTitle } from "components/Card/Card";
import { TabText } from "features/tab/components/TabText";

interface TerminalShellPickerOptions {
  terminalBuilders: TerminalShellBuilderInfo[];
  selectBuilder: (id: string) => void;
}

export function TerminalShellPicker(
  { terminalBuilders, selectBuilder }: TerminalShellPickerOptions,
) {
  const { t } = useTranslation();
  return (
    <TerminalShellPickerContainer>
      <TabText>
        <h3>{t("messages.PickAShell")}</h3>
      </TabText>
      {terminalBuilders.map((builder) => {
        return (
          <ShellCard
            key={builder.id}
            onClick={() => selectBuilder(builder.id)}
          >
            <CardTitle>{builder.name}</CardTitle>
          </ShellCard>
        );
      })}
    </TerminalShellPickerContainer>
  );
}

const TerminalShellPickerContainer = styled.div`
    padding: 25px;
  `;

const ShellCard = styled(Card)`
    width: 130px;
    height: 50px;
    margin: 0px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  `;
