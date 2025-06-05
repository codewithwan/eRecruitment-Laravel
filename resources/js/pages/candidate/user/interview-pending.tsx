import React from "react";

const InterviewPending = () => {  
  return (
    <div className="relative max-w-full">
      <div className="z-10 w-5 h-5 bg-[#d5d6d6] rounded-full absolute left-12"></div>
    <div className="max-w-[1100px] ml-auto bg-[#d5d6d6] shadow-md rounded-2xl pl-2">
      <div className="relative max-w-[1100px] ml-auto bg-[#f2f5fe] rounded-2xl space-y-2 px-10 py-8">
        <button className="absolute top-8 right-8 bg-[#d5d6d6] text-white px-4 py-2 rounded-xl">
          Menunggu
        </button>

        <div className="text-gray-800 font-semibold text-[28px]">
          Wawancara
        </div>
        <div className="text-gray-500 font-normal text-lg">
          Menunggu penyelesaian tahap sebelumnya
        </div>                                        
      </div>
    </div>
    </div>
  );
};

export default InterviewPending;