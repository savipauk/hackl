import "@/styles/header.css";
import { appTitle } from "@/lib/globals";

export default function AdminHeader() {
  return (
    <div className="header">
      <a className="w-[10%] sm:none md:flex items-center justify-center" id="zagreb" href="https://www.zagreb.hr/" target="_blank">
        <img src="/zagreb.svg" alt="Zagreb" />
      </a>
      <div className="w-[80%]">
        <h1>{appTitle}</h1>
      </div>
      <a className="w-[10%] flex items-center justify-center" href="/">
        Odjavi se
      </a>
    </div>
  );
}
