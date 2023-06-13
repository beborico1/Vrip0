// Importación de componentes y bibliotecas para la navegacion
import { NavigationContainer } from '@react-navigation/native';

// Importación de las pilas de navegación
import TabStack from './navigation/TabStack.js';

// Servicios
import * as Localization from 'expo-localization';
import translations from './helpers/translations.js';
import { auth, db } from './firebaseConfig.js';
import { UserContext } from './helpers/UserContext.js';
import { LanguageContext } from './helpers/LanguageContext.js';

import { doc, getDoc } from 'firebase/firestore';
import React from 'react'

function AppNavigator() {

  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  const [user, setUser] = React.useState(null);
  const [userDoc, setUserDoc] = React.useState(null);

  React.useEffect(() => {
    
      const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
              setUser(user);
              // we get the user Doc from the firestore
              const userDocRef = doc(db, 'users', user.uid);

              getDoc(userDocRef).then((doc) => {
                  if (doc.exists()) {
                      setUserDoc(doc.data());
                  }
              });

          } else {
              setUser(null);
              setUserDoc(null);
          }
      });
      return unsubscribe;
  }, []);

  return (
    <LanguageContext.Provider value={{ texts }}>
      <UserContext.Provider value={{ user, setUser, userDoc, setUserDoc }}>
        <NavigationContainer>
          <TabStack />
        </NavigationContainer>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
}

export default AppNavigator;

// Manejo de errores: Agrega manejo de errores cuando consultas el documento del usuario en Firestore. Si hay un error durante la consulta, necesitas saberlo para poder manejarlo adecuadamente.

// Optimización del rendimiento: Considera el uso de React.memo() o useMemo para evitar renderizaciones innecesarias de componentes.

// Manejo de efectos secundarios: Usa async/await en la función de efecto secundario para hacerla más legible y fácil de entender.

// Aumentar la modularización: Podrías descomponer este componente en subcomponentes más pequeños para hacerlo más modular y más fácil de probar y mantener.

// Separación de responsabilidades: Considera mover las funciones relacionadas con la autenticación y la obtención de datos del usuario a un archivo de servicio o hook personalizado. Esto haría que tu componente fuera más limpio y más fácil de leer.

// Localización: Podrías mejorar la localización manejando más casos y cayendo en un idioma por defecto si el idioma del dispositivo no se encuentra en tus traducciones.

// Carga perezosa: Implementa la carga perezosa de las rutas de navegación para mejorar el rendimiento de la aplicación. React Navigation ofrece soporte para esto.

// Carga de estado inicial: Puedes mejorar la experiencia del usuario mostrando un spinner de carga o una pantalla de bienvenida mientras se carga el estado inicial del usuario.

// Actualización del documento del usuario: Podrías considerar una funcionalidad para actualizar el documento del usuario en Firestore cuando se produzcan cambios en los datos del usuario.

// Seguridad: Asegúrate de que las claves y valores sensibles estén protegidos y no se expongan. Si estás usando algún valor sensible en este componente, asegúrate de que esté adecuadamente protegido.