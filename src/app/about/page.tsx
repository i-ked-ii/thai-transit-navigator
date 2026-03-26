import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "เกี่ยวกับ Thai Transit",
  description:
    "Thai Transit คือบริการค้นหาเส้นทางรถไฟฟ้าในประเทศไทย แนะนำเส้นทาง ราคา และข้อมูลสถานที่ใกล้เคียง",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">🚆</span>
        <h1 className="text-3xl font-bold mb-2">
          Thai<span className="text-blue-600">Transit</span>
        </h1>
        <p className="text-gray-500 text-lg">
          ค้นหาเส้นทางรถไฟฟ้าในประเทศไทย
        </p>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Thai Transit คืออะไร?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          <strong>Thai Transit</strong> คือบริการที่นำเสนอเส้นทางรถไฟฟ้าในประเทศไทย
          ด้วยการใช้งานที่ง่าย Thai Transit จะแนะนำเส้นทางที่เหมาะสมที่สุดและราคาค่าโดยสารจากสถานีต้นทางไปยังสถานีปลายทาง
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          ระบบค้นหาเส้นทางนี้ถูกสร้างขึ้นเพื่อให้สามารถเชื่อมโยงข้อมูลในพื้นที่
          เช่น ข้อมูลแผนที่ ร้านอาหาร คาเฟ่ โรงแรม เช่ารถ และสถานที่น่าสนใจรอบสถานี
          จากผลการค้นหาได้ ทำให้คุณวางแผนการเดินทางได้ครบจบในที่เดียว
        </p>
        <p className="text-gray-600 leading-relaxed">
          ไม่ว่าคุณจะเป็นนักท่องเที่ยวที่มาเยือนกรุงเทพฯ เป็นครั้งแรก
          หรือผู้อยู่อาศัยที่ต้องการหาเส้นทางใหม่ Thai Transit พร้อมช่วยคุณเดินทางอย่างมั่นใจ
        </p>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">คุณสมบัติหลัก</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: "🔍", title: "ค้นหาเส้นทาง", desc: "กรอกสถานีต้นทาง-ปลายทาง แสดงทุกเส้นทางที่เป็นไปได้" },
            { icon: "💰", title: "ราคาค่าโดยสาร", desc: "แสดงราคาจริงจากผู้ให้บริการ แยกผู้ใหญ่ นักเรียน ผู้สูงอายุ เด็ก" },
            { icon: "🗺️", title: "เชื่อมโยง Google Maps", desc: "แผนที่ ร้านอาหาร คาเฟ่ โรงแรม เช่ารถ รอบทุกสถานี" },
            { icon: "🚉", title: "ข้อมูลสถานี", desc: "รายละเอียดทุกสถานี จุดเปลี่ยนสาย สถานที่ใกล้เคียง" },
            { icon: "⏱", title: "เวลาเดินทาง", desc: "แสดงเวลาโดยประมาณ สถานีถึงสถานี พร้อมเวลารอรถ" },
            { icon: "📱", title: "รองรับมือถือ", desc: "ใช้งานได้ทุกอุปกรณ์ ติดตั้งเป็นแอปบนหน้าจอได้" },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-medium text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">สายรถไฟฟ้าที่ครอบคลุม</h2>
        <div className="space-y-2">
          {[
            { color: "#7DC242", name: "BTS สายสุขุมวิท", stations: "44 สถานี", route: "คูคต — เคหะฯ", href: "/line/bts-sukhumvit" },
            { color: "#00847F", name: "BTS สายสีลม", stations: "14 สถานี", route: "สนามกีฬาแห่งชาติ — บางหว้า", href: "/line/bts-silom" },
            { color: "#1E3A8A", name: "MRT สายสีน้ำเงิน", stations: "31 สถานี", route: "วงรอบ (ท่าพระ — หัวลำโพง)", href: "/line/mrt-blue" },
            { color: "#800080", name: "MRT สายสีม่วง", stations: "16 สถานี", route: "คลองบางไผ่ — เตาปูน", href: "/line/mrt-purple" },
            { color: "#E4002B", name: "แอร์พอร์ต เรล ลิงก์", stations: "8 สถานี", route: "สุวรรณภูมิ — พญาไท", href: "/line/arl" },
          ].map((line) => (
            <Link
              key={line.name}
              href={line.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{line.name}</span>
                <span className="text-xs text-gray-400 ml-2">{line.stations}</span>
                <p className="text-xs text-gray-400 truncate">{line.route}</p>
              </div>
              <span className="text-gray-300">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">แหล่งข้อมูล</h2>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>ราคาค่าโดยสาร — อ้างอิงจากผู้ให้บริการแต่ละราย</li>
          <li>เวลาเดินทาง — ประมาณการจากข้อมูลผู้ให้บริการ (สถานีถึงสถานี)</li>
          <li>ข้อมูลสถานที่ใกล้เคียง — เชื่อมโยงจาก Google Maps</li>
        </ul>
        <p className="text-xs text-gray-400 mt-3">
          ราคาและเวลาอ้างอิงจากผู้ให้บริการ อาจมีการเปลี่ยนแปลง กรุณาตรวจสอบกับผู้ให้บริการก่อนเดินทาง
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">ข้อจำกัดความรับผิดชอบ</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Thai Transit เป็นเครื่องมือช่วยวางแผนการเดินทาง ข้อมูลที่แสดงเป็นข้อมูลอ้างอิงเท่านั้น
          ไม่ใช่ข้อมูลแบบเรียลไทม์ ราคาค่าโดยสารและเวลาเดินทางอาจมีการเปลี่ยนแปลงได้
          กรุณาตรวจสอบข้อมูลล่าสุดจากผู้ให้บริการโดยตรงก่อนเดินทาง
          Thai Transit ไม่มีส่วนเกี่ยวข้องกับ BTS, MRT, ARL หรือผู้ให้บริการรถไฟฟ้ารายใด
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          เริ่มค้นหาเส้นทาง
        </Link>
      </div>
    </div>
  );
}
