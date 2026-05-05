import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PayPalScriptProvider options={{ 
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
      currency: "EUR",
      intent: "capture"
    }}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
);
