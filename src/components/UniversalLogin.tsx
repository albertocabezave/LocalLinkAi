// src/components/UniversalLogin.tsx

// 🗓️ 2025-11-12
// Contexto: Login unificado (correo o teléfono) + registro + verificación SMS

import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  linkWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// 🔍 Buscar email real asociado a número en Firestore
const findUserEmailByPhone = async (phoneNumber: string): Promise<string | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log("✅ Coincidencia encontrada:", userData.email);
      return userData.email || null;
    } else {
      console.log("📭 No se encontró usuario con ese número:", phoneNumber);
      return null;
    }
  } catch (err) {
    console.error("Error buscando usuario por teléfono:", err);
    return null;
  }
};

export default function UniversalLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [usePhoneMode, setUsePhoneMode] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [countryCode, setCountryCode] = useState("+58");
  const [operatorCode, setOperatorCode] = useState("");
  const [phoneRest, setPhoneRest] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Para verificación SMS
  const [smsSent, setSmsSent] = useState(false);
  const [confirmationResultStored, setConfirmationResultStored] = useState<any>(null);
  const [smsCode, setSmsCode] = useState("");

  useEffect(() => {
    // Detecta país automáticamente
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (d.country_calling_code) setCountryCode(d.country_calling_code);
      })
      .catch(() => {});
  }, []);

  // Construye +584141234567
  const buildNormalizedPhone = () => {
    const op = operatorCode.replace(/\D/g, "");
    const rest = phoneRest.replace(/\D/g, "");
    let cc = countryCode.trim();
    if (!cc.startsWith("+")) cc = "+" + cc;
    return `${cc}${op}${rest}`;
  };

  const phoneToVirtualEmail = (normalizedPhone: string) => {
    const digits = normalizedPhone.replace(/\+/g, "");
    return `${digits}@phone.locallinkai.app`;
  };

  const setupRecaptcha = () => {
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
    }
  };

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      let loginEmail = emailInput.trim().toLowerCase();

      if (usePhoneMode) {
        const normalizedPhone = buildNormalizedPhone();
        console.log("🔍 Buscando correo asociado a:", normalizedPhone);

        const emailFromDb = await findUserEmailByPhone(normalizedPhone);
        if (!emailFromDb) throw new Error("No existe usuario con ese número registrado.");

        loginEmail = emailFromDb;
        console.log("📩 Correo encontrado:", loginEmail);
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);
      onLogin(auth.currentUser);
    } catch (err: any) {
      console.error("❌ Login error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Credenciales inválidas. Revisa el número/correo o la contraseña.");
      } else if (err.code === "auth/user-not-found") {
        setError("Usuario no encontrado. Crea una cuenta nueva.");
      } else {
        setError(err.message || "Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- REGISTRO ----------
  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      let emailToCreate = usePhoneMode
        ? phoneToVirtualEmail(buildNormalizedPhone())
        : emailInput.trim().toLowerCase();

      const cred = await createUserWithEmailAndPassword(auth, emailToCreate, password);

      if (usePhoneMode) {
        setupRecaptcha();
        // @ts-ignore
        const appVerifier = window.recaptchaVerifier;
        const normalizedPhone = buildNormalizedPhone();
        const confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
        setConfirmationResultStored(confirmationResult);
        setSmsSent(true);
        setError("Código SMS enviado. Ingresa el código para vincular tu teléfono.");
      } else {
        onLogin(cred.user);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CONFIRMAR SMS ----------
  const handleConfirmAndLink = async () => {
    setLoading(true);
    setError("");
    try {
      if (!confirmationResultStored) {
        setError("No hay código pendiente. Envía el SMS primero.");
        return;
      }

      const result = await confirmationResultStored.confirm(smsCode);
      const verificationId = confirmationResultStored.verificationId || (result as any).verificationId;
      const credential = PhoneAuthProvider.credential(verificationId, smsCode);
      await linkWithCredential(auth.currentUser!, credential);

      onLogin(auth.currentUser);
      setSmsSent(false);
      setSmsCode("");
      setError("Teléfono verificado y vinculado correctamente.");
    } catch (err: any) {
      console.error("Error confirmando SMS / link:", err);
      setError(err?.message || "Código inválido o error de vinculación.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLER PRINCIPAL ----------
  const handleAuth = async () => {
    if (isLogin) await handleLogin();
    else await handleRegister();
  };

  // ---------- UI ----------
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
      </h2>

      <div className="mb-3">
        <button
          onClick={() => setUsePhoneMode(false)}
          className={`px-3 py-1 rounded-l ${!usePhoneMode ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Correo
        </button>
        <button
          onClick={() => setUsePhoneMode(true)}
          className={`px-3 py-1 rounded-r ${usePhoneMode ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Teléfono
        </button>
      </div>

      {!usePhoneMode ? (
        <input
          type="text"
          placeholder="Correo electrónico"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="border p-2 rounded mb-2 w-72"
        />
      ) : (
        <div className="flex gap-2 mb-2 items-center">
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="border rounded p-2 w-28 bg-white">
            <option value="+58">🇻🇪 +58</option>
            <option value="+57">🇨🇴 +57</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+55">🇧🇷 +55</option>
          </select>

          <input
            type="text"
            placeholder="414"
            maxLength={3}
            value={operatorCode}
            onChange={(e) => setOperatorCode(e.target.value.replace(/\D/g, ""))}
            className="border rounded p-2 w-16 text-center"
          />

          <input
            type="text"
            placeholder="1234567"
            maxLength={12}
            value={phoneRest}
            onChange={(e) => setPhoneRest(e.target.value.replace(/\D/g, ""))}
            className="border rounded p-2 flex-1"
          />
        </div>
      )}

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-4 w-72"
      />

      {error && <p className="text-red-500 text-sm mb-3 max-w-[320px] text-center">{error}</p>}

      <button
        onClick={handleAuth}
        disabled={loading}
        className={`${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded mb-3`}
      >
        {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse"}
      </button>

      {!isLogin && usePhoneMode && smsSent && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Código SMS"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            className="border p-2 rounded mb-2 w-48"
          />
          <button onClick={handleConfirmAndLink} className="bg-green-500 text-white px-3 py-1 rounded ml-2">
            Confirmar código
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-700 underline">
          {isLogin ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>

        <button
          onClick={() => {
            if (usePhoneMode) {
              setupRecaptcha();
              // @ts-ignore
              const appVerifier = window.recaptchaVerifier;
              const normalizedPhone = buildNormalizedPhone();
              signInWithPhoneNumber(auth, normalizedPhone, appVerifier)
                .then((confirmationResult) => {
                  setConfirmationResultStored(confirmationResult);
                  setSmsSent(true);
                  setError("Código SMS enviado. Introduce el código y pulsa 'Confirmar código'.");
                })
                .catch((err) => setError("Error enviando SMS: " + err.message));
            } else {
              setError("Cambia a 'Usar teléfono' para entrar con SMS.");
            }
          }}
          className="text-sm text-gray-600 underline ml-2"
        >
          Entrar con SMS
        </button>
      </div>

      <div id="recaptcha-container" />
      <p className="text-xs text-gray-500 mt-2">
        Prefijo detectado: <b>{countryCode}</b>
      </p>
    </div>
  );
}
