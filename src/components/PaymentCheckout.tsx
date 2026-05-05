import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';

interface PaymentCheckoutProps {
  amount: string;
  description: string;
  onSuccess: (details: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function PaymentCheckout({ amount, description, onSuccess, onCancel, isOpen }: PaymentCheckoutProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col p-8"
        >
          <button onClick={onCancel} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10">
            <X className="w-5 h-5 text-slate-400" />
          </button>
          
          <div className="text-center mb-8 relative z-0 mt-4">
            <h3 className="text-2xl font-black mb-2">Finaliser le paiement</h3>
            <p className="text-slate-500 font-medium">{description}</p>
            <div className="mt-4 text-4xl font-black text-slate-900">{amount}€</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex items-center justify-center gap-2 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Paiement 100% sécurisé</span>
          </div>

          <div className="min-h-[150px] relative z-0">
            <PayPalScriptProvider options={{ 
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "EUR",
              intent: "capture"
            }}>
              <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        description: description,
                        amount: {
                          currency_code: 'EUR',
                          value: amount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    const details = await actions.order.capture();
                    onSuccess(details);
                  }
                }}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                }}
              />
            </PayPalScriptProvider>
            <p className="text-center text-[10px] text-slate-400 mt-4 px-2">Vous pouvez payer par carte bancaire en cliquant sur le bouton ci-dessus (l'option apparaîtra dans la fenêtre de paiement).</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
