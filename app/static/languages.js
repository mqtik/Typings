import React, {Component} from 'react';
import { Platform, NativeModules } from 'react-native';

export const Languages = {
        bottomBarSettings: {
            en: 'Settings',
            es: 'Configuración'
        },
        bottomBarCreators: {
            en: 'Creators',
            es: 'Creators'
        },
        bottomBarExplore: {
            en: 'Explore',
            es: 'Explorar'
        },
        Details: {
            en: 'Details',
            es: 'Detalles'
        },
        Chapters: {
            en: 'Chapters',
            es: 'Capítulos'
        },
        Username: {
            en: 'Username',
            es: 'Usuario'
        },
        Password: {
            en: 'Password',
            es: 'Contraseña'
        },
        Name: {
            en: 'Name',
            es: 'Nombre'
        },
        Gender: {
            en: 'Gender',
            es: 'Género'
        },
        enterUsername: {
            en: 'Enter your username',
            es: 'Ingresa tu usuario'
        },
        enterName: {
            en: 'Enter your name',
            es: 'Ingresa tu nombre'
        },
        chooseGender: {
            en: 'Choose your gender',
            es: 'Elige tu género'
        },
        Male: {
            en: 'Male',
            es: 'Masculino'
        },
        Female: {
            en: 'Female',
            es: 'Femenino'
        },
        Other: {
            en: 'Other',
            es: 'Otro'
        },
        Cancel: {
            en: 'Cancel',
            es: 'Cancelar'
        },
        Save: {
            en: 'Save',
            es: 'Guardar'
        },
        Application: {
            en: 'Application',
            es: 'Aplicación'
        },
        Drafts: {
            en: 'Drafts',
            es: 'Borradores'
        },
        Archive: {
            en: 'Archive',
            es: 'Archivo'
        },
        myAccount: {
            en: 'My account',
            es: 'Mi cuenta'
        },
        AllowPushNotifications: {
            en: 'Allow Push Notification',
            es: 'Permitir Notificaciones'
        },
        enablePagination: {
            en: 'Enable pagination',
            es: 'Habilitar paginación'
        },
        offlineMode: {
            en: 'Premium Mode',
            es: 'Modo Premium'
        },
        signOut: {
            en: 'Sign out',
            es: 'Cerrar sesión'
        },
        typeBookTitle: {
            en: 'Type book title',
            es: 'Tipea título de libro'
        },
        addChapter: {
            en: 'Add chapter',
            es: 'Añade un capítulo'
        },
        editTitleChapter: {
            en: 'Edit title chapter',
            es: 'Editar título de capítulo'
        },
        typeSomething: {
            en: 'Type something',
            es: 'Escribe algo'
        },
        placeholderEditTitle: {
            en: 'Edit title',
            es: 'Editar título'
        },
        readStart: {
            en: 'Open',
            es: 'Abrir'
        },
        writtenBy: {
            en: 'written by',
            es: 'escrito por'
        },
        firstTitleSection: {
            en: 'Tales for you',
            es: 'Historias para tí'
        },
        noBooksCreated: {
            en: 'Welcome to Creators\nAdd your project below',
            es: 'Bienvenido a Creators\nAgrega tu libro aquí'
        },
        noChaptersCreated: {
            en: 'Here you can start writing\nCreate chapters, drag them to organize',
            es: 'Aquí puedes empezar a escribir\nCrea capítulos y arrástralos para organizar'
        },
        booksFound: {
            en: 'books found',
            es: 'libros encontrados'
        },
        onSearch: {
            en: 'Artist, books or gender',
            es: 'Artistas, libros o géneros'
        },
        Results: {
            en: 'Results',
            es: 'Resultados'
        },
        findMoreByTag: {
            en: 'Find your next story',
            es: 'Encuentra tu siguiente historia'
        },
        thereAreNoResults: {
            en: 'There are no results for your search',
            es: 'No hay resultados para tu búsqueda'
        },
        noInternetConnection: {
            en: 'No internet connection',
            es: 'No tienes conexión a internet'
        },
        noInternetConnectionSubtitle: {
            en: 'You can still read the books that you\'ve been reading offline',
            es: 'Puedes continuar los libros que estabas leyendo.'
        },
        lastBooks: {
            en: 'Recently added',
            es: 'Agregados recientemente'
        },
        continueReading: {
            en: 'Continue reading',
            es: 'Continuar leyendo'
        }

    };

export const getLang = function () {
  let systemLanguage = 'en';
  if (Platform.OS === 'android') {
    systemLanguage = NativeModules.I18nManager.localeIdentifier;
  } else {
    systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
  }
  const languageCode = systemLanguage.substring(0, 2);
  if(languageCode != 'en' && languageCode != 'es'){
      return 'en';
  } else {
      return languageCode;
  }
}