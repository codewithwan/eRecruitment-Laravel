import React from "react";

const AssesmentOngoing = () => {  
  return (
    <div className="relative max-w-full">
      <div className="z-10 w-5 h-5 bg-[#2b7fff] rounded-full absolute left-12"></div>
      <div className="max-w-[1100px] ml-auto bg-[#2b7fff] shadow-md rounded-2xl pl-2">
        <div className="relative max-w-[1100px] ml-auto bg-[#f2f5fe] rounded-2xl space-y-2 px-10 py-8">
          <button className="absolute top-8 right-8 bg-[#2b7fff] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Berjalan
          </button>
          <div className="text-gray-800 font-semibold text-[28px]">
            Tes Assesment
          </div>
          <div className="text-gray-500 font-normal text-lg">
            Dijadwalkan pada 12 Mar 2025
          </div>
          <div className="max-w-full bg-[#dee9fe] rounded-2xl p-8 space-y-4 mt-6">
            <div className="text-[#1565c0] font-semibold text-xl">Detail</div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-gray-800 font-medium text-lg">Tanggal & Waktu
                <div className="text-gray-500 font-normal text-lg">12 Mar 2025, 09:30 WIB</div>
              </div>
              <div className="text-gray-800 font-medium text-lg">Jenis Tes
                <div className="text-gray-500 font-normal text-lg">Lorem Ipsum Dolor Sit Amet</div>
              </div>
              <div className="text-gray-800 font-medium text-lg">Lokasi
                <div className="text-gray-500 font-normal text-lg">Online via Web</div>
              </div>
              <div className="text-gray-800 font-medium text-lg">Durasi
                <div className="text-gray-500 font-normal text-lg">120 Menit</div>
              </div>
            </div>
            <div className="max-w-full bg-[#f2f5fe] rounded-2xl p-6 space-y-1">
              <div className="text-[#1565c0] font-semibold text-xl">Tips Mengerjakan Tes</div>
              <ul className="list-disc list-inside text-gray-500 text-lg font-normal">
                <li>Pastikan Anda memiliki waktu istirahat yang cukup sebelum mengikuti tes</li>
                <li>Konsumsi sarapan untuk menjaga stamina dan konsentrasi</li>
                <li>Jawablah setiap pertanyaan dengan jujur sesuai dengan kepribadian Anda</li>
                <li>Kelola waktu secara efektif, tetap tenang, dan percaya diri dalam menjawab</li>
              </ul>
            </div>
            <div className="max-w-full bg-[#2b7fff] rounded-2xl p-6">
              <div className="text-[#f2f5fe] font-medium text-lg">"Kami senang Anda telah mencapai tahap ini dalam proses rekrutmen. Percayalah pada kemampuan Anda dan tunjukkan potensi terbaik Anda. Semoga sukses!"</div>
            </div>
            <div className="p-4">
              <button className="absolute right-18 bottom-14 bg-[#f2f5fe] text-[#2b7fff] font-semibold text-sm px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition">
                Persiapan Tes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssesmentOngoing;
