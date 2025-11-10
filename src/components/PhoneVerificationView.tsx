import React, { useState } from "react";
import {
  initRecaptcha,
  sendVerificationCode,
  confirmVerificationCode,
} from "../auth/phoneAuth";

export default function PhoneVerificationView() {
  const [phone, setPhone] = useState("+1"); // Colocá el número con código país
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Paso 1: Enviar el SMS
  const handleSendCode = async () => {
    try {
      initRecaptcha();
      const result = await sendVerificationCode(phone);
      setConfirmationResult(result);
      setStep(2);
    } catch (error) {
      alert("Error enviando código: " + error.message);
    }
  };

  // Paso 2: Confirmar el código
  const handleConfirmCode = async () => {
    try {
      const user = await confirmVerificationCode(confirmationResult, code);
      alert(`✅ Teléfono verificado: ${user.phoneNumber}`);
    } catch (error) {
      alert("❌ Código incorrecto o expirado");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Verificación por Teléfono</h2>
      <div id="recaptcha-container"></div>

      {step === 1 ? (
        <>
          <input
            type="text"
            placeholder="+1 555 555 0100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded mb-3 w-64 text-center"
          />
          <button
            onClick={handleSendCode}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Enviar código
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Código SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 rounded mb-3 w-64 text-center"
          />
          <button
            onClick={handleConfirmCode}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirmar código
          </button>
        </>
      )}
    </div>
  );
}
