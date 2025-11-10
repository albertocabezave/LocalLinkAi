import React, { useState, useEffect } from "react";
import UniversalLogin from "./components/UniversalLogin";
import PhoneVerification from "./components/PhoneVerification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { ensureUserDoc } from "./auth/userService";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Escucha cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await ensureUserDoc(currentUser); // 👈 Crea/verifica el documento en Firestore
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  // 🚪 Si no hay usuario autenticado, mostrar pantalla de login
  if (!user) {
    return <UniversalLogin onLogin={setUser} />;
  }

  // 📱 Si el usuario NO tiene número de teléfono verificado
  if (!user.phoneNumber) {
    return (
      <PhoneVerification
        onVerified={() => {
          // ✅ Actualiza el estado del usuario después de verificar
          setUser(auth.currentUser);
        }}
      />
    );
  }

  // 🏠 Si todo está verificado, muestra la app principal
  return (
    <div className="h-screen flex items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold text-green-700">
        ✅ Bienvenido, {user.email || user.phoneNumber}
      </h1>
      <button
        onClick={() => auth.signOut()}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
