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

  const [eventData, setEventData] = useState({
    dateTime: "",
    homeTeam: "",
    awayTeam: "",
  });

  const [clubData, setClubData] = useState({
    name: "",
  });

  const [teamMemberData, setTeamMemberData] = useState({
    clubName: "",
    fullName: "",
  });

  const [rankData, setRankData] = useState({
    name: "",
  });

  const [resultData, setResultData] = useState({
    match: "",
    homeTeam: "",
    awayTeam: "",
  });

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dodavanje događaja:", eventData);
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dodavanje kluba:", clubData);
  };

  const handleTeamMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dodavanje člana tima:", teamMemberData);
  };

  const handleRankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dodavanje ranga:", rankData);
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upis rezultata:", resultData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: Function) => {
    const { name, value } = e.target;
    setter((prev: any) => ({ ...prev, [name]: value }));
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
                className={`tab-button ${activeTab === "addRank" ? "active" : ""}`}
                onClick={() => setActiveTab("addRank")}
              >
                UNOS RANGA
              </button>
              <button
                className={`tab-button ${activeTab === "addClub" ? "active" : ""}`}
                onClick={() => setActiveTab("addClub")}
              >
                UNOS KLUBA
              </button>
              <button
                className={`tab-button ${activeTab === "addResult" ? "active" : ""}`}
                onClick={() => setActiveTab("addResult")}
              >
                UNOS REZULTATA
              </button>
              <button
                className={`tab-button ${activeTab === "addTeamMember" ? "active" : ""}`}
                onClick={() => setActiveTab("addTeamMember")}
              >
                DODAVANJE ČLANA
              </button>
              <button
                className={`tab-button ${activeTab === "addEvent" ? "active" : ""}`}
                onClick={() => setActiveTab("addEvent")}
              >
                DODAVANJE DOGAĐAJA
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="form-card">
            {activeTab === "addEvent" && (
              <>
                <h2 className="form-title">Dodavanje novog događaja</h2>
                <form onSubmit={handleEventSubmit} className="form">
                  <div className="form-group">
                    <label>DATUM I VRIJEME</label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      value={eventData.dateTime}
                      onChange={(e) => handleInputChange(e, setEventData)}
                    />
                  </div>
                  <div className="form-group">
                    <label>DOMAĆI TIM</label>
                    <input
                      type="text"
                      name="homeTeam"
                      value={eventData.homeTeam}
                      onChange={(e) => handleInputChange(e, setEventData)}
                    />
                  </div>
                  <div className="form-group">
                    <label>GOSTUJUĆI TIM</label>
                    <input
                      type="text"
                      name="awayTeam"
                      value={eventData.awayTeam}
                      onChange={(e) => handleInputChange(e, setEventData)}
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    Dodaj
                  </button>
                </form>
              </>
            )}

            {activeTab === "addClub" && (
              <>
                <h2 className="form-title">Dodavanje kluba</h2>
                <form onSubmit={handleClubSubmit} className="form">
                  <div className="form-group">
                    <label>NAZIV KLUBA</label>
                    <input
                      type="text"
                      name="name"
                      value={clubData.name}
                      onChange={(e) => handleInputChange(e, setClubData)}
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    Dodaj
                  </button>
                </form>
              </>
            )}

            {activeTab === "addTeamMember" && (
              <>
                <h2 className="form-title">Dodavanje člana tima</h2>
                <form onSubmit={handleTeamMemberSubmit} className="form">
                  <div className="form-group">
                    <label>NAZIV KLUBA</label>
                    <input
                      type="text"
                      name="clubName"
                      value={teamMemberData.clubName}
                      onChange={(e) => handleInputChange(e, setTeamMemberData)}
                    />
                  </div>
                  <div className="form-group">
                    <label>IME I PREZIME</label>
                    <input
                      type="text"
                      name="fullName"
                      value={teamMemberData.fullName}
                      onChange={(e) => handleInputChange(e, setTeamMemberData)}
                    />
                  </div>
                  <div className="divider"></div>
                  <button type="submit" className="submit-button">
                    Dodaj
                  </button>
                </form>
              </>
            )}

            {activeTab === "addRank" && (
              <>
                <h2 className="form-title">Dodavanje ranga</h2>
                <form onSubmit={handleRankSubmit} className="form">
                  <div className="form-group">
                    <label>NAZIV RANGA</label>
                    <input
                      type="text"
                      name="name"
                      value={rankData.name}
                      onChange={(e) => handleInputChange(e, setRankData)}
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    Dodaj
                  </button>
                </form>
              </>
            )}

            {activeTab === "addResult" && (
              <>
                <h2 className="form-title">Unos rezultata</h2>
                <form onSubmit={handleResultSubmit} className="form">
                  <div className="form-group">
                    <label>UTAKMICA</label>
                    <input
                      type="text"
                      name="match"
                      value={resultData.match}
                      onChange={(e) => handleInputChange(e, setResultData)}
                    />
                  </div>
                  <div className="form-group">
                    <label>DOMAĆI TIM</label>
                    <input
                      type="text"
                      name="homeTeam"
                      value={resultData.homeTeam}
                      onChange={(e) => handleInputChange(e, setResultData)}
                    />
                  </div>
                  <div className="form-group">
                    <label>GOSTUJUĆI TIM</label>
                    <input
                      type="text"
                      name="awayTeam"
                      value={resultData.awayTeam}
                      onChange={(e) => handleInputChange(e, setResultData)}
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
