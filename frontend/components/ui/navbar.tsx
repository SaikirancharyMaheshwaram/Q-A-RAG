import Image from "next/image";
import { Button } from "./button";
import { MenuIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="h-12 py-8 items-center flex justify-between px-2 rounded-xl ">
      <div className="text-lg font-semibold text-white">
        <div className="flex items-center">
          <Image
            src={"/knowflowicon.png"}
            alt=""
            height={50}
            width={50}
            className=""
          />
          <div className="text-xl">KnowFlow</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-white text-amber-700 rounded-4xl text-lg">
          Login
        </Button>
        <div className=" border-2 rounded-full p-1">
          <MenuIcon color="white " />
        </div>
      </div>
    </div>
  );
};
