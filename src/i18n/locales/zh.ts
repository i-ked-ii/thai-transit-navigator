const zh: Record<string, string> = {
  // Navigation
  "nav.search": "搜索",
  "nav.lines": "线路",
  "nav.about": "关于",
  "nav.home": "首页",

  // Home page
  "home.title": "搜索",
  "home.titleHighlight": "列车路线",
  "home.subtitle": "BTS · MRT · ARL — 票价、路线和行程时间",
  "home.btsSukhumvit": "BTS 素坤逸线",
  "home.btsSilom": "BTS 是隆线",
  "home.mrtBlue": "MRT 蓝线",
  "home.mrtPurple": "MRT 紫线",

  // Search form
  "search.origin": "出发站",
  "search.destination": "目的站",
  "search.originPlaceholder": "车站 如 Siam, Asok, N8...",
  "search.destinationPlaceholder": "车站 如 Mo Chit, Hua Lamphong...",
  "search.swapStations": "交换出发站和目的站",
  "search.searchRoute": "搜索路线",
  "search.newSearch": "重新搜索",
  "search.swapRoute": "交换路线",
  "search.swapOriginDest": "交换出发站-目的站",
  "search.clear": "清除",

  // Search results page
  "searchResult.selectStations": "请选择出发站和目的站",
  "searchResult.backToSearch": "返回搜索",
  "searchResult.stationNotFound": "未找到车站",
  "searchResult.foundRoutes": "找到 {count} 条路线",
  "searchResult.noRoutes": "未找到所选车站之间的列车路线",
  "searchResult.viewGoogleMaps": "在 Google Maps 中查看",
  "searchResult.tryGoogleMaps": "尝试在 Google Maps 中搜索",
  "searchResult.disclaimer": "票价来自运营商，可能会变动 · 行程时间为估算值 · 附近信息来自 Google",

  // Route card
  "route.approximateTime": "预估时间，站到站（不含进出站步行时间）",
  "route.viewRealTime": "查看实时",
  "route.routeNumber": "路线 {n}",
  "route.baht": "泰铢",
  "route.minutes": "~{n} 分钟",
  "route.noTransfer": "直达 — 无需换乘",
  "route.transfers": "换乘 {n} 次",
  "route.stations": "{n} 站",
  "route.waitTime": "等车 ~{n} 分钟",
  "route.intermediateStations": "{n} 个中间站",
  "route.transfer": "换乘 · 步行 ~{n} 分钟",
  "route.total": "合计：",
  "route.priceDisclaimer": "票价来自运营商，可能会变动",
  "route.free": "免费",

  // Passenger types
  "passenger.adult": "成人",
  "passenger.student": "学生",
  "passenger.senior": "老年人",
  "passenger.child": "儿童",

  // Station explore
  "explore.map": "地图",
  "explore.food": "美食",
  "explore.cafe": "咖啡馆",
  "explore.places": "景点",
  "explore.hotel": "酒店",
  "explore.shopping": "购物",
  "explore.carRental": "租车",
  "explore.nearStation": "{station}站附近的{label}",

  // Quick links
  "quickLinks.googleMapsRoute": "Google Maps 路线",
  "quickLinks.hotelsNearDest": "目的地附近酒店",
  "quickLinks.carRentalNearDest": "目的地附近租车",
  "quickLinks.servicesNear": "{station}附近更多服务",

  // Lines page
  "lines.allLines": "所有列车线路",
  "lines.summary": "{lines} 条线路 · {stations} 个车站",
  "lines.stationCount": "{n} 站",
  "lines.trainEvery": "每 ~{n} 分钟一班",
  "lines.loop": "环线",
  "lines.interchange": "换乘：",
  "lines.operator": "运营商：",
  "lines.allStations": "所有车站",

  // Station page
  "station.notFound": "未找到车站",
  "station.interchanges": "换乘点",
  "station.nearbyPlaces": "附近地点",
  "station.searchFromHere": "从此站搜索路线",
  "station.searchFrom": "从{station}搜索路线",
  "station.walkMinutes": "步行 ~{n} 分钟",

  // Line page
  "line.notFound": "未找到线路",

  // About page
  "about.title": "关于 Thai Transit",
  "about.subtitle": "搜索泰国列车路线",
  "about.whatIs": "Thai Transit 是什么？",
  "about.desc1": "Thai Transit 是一项帮助您查找泰国列车路线的服务。通过简单易用的界面，Thai Transit 为您推荐从出发站到目的站的最佳路线和票价。",
  "about.desc2": "这个路线搜索工具连接了当地信息，如地图、餐厅、咖啡馆、酒店、租车服务和车站周边景点，让您在一个地方完成整个行程规划。",
  "about.desc3": "无论您是第一次来曼谷的游客，还是想找新路线的居民，Thai Transit 都能帮助您自信出行。",
  "about.features": "主要功能",
  "about.feat.search": "路线搜索",
  "about.feat.searchDesc": "输入出发站和目的站，查看所有可能的路线",
  "about.feat.fare": "票价信息",
  "about.feat.fareDesc": "运营商实际票价 — 成人、学生、老年人和儿童",
  "about.feat.maps": "Google Maps 集成",
  "about.feat.mapsDesc": "每个车站附近的地图、餐厅、咖啡馆、酒店和租车服务",
  "about.feat.station": "车站详情",
  "about.feat.stationDesc": "每个车站的完整详情、换乘点和附近地点",
  "about.feat.time": "行程时间",
  "about.feat.timeDesc": "站到站的预估时间和等车时间",
  "about.feat.mobile": "移动端适配",
  "about.feat.mobileDesc": "适用于所有设备，可安装为主屏幕应用",
  "about.coverage": "覆盖的列车线路",
  "about.dataSources": "数据来源",
  "about.dataFare": "票价 — 来自各运营商",
  "about.dataTime": "行程时间 — 根据运营商数据估算（站到站）",
  "about.dataNearby": "附近地点 — 来自 Google Maps",
  "about.dataDisclaimer": "票价和时间来自运营商，可能会变动。出行前请向运营商确认。",
  "about.disclaimer": "免责声明",
  "about.disclaimerText": "Thai Transit 是一个行程规划工具。显示的信息仅供参考，非实时数据。票价和行程时间可能会变动。请直接向运营商确认最新信息。Thai Transit 与 BTS、MRT、ARL 或任何运营商无关。",
  "about.startSearch": "开始搜索路线",
  "about.btsSukhumvit": "BTS 素坤逸线",
  "about.btsSukhumvitStations": "44 站",
  "about.btsSukhumvitRoute": "库科 — 凯哈",
  "about.btsSilom": "BTS 是隆线",
  "about.btsSilomStations": "14 站",
  "about.btsSilomRoute": "国家体育场 — 邦华",
  "about.mrtBlue": "MRT 蓝线",
  "about.mrtBlueStations": "31 站",
  "about.mrtBlueRoute": "环线（塔帕 — 华南蓬）",
  "about.mrtPurple": "MRT 紫线",
  "about.mrtPurpleStations": "16 站",
  "about.mrtPurpleRoute": "空邦派 — 陶普恩",
  "about.arl": "机场快线",
  "about.arlStations": "8 站",
  "about.arlRoute": "素万那普 — 帕亚泰",

  // Error page
  "error.title": "出错了",
  "error.message": "请重试",
  "error.retry": "重试",

  // Not found page
  "notFound.title": "页面未找到",
  "notFound.message": "该页面可能已移动或不存在",
  "notFound.backHome": "返回首页",

  // Footer
  "footer.fareDisclaimer": "票价信息来自运营商，可能会变动",
  "footer.copyright": "Thai Transit © {year} — 搜索 BTS MRT ARL 列车路线",

  // Language
  "lang.th": "ไทย",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.ja": "日本語",
};

export default zh;
