import { useSDK } from "@metamask/sdk-react-ui";
import { Button } from "./ui/button";
import { Buffer } from 'buffer';
import { useState } from "react";

export const SignButton = () => {
  const { provider, connected } = useSDK();
  const [signed, setSigned] = useState(false);
  const handleConnectAndSign = async () => {
    try {
      const accounts = await provider?.request({ method: "eth_requestAccounts" });
      const chainId = await provider?.request({ method: "eth_chainId" });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const from = accounts[0];
      const exampleMessage = `Welcome to NFTLend  
      This message proves you own this wallet address : ${from} 
      
      By signing this message you agree to our terms and conditions, available at: 
      https://nftlendexample.com/terms-and-conditions/ 
      https://nftlendexample.com/terms-of-use/ 

      ChainId : ${chainId!}
      Nonce : 98237982739`
      const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`;
      const sign = await provider?.request({
        method: "personal_sign",
        params: [msg, from],
      });
      sign && setSigned(true);
      window.alert("signedMessage: " + sign);
    } catch (err) {
      window.alert((err as Error).message);
    }
  };

  return (
    <div>
      <Button onClick={handleConnectAndSign} disabled={!connected || signed }>Sign Legal Term</Button>
    </div>
  )
}

