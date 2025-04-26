import { useState } from "react";
import "@/styles/eventsManager.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

type ActiveTab = 
  "addEvent" | 
  "addClub" | 
  "addTeamMember" | 
  "addRank" | 
  "addResult";

export default function EventsManager() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [activeTab, setActiveTab] = useState<ActiveTab>("addEvent");

  const [formData, setFormData] = useState({
    sport: "",
    title: "",
    dateTime: "",
    oib: "",
    legalPerson: "",
    responsiblePerson: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prijedlog događaja:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="header-wrapper">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Main content */}
      <div className="main-content">

      <div className="cover">
          <h1 className="events flex h-[100%] justify-center items-end">
            OSTALO
          </h1>
        </div>


        <Sidebar isOpen={isSidebarOpen} />
        <div className="content-area">
          
          {/* Tab navigation */}
          <div className="tab-section">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === "addEvent" ? "active" : ""}`}
                onClick={() => setActiveTab("addEvent")}
              >
                UNOS RANGA
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="form-card">
            {activeTab === "addEvent" && (
              <>
                <h2 className="form-title">Dodavanje novog događaja</h2>
                <form onSubmit={handleSubmit} className="form">
                    
                <div className="form-group">
                <label>SPORT</label>
                <input
                  type="text"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  required
                />
              </div>

                <div className="form-group">
                <label>NAZIV</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>DATUM I VRIJEME</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>OIB PRAVNE OSOBE</label>
                <input
                  type="text"
                  name="oib"
                  value={formData.oib}
                  onChange={handleChange}
                  pattern="\d{11}"
                  title="OIB mora imati 11 znamenki"
                  required
                />
              </div>

              <div className="form-group">
                <label>IME I PREZIME PRAVNE OSOBE</label>
                <input
                  type="text"
                  name="legalPerson"
                  value={formData.legalPerson}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ODGOVORNA OSOBA</label>
                <input
                  type="text"
                  name="responsiblePerson"
                  value={formData.responsiblePerson}
                  onChange={handleChange}
                  required
                />
              </div>
                  <button type="submit" className="submit-button">
                    Dodaj
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-wrapper">
        <Footer />
        <span className="footer-text">Sva prava pridržana. ©2025. kella.dev</span>
      </div>
    </div>
  );
}