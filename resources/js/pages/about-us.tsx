import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Swiper as SwiperClass} from 'swiper';
import { Navigation } from 'swiper/modules';
import {useSwiper} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/NavbarHeader';

interface WelcomeProps {
    vacancies: JobOpening[];
}

interface JobOpening {
    title: string;
    department: string;
    location: string;
    requirements: string[];
    benefits?: string[];
}

interface CompanySliderProps {
  title: string;
  description: string;
  images: string[];
}


const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const CompanySlider: React.FC<CompanySliderProps> = ({ title, description, images }) => {
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperClass | null>(null);

  return (
    <div className="w-full py-12 bg-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center max-w-6xl mx-auto px-4 gap-6">
        {/* KIRI: Teks */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{description}</p>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="py-2 px-3 bg-blue-500 text-white rounded-md"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="py-2 px-3 bg-blue-500 text-white rounded-md"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* KANAN: Swiper */}
        <Swiper
          modules={[Navigation]}
          navigation={false}
          spaceBetween={16}
          slidesPerView={2}
          className="!pb-8 w-full"
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="rounded-xl w-full h-64 object-cover"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded-xl">
                <span className="text-gray-500">No Images Available</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      {/* TOMBOL DI TENGAH */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Company Info →
        </button>
      </div>
    </div>
  );
};

export default function AboutUs(props: WelcomeProps) {
    const { auth } = usePage<{ auth: { user: any } }>().props;

    return (
        <>
            {/* Header */}
            <Header/>

            {/* Hero Section */}
            <section
                id="about"
                className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
                style={{
                    backgroundImage: "url('/images/1.PNG')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl font-bold mb-4">TENTANG KAMI</h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus.
                    </p>
                </div>
            </section>

            {/* Tentang Kami Section */}
            <section className="relative pt-20 pb-20 bg-white text-gray-800">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl font-bold mb-4 text-blue-600">MITRA KARYA GROUP</h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus, dui felis fringilla justo, at sodales lorem purus sit amet libero. Aliquam erat volutpat. Fusce consectetur viverra massa et aliquet. Vivamus pulvinar pellentesque suscipit. Etiam ultrices mi id ullamcorper elementum.                    </p>
                </div>
            </section>

            {/* Company Profile Section */}
            <section className="bg-white py-12 px-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-full md:w-1/2">
                        <img
                            src="/images/11.PNG"
                            alt="Video Thumbnail"
                            className="rounded-lg shadow-md w-full object-cover h-72"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-2xl font-bold">
                                ▶
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
                        <h2 className="text-2xl font-bold mb-4">Company Profile</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. 
                        </p>
                    </div>
                </div>
            </section>

            {/* Slider Section */}
            <CompanySlider
            title="PT MITRA KARYA ANALITIKA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus."
            images={[
                 "/images/1.PNG",
                 "/images/13.PNG",
                 "/images/12.PNG",
                 "/images/14.PNG",
                 "/images/15.PNG",]}
/>
            <CompanySlider
            title="PT AUTENTIK KARYA ANALITIKA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus."
            images={[
                 "/images/1.PNG",
                 "/images/13.PNG",
                 "/images/12.PNG",
                 "/images/14.PNG",
                 "/images/15.PNG",]}

/>

            <Footer/>
        </>
    );
}
