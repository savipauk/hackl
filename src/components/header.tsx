import "@/styles/header.css";
import { appTitle } from "@/lib/globals";

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  return (
    <div className="header">
      <button className="hamburger w-[10%]" onClick={onMenuToggle}>
        <img
          src={!isSidebarOpen ? "/hamburgerClosed.svg" : "/hamburgerOpen.svg"}
          alt="Menu"
        />
      </button>
      <a className="sm:none md:flex" id="zagreb" href="https://www.zagreb.hr/" target="_blank">
        <img src="/zagreb.svg" alt="Zagreb" />
      </a>
      <div className="w-[80%]">
        <a href="/">
        <h1>{appTitle}</h1>
        </a>
      </div>
      <a className="w-[10%] flex justify-end" href="/login">
        <img id="profile" src="/profile.svg" alt="Profile"/>
      </a>
    </div>
  );
}
