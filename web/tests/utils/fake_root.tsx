import Recoilnexus from "recoil-nexus";
import { RecoilRoot, useRecoilState } from "recoil";
import React, { PropsWithChildren, useEffect } from "react";
import FakeClient from "./fake_client";
import ThemeProvider from "../../src/components/Providers/ThemeProvider";
import { clientState } from "../../src/state/state";

function RootRenderer({ children }: PropsWithChildren<any>) {
  const [client, setClient] = useRecoilState(clientState);

  useEffect(() => {
    setClient(new FakeClient());
  }, []);

  return <>{client && children}</>;
}

export default function FakeRoot({ children }: PropsWithChildren<any>) {
  return (
    <RecoilRoot>
      <Recoilnexus />
      <ThemeProvider>
        <RootRenderer>{children}</RootRenderer>
      </ThemeProvider>
    </RecoilRoot>
  );
}
