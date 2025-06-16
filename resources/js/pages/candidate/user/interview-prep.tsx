import React from "react";

const InterviewPrep = () => {  
    return (
        <div className="relative max-w-full ml-auto bg-[#f2f5fe] shadow-md rounded-2xl space-y-6 px-10 py-8">
          <div className="text-gray-800 font-semibold text-[28px]">
            Persiapan Wawancara
          </div>
          <div className="text-gray-500 font-normal text-lg">
            Beberapa hal yang perlu dipersiapkan sebelum wawancara
          </div>
          <div className="text-gray-500 font-normal text-lg">
            Sesi wawancara akan menggali pengalaman, motivasi, dan kecocokan Anda terhadap posisi yang dilamar serta nilai-nilai perusahaan. Kami menyarankan agar Anda:
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="max-w-full bg-[#dee9fe] rounded-2xl p-6 space-y-2">
              <div className="text-gray-800 font-semibold text-lg">Sebelum Hari Wawancara</div>
              <ul className="list-disc list-inside text-gray-500 text-lg font-normal">
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
              </ul>
            </div>
            <div className="max-w-full bg-[#dee9fe] rounded-2xl p-6 space-y-2">
              <div className="text-gray-800 font-semibold text-lg">Pada Hari Wawancara</div>
              <ul className="list-disc list-inside text-gray-500 text-lg font-normal">
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
              </ul>
            </div>
          </div>
          <div className="max-w-full bg-[#e4f8ed] rounded-2xl p-6 space-y-2 text-gray-800 text-md font-medium">
            "Ingatlah bahwa sesi ini adalah kesempatan untuk menunjukkan potensi terbaik Anda. Kami mencari kandidat yang tidak hanya memiliki keterampilan teknis yang tepat, tetapi juga kecocokan dengan nilai-nilai dan budaya perusahaan. Jadilah diri Anda sendiri dan jawab dengan jujur. Kami sangat menantikan untuk melihat bakat Anda!"
          </div>
          <div className="max-w-full bg-[#2b7fff] rounded-2xl p-2 space-y-2 text-[#f2f5fe] text-md font-medium text-center">Link wawancara</div>
        </div>
  );
};

export default InterviewPrep;