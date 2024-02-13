import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetaMaskUIProvider
      sdkOptions={{
        dappMetadata: {
          name: "NFT Lend",
          url: window.location.href,
        },
        infuraAPIKey: "4709535c038c423f810f0eff5f4cdfb1"
        // Other options
      }}
    >
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>,
)
