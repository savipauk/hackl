import { useState } from "react";
import "@/styles/teamInfo.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TeamInfo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <Header
                  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                  isSidebarOpen={isSidebarOpen}
                />
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Club Info */}
        <section className="club-info">
          <img src="/dinamo-logo.png" alt="NK Dinamo" className="club-logo" />
          <h2 className="club-name">NK Dinamo</h2>
          <p className="club-description">
            NK Dinamo Zagreb je najtrofejniji i jedan od najpoznatijih nogometnih klubova u Hrvatskoj,
            osnovan 1945. godine. Klub igra svoje domaće utakmice na stadionu Maksimir u Zagrebu.
            Dinamo je poznat po svojoj snažnoj školi mladih igrača te brojnim nastupima u europskim
            natjecanjima poput Lige prvaka i Europske lige. Tijekom svoje povijesti, Dinamo je osvojio
            brojne domaće naslove i kupove, te je često bio temelj hrvatske nogometne reprezentacije.
          </p>
        </section>

        {/* Training List */}
        <section className="training-section">
          <h3 className="training-title">POPIS TRENINGA</h3>
          <div className="training-table-wrapper">
            <table className="training-table">
              <thead>
                <tr>
                  <th>DATUM</th>
                  <th>VRIJEME</th>
                  <th>LOKACIJA</th>
                  <th>KATEGORIJA</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>26.04.2025.</td>
                    <td>18:00</td>
                    <td>NS Maksimir</td>
                    <td>Juniori</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
