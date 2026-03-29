const ja: Record<string, string> = {
  // Navigation
  "nav.search": "検索",
  "nav.lines": "路線",
  "nav.about": "概要",
  "nav.home": "ホーム",

  // Home page
  "home.title": "列車ルートを",
  "home.titleHighlight": "検索",
  "home.subtitle": "BTS · MRT · ARL — 運賃・ルート・所要時間",
  "home.btsSukhumvit": "BTS スクンビット線",
  "home.btsSilom": "BTS シーロム線",
  "home.mrtBlue": "MRT ブルーライン",
  "home.mrtPurple": "MRT パープルライン",

  // Search form
  "search.origin": "出発駅",
  "search.destination": "到着駅",
  "search.originPlaceholder": "駅名 例: Siam, Asok, N8...",
  "search.destinationPlaceholder": "駅名 例: Mo Chit, Hua Lamphong...",
  "search.swapStations": "出発駅と到着駅を入れ替え",
  "search.searchRoute": "ルート検索",
  "search.newSearch": "新しい検索",
  "search.swapRoute": "ルートを入れ替え",
  "search.swapOriginDest": "出発-到着を入れ替え",
  "search.clear": "クリア",

  // Search results page
  "searchResult.selectStations": "出発駅と到着駅を選択してください",
  "searchResult.backToSearch": "検索に戻る",
  "searchResult.stationNotFound": "駅が見つかりません",
  "searchResult.foundRoutes": "{count} ルート見つかりました",
  "searchResult.noRoutes": "選択した駅間の列車ルートが見つかりません",
  "searchResult.viewGoogleMaps": "Google Maps で表示",
  "searchResult.tryGoogleMaps": "Google Maps で検索してみる",
  "searchResult.disclaimer": "運賃は各事業者提供、変更の可能性あり · 所要時間は目安 · 周辺情報は Google より",

  // Route card
  "route.approximateTime": "目安時間、駅間（駅の入出場時間を除く）",
  "route.viewRealTime": "リアルタイム表示",
  "route.routeNumber": "ルート {n}",
  "route.baht": "バーツ",
  "route.minutes": "約{n}分",
  "route.noTransfer": "直通 — 乗り換え不要",
  "route.transfers": "乗り換え {n} 回",
  "route.stations": "{n} 駅",
  "route.waitTime": "待ち時間 約{n}分",
  "route.intermediateStations": "途中 {n} 駅",
  "route.transfer": "乗り換え · 徒歩約{n}分",
  "route.total": "合計：",
  "route.priceDisclaimer": "運賃は各事業者提供、変更の可能性あり",
  "route.free": "無料",

  // Passenger types
  "passenger.adult": "大人",
  "passenger.student": "学生",
  "passenger.senior": "シニア",
  "passenger.child": "子供",

  // Station explore
  "explore.map": "地図",
  "explore.food": "グルメ",
  "explore.cafe": "カフェ",
  "explore.places": "観光地",
  "explore.hotel": "ホテル",
  "explore.shopping": "ショッピング",
  "explore.carRental": "レンタカー",
  "explore.nearStation": "{station}駅周辺の{label}",

  // Quick links
  "quickLinks.googleMapsRoute": "Google Maps ルート",
  "quickLinks.hotelsNearDest": "目的地周辺のホテル",
  "quickLinks.carRentalNearDest": "目的地周辺のレンタカー",
  "quickLinks.servicesNear": "{station}周辺のサービス",

  // Lines page
  "lines.allLines": "全路線一覧",
  "lines.summary": "{lines} 路線 · {stations} 駅",
  "lines.stationCount": "{n} 駅",
  "lines.trainEvery": "約{n}分間隔",
  "lines.loop": "環状線",
  "lines.interchange": "乗り換え：",
  "lines.operator": "事業者：",
  "lines.allStations": "全駅一覧",

  // Station page
  "station.notFound": "駅が見つかりません",
  "station.interchanges": "乗り換え",
  "station.nearbyPlaces": "周辺スポット",
  "station.searchFromHere": "この駅からルートを検索",
  "station.searchFrom": "{station}からルートを検索",
  "station.walkMinutes": "徒歩約{n}分",

  // Line page
  "line.notFound": "路線が見つかりません",

  // About page
  "about.title": "Thai Transit について",
  "about.subtitle": "タイの列車ルート検索",
  "about.whatIs": "Thai Transit とは？",
  "about.desc1": "Thai Transit はタイの列車ルートを検索できるサービスです。使いやすいインターフェースで、出発駅から目的駅までの最適なルートと運賃をご案内します。",
  "about.desc2": "このルート検索ツールは、地図、レストラン、カフェ、ホテル、レンタカー、観光スポットなど、各駅周辺の情報と連携しており、一か所で旅行全体を計画できます。",
  "about.desc3": "初めてバンコクを訪れる観光客の方も、新しいルートを探している住民の方も、Thai Transit が安心な移動をお手伝いします。",
  "about.features": "主な機能",
  "about.feat.search": "ルート検索",
  "about.feat.searchDesc": "出発駅と到着駅を入力して、すべての可能なルートを表示",
  "about.feat.fare": "運賃情報",
  "about.feat.fareDesc": "事業者の実際の運賃 — 大人・学生・シニア・子供",
  "about.feat.maps": "Google Maps 連携",
  "about.feat.mapsDesc": "全駅周辺の地図・レストラン・カフェ・ホテル・レンタカー",
  "about.feat.station": "駅情報",
  "about.feat.stationDesc": "全駅の詳細情報・乗り換え・周辺スポット",
  "about.feat.time": "所要時間",
  "about.feat.timeDesc": "駅間の目安時間と待ち時間の表示",
  "about.feat.mobile": "モバイル対応",
  "about.feat.mobileDesc": "すべてのデバイスで利用可能、ホーム画面にアプリとして追加可能",
  "about.coverage": "対応路線",
  "about.dataSources": "データソース",
  "about.dataFare": "運賃 — 各事業者より",
  "about.dataTime": "所要時間 — 事業者データより推定（駅間）",
  "about.dataNearby": "周辺情報 — Google Maps より",
  "about.dataDisclaimer": "運賃と所要時間は各事業者提供で、変更される場合があります。ご利用前に事業者にご確認ください。",
  "about.disclaimer": "免責事項",
  "about.disclaimerText": "Thai Transit は旅行計画ツールです。表示される情報は参考情報であり、リアルタイムではありません。運賃や所要時間は変更される場合があります。最新情報は各事業者に直接ご確認ください。Thai Transit は BTS、MRT、ARL、またはいかなる交通事業者とも提携していません。",
  "about.startSearch": "ルート検索を始める",
  "about.btsSukhumvit": "BTS スクンビット線",
  "about.btsSukhumvitStations": "44 駅",
  "about.btsSukhumvitRoute": "クーコット — ケーハー",
  "about.btsSilom": "BTS シーロム線",
  "about.btsSilomStations": "14 駅",
  "about.btsSilomRoute": "ナショナルスタジアム — バンワー",
  "about.mrtBlue": "MRT ブルーライン",
  "about.mrtBlueStations": "31 駅",
  "about.mrtBlueRoute": "環状線（タープラ — フアランポーン）",
  "about.mrtPurple": "MRT パープルライン",
  "about.mrtPurpleStations": "16 駅",
  "about.mrtPurpleRoute": "クローンバンパイ — タオプーン",
  "about.arl": "エアポートレールリンク",
  "about.arlStations": "8 駅",
  "about.arlRoute": "スワンナプーム — パヤタイ",

  // Error page
  "error.title": "エラーが発生しました",
  "error.message": "もう一度お試しください",
  "error.retry": "再試行",

  // Not found page
  "notFound.title": "ページが見つかりません",
  "notFound.message": "このページは移動されたか、存在しない可能性があります",
  "notFound.backHome": "ホームに戻る",

  // Footer
  "footer.fareDisclaimer": "運賃情報は各事業者提供、変更の可能性あり",
  "footer.copyright": "Thai Transit © {year} — BTS MRT ARL 列車ルート検索",

  // Language
  "lang.th": "ไทย",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.ja": "日本語",
};

export default ja;
