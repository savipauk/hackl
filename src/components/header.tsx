import "@/styles/header.css";

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
      <a href="https://www.zagreb.hr/">
        <img src="/zagreb.svg" alt="Zagreb" />
      </a>
      <div className="w-[80%]">
        <h1>Sport na volej!</h1>
      </div>
      <div className="w-[10%] flex justify-end">
        <img id="profile" src="/profile.svg" alt="Profile" />
      </div>
    </div>
  );
}
