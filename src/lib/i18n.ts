export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'zh', name: '中文' },
];

export const COUNTRIES = [
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
];

export type TranslationKey = 
  | 'settings' 
  | 'general' 
  | 'sounds' 
  | 'privacy' 
  | 'localization'
  | 'language'
  | 'country'
  | 'currency'
  | 'app_sounds'
  | 'online_status'
  | 'last_seen'
  | 'private_profile'
  | 'save'
  | 'cancel'
  | 'gigs'
  | 'seekers'
  | 'market'
  | 'chats'
  | 'notifications'
  | 'profile'
  | 'edit_profile'
  | 'share'
  | 'like'
  | 'market_listing'
  | 'gig_listing'
  | 'seeker_listing'
  | 'title'
  | 'description'
  | 'price'
  | 'location'
  | 'contact'
  | 'publish';

export const TRANSLATIONS: Record<string, Record<TranslationKey, string>> = {
  en: {
    settings: 'Settings',
    general: 'General',
    sounds: 'Sounds',
    privacy: 'Privacy',
    localization: 'Localization',
    language: 'Language',
    country: 'Country',
    currency: 'Currency',
    app_sounds: 'App Sounds',
    online_status: 'Online Status',
    last_seen: 'Last Seen',
    private_profile: 'Private Profile',
    save: 'Save',
    cancel: 'Cancel',
    gigs: 'Gigs',
    seekers: 'Seekers',
    market: 'Market',
    chats: 'Chats',
    notifications: 'Notifications',
    profile: 'Profile',
    edit_profile: 'Edit Profile',
    share: 'Share',
    like: 'Like',
    market_listing: 'Market Listing',
    gig_listing: 'Gig Listing',
    seeker_listing: 'Seeker Listing',
    title: 'Title',
    description: 'Description',
    price: 'Price',
    location: 'Location',
    contact: 'Contact',
    publish: 'Publish',
  },
  af: {
    settings: 'Instellings',
    general: 'Algemeen',
    sounds: 'Klanke',
    privacy: 'Privaatheid',
    localization: 'Lokaliserings',
    language: 'Taal',
    country: 'Land',
    currency: 'Geldeenheid',
    app_sounds: 'Toepassing Klanke',
    online_status: 'Aanlyn Status',
    last_seen: 'Laas Gesien',
    private_profile: 'Privaat Profiel',
    save: 'Stoor',
    cancel: 'Kanselleer',
    gigs: 'Gigs',
    seekers: 'Soekers',
    market: 'Mark',
    chats: 'Gesprekke',
    notifications: 'Kennisgewings',
    profile: 'Profiel',
    edit_profile: 'Wysig Profiel',
    share: 'Deel',
    like: 'Hou van',
    market_listing: 'Mark-aanbieding',
    gig_listing: 'Gig-aanbieding',
    seeker_listing: 'Soeker-aanbieding',
    title: 'Titel',
    description: 'Beskrywing',
    price: 'Prys',
    location: 'Ligging',
    contact: 'Kontak',
    publish: 'Publiseer',
  },
  fr: {
    settings: 'Paramètres',
    general: 'Général',
    sounds: 'Sons',
    privacy: 'Confidentialité',
    localization: 'Localisation',
    language: 'Langue',
    country: 'Pays',
    currency: 'Devise',
    app_sounds: 'Sons de l\'app',
    online_status: 'Statut en ligne',
    last_seen: 'Dernière fois vu',
    private_profile: 'Profil privé',
    save: 'Enregistrer',
    cancel: 'Annuler',
    gigs: 'Gigs',
    seekers: 'Chercheurs',
    market: 'Marché',
    chats: 'Discussions',
    notifications: 'Notifications',
    profile: 'Profil',
    edit_profile: 'Modifier le profil',
    share: 'Partager',
    like: 'Aimer',
    market_listing: 'Annonce Marché',
    gig_listing: 'Annonce Gig',
    seeker_listing: 'Annonce Chercheur',
    title: 'Titre',
    description: 'Description',
    price: 'Prix',
    location: 'Lieu',
    contact: 'Contact',
    publish: 'Publier',
  },
  es: {
    settings: 'Ajustes',
    general: 'General',
    sounds: 'Sonidos',
    privacy: 'Privacidad',
    localization: 'Localización',
    language: 'Idioma',
    country: 'País',
    currency: 'Moneda',
    app_sounds: 'Sonidos de la aplicación',
    online_status: 'Estado en línea',
    last_seen: 'Última vez visto',
    private_profile: 'Perfil privado',
    save: 'Guardar',
    cancel: 'Cancelar',
    gigs: 'Gigs',
    seekers: 'Buscadores',
    market: 'Mercado',
    chats: 'Chats',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    edit_profile: 'Editar perfil',
    share: 'Compartir',
    like: 'Me gusta',
    market_listing: 'Anuncio Mercado',
    gig_listing: 'Anuncio Gig',
    seeker_listing: 'Anuncio Buscador',
    title: 'Título',
    description: 'Descripción',
    price: 'Precio',
    location: 'Ubicación',
    contact: 'Contacto',
    publish: 'Publicar',
  }
};

export const getTranslation = (lang: string, key: TranslationKey): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key];
};
