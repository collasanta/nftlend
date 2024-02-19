import { useSDK } from "@metamask/sdk-react-ui";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { ethereumRequest } from "@/lib/utils";

export const InstallSnapButton = () => {
  const { connected } = useSDK();
  const [installed, setInstalled] = useState(false);

  interface InstallResponse {
    'npm:ntflendprotocol': {
      enabled: boolean;
    }
  }

  const installSnap = async () => {
    const install = await ethereumRequest({
      method: "wallet_requestSnaps",
      params: {
        "npm:ntflendprotocol": {},
      },
    }) as InstallResponse;

    if (install['npm:ntflendprotocol']?.enabled) {
      setInstalled(true);
      window.alert("snap installed");
    }
  };
  
  return (
    <div>
      <Button onClick={installSnap} colorScheme="orange" isDisabled={!connected || installed}>Enable Snap</Button>
    </div>
  )
}

