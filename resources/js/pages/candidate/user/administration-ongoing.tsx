import React from "react";

const Administration = () => {  
  return (
    <div className="relative max-w-full">
      <div className="z-10 w-5 h-5 bg-[#2b7fff] rounded-full absolute left-12"></div>
    <div className="max-w-[1100px] ml-auto bg-[#2b7fff] shadow-md rounded-2xl pl-2">
      <div className="relative max-w-[1100px] ml-auto bg-[#f2f5fe] rounded-2xl space-y-2 px-10 py-8">
        <button className="absolute top-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Berjalan
        </button>

        <div className="text-gray-800 font-semibold text-[28px]">
          Seleksi Administrasi
        </div>
        <div className="text-gray-500 font-normal text-lg">
          Dijadwalkan Selesai pada 8 Mar 2025
        </div>                                        
      </div>
    </div>
      </div>
  );
};

export default Administration;
