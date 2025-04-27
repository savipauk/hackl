import { useState } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Carousel from "@/components/carousel";

// type Sport = {
//   id: string;
//   sportName: string;
//   description: string;
//   createdAt: string;
// };

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[15vh]">
        <Header
          onMenuToggle={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
      <div className="flex min-h-[77vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="content">
          <h1>Sportski savez Grada Zagreba</h1>
          <hr />
          <p>
            Sportski savez Grada Zagreba krovna je sportska organizacija koja
            okuplja 77 sportskih saveza i obuhvaća više od 90 različitih
            sportova. Njegova je misija razvoj zagrebačkog sporta kroz potporu
            klubovima, savezima i sportašima svih dobnih skupina.
          </p>
          <Carousel />
          <h1>Dodaj novi sportski događaj!</h1>
          <hr />
          <p>
            Dodajte novi sportski događaj koji još nije zabilježen na našoj
            stranici i doprinesite promociji zagrebačkog sporta!
          </p>
          <div className="flex flex-col justify-center items-center">
            <button
              className="addButton"
              onClick={() => router.push("/eventsManager")} // Promijenite ovu liniju
            >
              Dodaj!
            </button>
          </div>
        </div>
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
