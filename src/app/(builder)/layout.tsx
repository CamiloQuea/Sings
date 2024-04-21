import Link from "next/link";
import { ReactNode } from "react";
import { GoPackage } from "react-icons/go";
import { CommandToolSearch } from "./components/command-tool-search";

const BuilderLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex p-4">
            <nav className="flex  gap-6 text-lg  ">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <GoPackage className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
            </nav>
            <CommandToolSearch />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BuilderLayout;
