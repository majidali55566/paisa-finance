import Link from "next/link";
import { Button } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { LayoutDashboard } from "lucide-react";

const PublicHeader = async () => {
  const session = await getServerSession(authOptions);
  return (
    <header className="fixed  w-full flex justify-center md:top-4  z-50 ">
      <div className=" w-full md:w-2xl max-w-3xl z-50 px-4 sm:ps-6 lg:px-8 shadow-md bg-white border md:rounded-2xl">
        <div className="flex justify-between h-16 items-center ">
          <div>
            <h1 className="text-xl font-bold">
              <Link href="/">
                Paisa<span className="text-gray-400">Sambhalo</span>
              </Link>
            </h1>
          </div>
          <div className="flex gap-2">
            {!session?.user._id ? (
              <div className="flex items-center gap-1">
                <Button variant="outline">
                  <Link href="/login">Login</Link>
                </Button>

                <Button>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              <Button className="" variant="outline">
                <LayoutDashboard />
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
