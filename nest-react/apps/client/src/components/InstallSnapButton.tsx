import { useSDK } from "@metamask/sdk-react-ui";
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
      <button className={`mt-3 p-2 min-w-[100px] text-[14px]  ${!connected || installed ? "bg-gray-200 cursor-not-allowed" : "bg-blue-400"} shadow-sm text-white rounded-lg`} onClick={installSnap} disabled={!connected || installed}>Enable Snap</button>
    </div>
  )
}

