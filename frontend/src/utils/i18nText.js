/**
 * FoodSave AI – Multi-Language Text Catalog (i18n)
 * 
 * Central repository for all user-facing UI copy.
 * Changing any string across the application can be accomplished right here.
 */

export const I18N_STRINGS = {
  en: {
    brand: {
      name: 'FoodSave AI',
      tagline: 'Rescue Surplus Food • Nourish Communities • Eliminate Waste',
      mission: 'Connecting restaurants, grocers, and community food shelters to prevent edible food from ending up in landfills.',
    },
    nav: {
      home: 'Home',
      browse: 'Browse Food',
      stats: 'Statistics',
      myDonations: 'My Donations',
      myRequests: 'My Requests',
      admin: 'Admin Moderation',
      login: 'Log In',
      register: 'Join Platform',
      logout: 'Sign Out',
    },
    actions: {
      donateFood: 'Donate Surplus Food',
      browseFood: 'Browse Surplus Food',
      requestCollection: 'Request Food Collection',
      confirmCollection: 'Confirm Collection (Collected)',
      acceptRequest: 'Accept Collection',
      declineRequest: 'Decline Request',
      cancelListing: 'Cancel Listing',
      viewDetails: 'View Details',
      printReceipt: 'Print Receipt',
      rateExperience: 'Rate Experience',
      saveListing: 'Save to Favorites',
      tryAgain: 'Try Again',
    },
    status: {
      Available: 'Available',
      Requested: 'Requested',
      Accepted: 'Accepted',
      Collected: 'Collected',
      Expired: 'Expired',
      Cancelled: 'Cancelled',
      Rejected: 'Rejected',
    },
    urgency: {
      urgentPrefix: 'Urgent:',
      hoursLeft: 'left',
      expired: 'Expired',
    },
    metrics: {
      mealsSaved: 'Meals Saved',
      foodRescuedKg: 'Food Rescued (kg)',
      co2AvoidedKg: 'CO2 Avoided (kg)',
      activePartners: 'Active Partners',
    },
    safety: {
      disclaimerTitle: 'Good Samaritan Food Act Protected',
      disclaimerBody: 'Food donations made in good faith are legally protected. All participants adhere to safe holding temperatures and transparent allergen disclosures.',
    }
  },

  es: {
    brand: {
      name: 'FoodSave AI',
      tagline: 'Rescata Alimentos • Nutre Comunidades • Elimina el Desperdicio',
      mission: 'Conectando restaurantes y refugios comunitarios para evitar que alimentos comestibles terminen en vertederos.',
    },
    nav: {
      home: 'Inicio',
      browse: 'Explorar Alimentos',
      stats: 'Estadísticas',
      myDonations: 'Mis Donaciones',
      myRequests: 'Mis Solicitudes',
      admin: 'Administración',
      login: 'Iniciar Sesión',
      register: 'Unirse',
      logout: 'Cerrar Sesión',
    },
    actions: {
      donateFood: 'Donar Excedentes',
      browseFood: 'Explorar Alimentos',
      requestCollection: 'Solicitar Recogida',
      confirmCollection: 'Confirmar Recogida',
      acceptRequest: 'Aceptar Solicitud',
      declineRequest: 'Rechazar Solicitud',
      cancelListing: 'Cancelar Publicación',
      viewDetails: 'Ver Detalles',
      printReceipt: 'Imprimir Recibo',
      rateExperience: 'Calificar Experiencia',
      saveListing: 'Guardar en Favoritos',
      tryAgain: 'Reintentar',
    },
    status: {
      Available: 'Disponible',
      Requested: 'Solicitado',
      Accepted: 'Aceptado',
      Collected: 'Recolectado',
      Expired: 'Expirado',
      Cancelled: 'Cancelado',
      Rejected: 'Rechazado',
    },
    urgency: {
      urgentPrefix: 'Urgente:',
      hoursLeft: 'restante',
      expired: 'Expirado',
    },
    metrics: {
      mealsSaved: 'Comidas Salvadas',
      foodRescuedKg: 'Comida Rescatada (kg)',
      co2AvoidedKg: 'CO2 Evitado (kg)',
      activePartners: 'Socios Activos',
    },
    safety: {
      disclaimerTitle: 'Protegido por la Ley del Buen Samaritano',
      disclaimerBody: 'Las donaciones de alimentos hechas de buena fe están protegidas legalmente.',
    }
  }
}

// Current active language (defaults to 'en')
let activeLang = 'en'

export function setLanguage(lang) {
  if (I18N_STRINGS[lang]) activeLang = lang
}

export function t(path) {
  const parts = path.split('.')
  let current = I18N_STRINGS[activeLang] || I18N_STRINGS.en
  for (const part of parts) {
    if (!current || current[part] === undefined) return path
    current = current[part]
  }
  return current
}
