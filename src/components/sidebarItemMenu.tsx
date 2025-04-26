import { SportInfoOutput } from "@/lib/types";
import SidebarItem from "./sidebarItem";
import "@/styles/sidebarItemMenu.css";

interface SidebarItemMenuProps {
  sportInfo?: SportInfoOutput;
}

export default function SidebarItemMenu({ sportInfo }: SidebarItemMenuProps) {
  return (
    <div className="flex justify-end ">
      <div className={"w-[90%] flex flex-col itemHolder"}>
        {sportInfo?.categories.map((category) => (
          <SidebarItem title={category.category} events />
        ))}
      </div>
    </div>
  );
}
