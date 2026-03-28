const en: Record<string, string> = {
  // Navigation
  "nav.search": "Search",
  "nav.lines": "Lines",
  "nav.about": "About",
  "nav.home": "Home",

  // Home page
  "home.title": "Find Your",
  "home.titleHighlight": "Train Route",
  "home.subtitle": "BTS · MRT · ARL — Fares, Routes & Travel Time",
  "home.btsSukhumvit": "BTS Sukhumvit",
  "home.btsSilom": "BTS Silom",
  "home.mrtBlue": "MRT Blue",
  "home.mrtPurple": "MRT Purple",

  // Search form
  "search.origin": "From",
  "search.destination": "To",
  "search.originPlaceholder": "Station e.g. Siam, Asok, N8...",
  "search.destinationPlaceholder": "Station e.g. Mo Chit, Hua Lamphong...",
  "search.swapStations": "Swap origin and destination",
  "search.searchRoute": "Search Route",
  "search.newSearch": "New Search",
  "search.swapRoute": "Swap Route",
  "search.swapOriginDest": "Swap Origin-Destination",
  "search.clear": "Clear",

  // Search results page
  "searchResult.selectStations": "Please select origin and destination stations",
  "searchResult.backToSearch": "Back to Search",
  "searchResult.stationNotFound": "Station not found",
  "searchResult.foundRoutes": "Found {count} routes",
  "searchResult.noRoutes": "No train routes found between selected stations",
  "searchResult.viewGoogleMaps": "View in Google Maps",
  "searchResult.tryGoogleMaps": "Try searching in Google Maps",
  "searchResult.disclaimer": "Fares are from operators and may change · Travel times are approximate · Nearby info from Google",

  // Route card
  "route.approximateTime": "Approximate time, station to station (excluding walking to/from station)",
  "route.viewRealTime": "View real-time",
  "route.routeNumber": "Route {n}",
  "route.baht": "THB",
  "route.minutes": "~{n} min",
  "route.noTransfer": "Direct — No transfer",
  "route.transfers": "{n} transfer(s)",
  "route.stations": "{n} stations",
  "route.waitTime": "Wait ~{n} min",
  "route.intermediateStations": "{n} intermediate stations",
  "route.transfer": "Transfer · Walk ~{n} min",
  "route.total": "Total:",
  "route.priceDisclaimer": "Fares are from operators and may change",
  "route.free": "Free",

  // Passenger types
  "passenger.adult": "Adult",
  "passenger.student": "Student",
  "passenger.senior": "Senior",
  "passenger.child": "Child",

  // Station explore
  "explore.map": "Map",
  "explore.food": "Food",
  "explore.cafe": "Cafe",
  "explore.places": "Places",
  "explore.hotel": "Hotel",
  "explore.shopping": "Shopping",
  "explore.carRental": "Car Rental",
  "explore.nearStation": "{label} near {station} station",

  // Quick links
  "quickLinks.googleMapsRoute": "Google Maps Route",
  "quickLinks.hotelsNearDest": "Hotels near destination",
  "quickLinks.carRentalNearDest": "Car rental near destination",
  "quickLinks.servicesNear": "More services near {station}",

  // Lines page
  "lines.allLines": "All Transit Lines",
  "lines.summary": "{lines} lines · {stations} stations",
  "lines.stationCount": "{n} stations",
  "lines.trainEvery": "Every ~{n} min",
  "lines.loop": "Loop",
  "lines.interchange": "Transfer:",
  "lines.operator": "Operator:",
  "lines.allStations": "All Stations",

  // Station page
  "station.notFound": "Station not found",
  "station.interchanges": "Interchange",
  "station.nearbyPlaces": "Nearby Places",
  "station.searchFromHere": "Search routes from this station",
  "station.searchFrom": "Search routes from {station}",
  "station.walkMinutes": "Walk ~{n} min",

  // Line page
  "line.notFound": "Line not found",

  // About page
  "about.title": "About Thai Transit",
  "about.subtitle": "Find train routes in Thailand",
  "about.whatIs": "What is Thai Transit?",
  "about.desc1": "Thai Transit is a service that helps you find train routes in Thailand. With an easy-to-use interface, Thai Transit recommends the best routes and fares from your origin station to your destination.",
  "about.desc2": "This route finder connects you with local information such as maps, restaurants, cafes, hotels, car rentals, and attractions near every station, so you can plan your entire trip in one place.",
  "about.desc3": "Whether you're a tourist visiting Bangkok for the first time or a resident looking for a new route, Thai Transit is here to help you travel with confidence.",
  "about.features": "Key Features",
  "about.feat.search": "Route Search",
  "about.feat.searchDesc": "Enter origin and destination to see all possible routes",
  "about.feat.fare": "Fare Information",
  "about.feat.fareDesc": "Real fares from operators — adult, student, senior, and child",
  "about.feat.maps": "Google Maps Integration",
  "about.feat.mapsDesc": "Maps, restaurants, cafes, hotels, and car rentals near every station",
  "about.feat.station": "Station Details",
  "about.feat.stationDesc": "Full details for every station, interchanges, and nearby places",
  "about.feat.time": "Travel Time",
  "about.feat.timeDesc": "Approximate station-to-station time with waiting estimates",
  "about.feat.mobile": "Mobile Friendly",
  "about.feat.mobileDesc": "Works on all devices, installable as an app on your home screen",
  "about.coverage": "Covered Transit Lines",
  "about.dataSources": "Data Sources",
  "about.dataFare": "Fares — referenced from each transit operator",
  "about.dataTime": "Travel time — estimated from operator data (station to station)",
  "about.dataNearby": "Nearby places — linked from Google Maps",
  "about.dataDisclaimer": "Fares and times are from operators and may change. Please verify with the operator before traveling.",
  "about.disclaimer": "Disclaimer",
  "about.disclaimerText": "Thai Transit is a trip planning tool. Information shown is for reference only and is not real-time. Fares and travel times may change. Please check the latest information directly from operators. Thai Transit is not affiliated with BTS, MRT, ARL, or any transit operator.",
  "about.startSearch": "Start Route Search",
  "about.btsSukhumvit": "BTS Sukhumvit Line",
  "about.btsSukhumvitStations": "44 stations",
  "about.btsSukhumvitRoute": "Khu Khot — Kheha",
  "about.btsSilom": "BTS Silom Line",
  "about.btsSilomStations": "14 stations",
  "about.btsSilomRoute": "National Stadium — Bang Wa",
  "about.mrtBlue": "MRT Blue Line",
  "about.mrtBlueStations": "31 stations",
  "about.mrtBlueRoute": "Loop (Tha Phra — Hua Lamphong)",
  "about.mrtPurple": "MRT Purple Line",
  "about.mrtPurpleStations": "16 stations",
  "about.mrtPurpleRoute": "Khlong Bang Phai — Tao Poon",
  "about.arl": "Airport Rail Link",
  "about.arlStations": "8 stations",
  "about.arlRoute": "Suvarnabhumi — Phaya Thai",

  // Error page
  "error.title": "Something went wrong",
  "error.message": "Please try again",
  "error.retry": "Retry",

  // Not found page
  "notFound.title": "Page not found",
  "notFound.message": "This page may have been moved or doesn't exist",
  "notFound.backHome": "Back to Home",

  // Footer
  "footer.fareDisclaimer": "Fare information is from operators and may change",
  "footer.copyright": "Thai Transit © {year} — Find BTS MRT ARL train routes",

  // Tracking
  "tracking.start": "Track my journey (GPS)",
  "tracking.active": "Tracking",
  "tracking.gpsWeak": "Weak GPS signal",
  "tracking.gpsSearching": "Searching for GPS signal",
  "tracking.near": "Near {station}",
  "tracking.stop": "Stop",
  "tracking.noGps": "Browser does not support GPS",
  "tracking.permissionDenied": "Please allow location access",
  "tracking.positionUnavailable": "Unable to determine position",
  "tracking.timeout": "Timeout",
  "tracking.gpsError": "GPS error — please try again",
  "tracking.arriving": "Arriving at {station} soon — get ready",
  "tracking.minLeft": "min left",
  "tracking.arrived": "Arrived!",

  // Language
  "lang.th": "ไทย",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.ja": "日本語",
};

export default en;
