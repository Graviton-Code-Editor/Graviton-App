import Recoilnexus from "recoil-nexus";
import { clientState } from "../../src/utils/state";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import React, { PropsWithChildren, useEffect } from "react";
import FakeClient from "./fake_client";
import ThemeProvider from "../../src/components/ThemeProvider";

function RootRenderer({ children }: PropsWithChildren<any>) {
  const [client, setClient] = useRecoilState(clientState);

  useEffect(() => {
    setClient(new FakeClient());
  }, []);

  return <>{client && children}</>;
}

export default function FakeRoot({ children }: PropsWithChildren<any>) {
  //https://github.com/facebookexperimental/Recoil/issues/1726
  const RecoilRootTmp: any = RecoilRoot as any;

  return (
    <RecoilRootTmp>
      <Recoilnexus />
      <ThemeProvider>
        <RootRenderer>{children}</RootRenderer>
      </ThemeProvider>
    </RecoilRootTmp>
  );
}
