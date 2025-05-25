import React from "react";

const InterviewOngoing = () => {  
  return (
    <div className="relative max-w-full">
      <div className="z-10 w-5 h-5 bg-[#2b7fff] rounded-full absolute left-12"></div>
    <div className="max-w-[1100px] ml-auto bg-[#2b7fff] shadow-md rounded-2xl pl-2">
      <div className="relative max-w-[1100px] ml-auto bg-[#f2f5fe] rounded-2xl space-y-2 px-10 py-8">
        <button className="absolute top-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Berjalan
        </button>

        <div className="text-gray-800 font-semibold text-[28px]">
          Wawancara
        </div>
        <div className="text-gray-500 font-normal text-lg">
          Dijadwalkan pada 15 Mar 2025
        </div>
        <div className="max-w-full bg-[#dee9fe] rounded-2xl p-8 space-y-4 mt-6">
          <div className="text-[#1565c0] font-semibold text-xl">Detail</div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-gray-800 font-medium text-lg">Tanggal & Waktu
                <div className="text-gray-500 font-normal text-lg">15 Mar 2025, 10:00 WIB</div>
              </div>
              <div className="text-gray-800 font-medium text-lg">Lokasi
                <div className="text-gray-500 font-normal text-lg">Online via Google Meet</div>
              </div>
            </div>
        </div>
        <div className="max-w-full bg-[#f8e4e4] rounded-2xl p-6 space-y-4 mt-6 text-gray-800 text-md font-medium text-center">
          Harap periksa email dan pesan anda secara berkala untuk informasi lebih lanjut.
        </div>
        <div className="p-6">
          <button className="absolute right-10 bottom-8 bg-[#f2f5fe] text-[#2b7fff] font-semibold text-sm px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition">
            Persiapan Tes
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default InterviewOngoing;
