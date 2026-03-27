const th: Record<string, string> = {
  // Navigation
  "nav.search": "ค้นหา",
  "nav.lines": "สายรถไฟฟ้า",
  "nav.about": "เกี่ยวกับ",
  "nav.home": "หน้าแรก",

  // Home page
  "home.title": "ค้นหาเส้นทาง",
  "home.titleHighlight": "รถไฟฟ้า",
  "home.subtitle": "BTS · MRT · ARL — ราคา เส้นทาง เวลาเดินทาง",
  "home.btsSukhumvit": "BTS สุขุมวิท",
  "home.btsSilom": "BTS สีลม",
  "home.mrtBlue": "MRT สีน้ำเงิน",
  "home.mrtPurple": "MRT สีม่วง",

  // Search form
  "search.origin": "ต้นทาง",
  "search.destination": "ปลายทาง",
  "search.originPlaceholder": "สถานี เช่น สยาม, Asok, N8...",
  "search.destinationPlaceholder": "สถานี เช่น หมอชิต, Hua Lamphong...",
  "search.swapStations": "สลับต้นทางกับปลายทาง",
  "search.searchRoute": "ค้นหาเส้นทาง",
  "search.newSearch": "ค้นหาใหม่",
  "search.swapRoute": "สลับเส้นทาง",
  "search.swapOriginDest": "สลับต้นทาง-ปลายทาง",
  "search.clear": "ล้าง",

  // Search results page
  "searchResult.selectStations": "กรุณาเลือกสถานีต้นทางและปลายทาง",
  "searchResult.backToSearch": "กลับไปค้นหา",
  "searchResult.stationNotFound": "ไม่พบสถานีที่ระบุ",
  "searchResult.foundRoutes": "พบ {count} เส้นทาง",
  "searchResult.noRoutes": "ไม่พบเส้นทางรถไฟฟ้าระหว่างสถานีที่เลือก",
  "searchResult.viewGoogleMaps": "ดูใน Google Maps",
  "searchResult.tryGoogleMaps": "ลองค้นหาใน Google Maps",
  "searchResult.disclaimer": "ราคาค่าโดยสารอ้างอิงจากผู้ให้บริการ อาจมีการเปลี่ยนแปลง · เวลาเดินทางเป็นค่าประมาณ · ข้อมูลบริการใกล้สถานีจาก Google",

  // Route card
  "route.approximateTime": "เวลาโดยประมาณ สถานีถึงสถานี (ไม่รวมเวลาเดินเข้า/ออกสถานี)",
  "route.viewRealTime": "ดูเวลาจริง",
  "route.routeNumber": "เส้นทาง {n}",
  "route.baht": "บาท",
  "route.minutes": "~{n} นาที",
  "route.noTransfer": "ไม่ต้องเปลี่ยนสาย",
  "route.transfers": "เปลี่ยน {n} ครั้ง",
  "route.stations": "{n} สถานี",
  "route.waitTime": "รอรถ ~{n} นาที",
  "route.intermediateStations": "{n} สถานีระหว่างทาง",
  "route.transfer": "เปลี่ยนสาย · เดิน ~{n} นาที",
  "route.total": "รวม:",
  "route.priceDisclaimer": "ราคาอ้างอิงจากผู้ให้บริการ อาจมีการเปลี่ยนแปลง",
  "route.free": "ฟรี",

  // Passenger types
  "passenger.adult": "ผู้ใหญ่",
  "passenger.student": "นร./นศ.",
  "passenger.senior": "สูงอายุ",
  "passenger.child": "เด็ก",

  // Station explore
  "explore.map": "Map",
  "explore.food": "อาหาร",
  "explore.cafe": "คาเฟ่",
  "explore.places": "สถานที่",
  "explore.hotel": "โรงแรม",
  "explore.shopping": "ช้อปปิ้ง",
  "explore.carRental": "เช่ารถ",
  "explore.nearStation": "{label} ใกล้สถานี{station}",

  // Quick links
  "quickLinks.googleMapsRoute": "เส้นทาง Google Maps",
  "quickLinks.hotelsNearDest": "โรงแรมใกล้ปลายทาง",
  "quickLinks.carRentalNearDest": "เช่ารถใกล้ปลายทาง",
  "quickLinks.servicesNear": "บริการเพิ่มเติมใกล้สถานี{station}",

  // Lines page
  "lines.allLines": "สายรถไฟฟ้าทั้งหมด",
  "lines.summary": "{lines} สาย · {stations} สถานี",
  "lines.stationCount": "{n} สถานี",
  "lines.trainEvery": "รถมาทุก ~{n} นาที",
  "lines.loop": "วงรอบ",
  "lines.interchange": "เปลี่ยน:",
  "lines.operator": "ผู้ให้บริการ:",
  "lines.allStations": "สถานีทั้งหมด",

  // Station page
  "station.notFound": "ไม่พบสถานี",
  "station.interchanges": "จุดเปลี่ยนสาย",
  "station.nearbyPlaces": "สถานที่ใกล้เคียง",
  "station.searchFromHere": "ค้นหาเส้นทางจากสถานีนี้",
  "station.searchFrom": "ค้นหาเส้นทางจาก{station}",
  "station.walkMinutes": "เดิน ~{n} นาที",

  // Line page
  "line.notFound": "ไม่พบสายรถไฟฟ้า",

  // About page
  "about.title": "เกี่ยวกับ Thai Transit",
  "about.subtitle": "ค้นหาเส้นทางรถไฟฟ้าในประเทศไทย",
  "about.whatIs": "Thai Transit คืออะไร?",
  "about.desc1": "Thai Transit คือบริการที่นำเสนอเส้นทางรถไฟฟ้าในประเทศไทย ด้วยการใช้งานที่ง่าย Thai Transit จะแนะนำเส้นทางที่เหมาะสมที่สุดและราคาค่าโดยสารจากสถานีต้นทางไปยังสถานีปลายทาง",
  "about.desc2": "ระบบค้นหาเส้นทางนี้ถูกสร้างขึ้นเพื่อให้สามารถเชื่อมโยงข้อมูลในพื้นที่ เช่น ข้อมูลแผนที่ ร้านอาหาร คาเฟ่ โรงแรม เช่ารถ และสถานที่น่าสนใจรอบสถานี จากผลการค้นหาได้ ทำให้คุณวางแผนการเดินทางได้ครบจบในที่เดียว",
  "about.desc3": "ไม่ว่าคุณจะเป็นนักท่องเที่ยวที่มาเยือนกรุงเทพฯ เป็นครั้งแรก หรือผู้อยู่อาศัยที่ต้องการหาเส้นทางใหม่ Thai Transit พร้อมช่วยคุณเดินทางอย่างมั่นใจ",
  "about.features": "คุณสมบัติหลัก",
  "about.feat.search": "ค้นหาเส้นทาง",
  "about.feat.searchDesc": "กรอกสถานีต้นทาง-ปลายทาง แสดงทุกเส้นทางที่เป็นไปได้",
  "about.feat.fare": "ราคาค่าโดยสาร",
  "about.feat.fareDesc": "แสดงราคาจริงจากผู้ให้บริการ แยกผู้ใหญ่ นักเรียน ผู้สูงอายุ เด็ก",
  "about.feat.maps": "เชื่อมโยง Google Maps",
  "about.feat.mapsDesc": "แผนที่ ร้านอาหาร คาเฟ่ โรงแรม เช่ารถ รอบทุกสถานี",
  "about.feat.station": "ข้อมูลสถานี",
  "about.feat.stationDesc": "รายละเอียดทุกสถานี จุดเปลี่ยนสาย สถานที่ใกล้เคียง",
  "about.feat.time": "เวลาเดินทาง",
  "about.feat.timeDesc": "แสดงเวลาโดยประมาณ สถานีถึงสถานี พร้อมเวลารอรถ",
  "about.feat.mobile": "รองรับมือถือ",
  "about.feat.mobileDesc": "ใช้งานได้ทุกอุปกรณ์ ติดตั้งเป็นแอปบนหน้าจอได้",
  "about.coverage": "สายรถไฟฟ้าที่ครอบคลุม",
  "about.dataSources": "แหล่งข้อมูล",
  "about.dataFare": "ราคาค่าโดยสาร — อ้างอิงจากผู้ให้บริการแต่ละราย",
  "about.dataTime": "เวลาเดินทาง — ประมาณการจากข้อมูลผู้ให้บริการ (สถานีถึงสถานี)",
  "about.dataNearby": "ข้อมูลสถานที่ใกล้เคียง — เชื่อมโยงจาก Google Maps",
  "about.dataDisclaimer": "ราคาและเวลาอ้างอิงจากผู้ให้บริการ อาจมีการเปลี่ยนแปลง กรุณาตรวจสอบกับผู้ให้บริการก่อนเดินทาง",
  "about.disclaimer": "ข้อจำกัดความรับผิดชอบ",
  "about.disclaimerText": "Thai Transit เป็นเครื่องมือช่วยวางแผนการเดินทาง ข้อมูลที่แสดงเป็นข้อมูลอ้างอิงเท่านั้น ไม่ใช่ข้อมูลแบบเรียลไทม์ ราคาค่าโดยสารและเวลาเดินทางอาจมีการเปลี่ยนแปลงได้ กรุณาตรวจสอบข้อมูลล่าสุดจากผู้ให้บริการโดยตรงก่อนเดินทาง Thai Transit ไม่มีส่วนเกี่ยวข้องกับ BTS, MRT, ARL หรือผู้ให้บริการรถไฟฟ้ารายใด",
  "about.startSearch": "เริ่มค้นหาเส้นทาง",
  "about.btsSukhumvit": "BTS สายสุขุมวิท",
  "about.btsSukhumvitStations": "44 สถานี",
  "about.btsSukhumvitRoute": "คูคต — เคหะฯ",
  "about.btsSilom": "BTS สายสีลม",
  "about.btsSilomStations": "14 สถานี",
  "about.btsSilomRoute": "สนามกีฬาแห่งชาติ — บางหว้า",
  "about.mrtBlue": "MRT สายสีน้ำเงิน",
  "about.mrtBlueStations": "31 สถานี",
  "about.mrtBlueRoute": "วงรอบ (ท่าพระ — หัวลำโพง)",
  "about.mrtPurple": "MRT สายสีม่วง",
  "about.mrtPurpleStations": "16 สถานี",
  "about.mrtPurpleRoute": "คลองบางไผ่ — เตาปูน",
  "about.arl": "แอร์พอร์ต เรล ลิงก์",
  "about.arlStations": "8 สถานี",
  "about.arlRoute": "สุวรรณภูมิ — พญาไท",

  // Error page
  "error.title": "เกิดข้อผิดพลาด",
  "error.message": "กรุณาลองใหม่อีกครั้ง",
  "error.retry": "ลองใหม่",

  // Not found page
  "notFound.title": "ไม่พบหน้าที่ต้องการ",
  "notFound.message": "หน้านี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ",
  "notFound.backHome": "กลับหน้าแรก",

  // Footer
  "footer.fareDisclaimer": "ข้อมูลราคาค่าโดยสารอ้างอิงจากผู้ให้บริการโดยตรง อาจมีการเปลี่ยนแปลง",
  "footer.copyright": "Thai Transit © {year} — ค้นหาเส้นทางรถไฟฟ้า BTS MRT ARL",

  // Tracking
  "tracking.start": "เปิดติดตามการเดินทาง (GPS)",
  "tracking.active": "กำลังติดตาม",
  "tracking.gpsWeak": "สัญญาณ GPS อ่อน",
  "tracking.near": "ใกล้ {station}",
  "tracking.stop": "หยุด",
  "tracking.noGps": "เบราว์เซอร์ไม่รองรับ GPS",
  "tracking.permissionDenied": "กรุณาอนุญาตการเข้าถึงตำแหน่ง",
  "tracking.positionUnavailable": "ไม่สามารถระบุตำแหน่งได้",
  "tracking.timeout": "หมดเวลา",
  "tracking.gpsError": "เกิดข้อผิดพลาด GPS กรุณาลองใหม่",
  "tracking.arriving": "ใกล้ถึง {station} แล้ว เตรียมลงสถานี",
  "tracking.minLeft": "นาที",
  "tracking.arrived": "ถึงแล้ว!",

  // Language
  "lang.th": "ไทย",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.ja": "日本語",
};

export default th;
