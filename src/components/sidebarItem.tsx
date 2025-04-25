import "@/styles/sidebarItem.css";

interface SidebarItemProps {
  title: string;
}

export default function SidebarItem(sidebarItemProps: SidebarItemProps) {
  return (
    <div className="sidebar-item">
      <h2>{sidebarItemProps.title}</h2>
    </div>
  );
}
