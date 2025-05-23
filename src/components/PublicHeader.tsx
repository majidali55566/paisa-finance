import { Button } from "./ui/button";

const PublicHeader = () => {
  return (
    <header className="fixed  w-full flex justify-center md:top-4  z-50 ">
      <div className=" w-full md:w-2xl max-w-3xl z-50 px-4 sm:ps-6 lg:px-8 shadow-md bg-white border md:rounded-2xl">
        <div className="flex justify-between h-16 items-center ">
          <div>
            <h1 className="text-xl font-bold">
              Paisa <span className="text-gray-400">Sambhalo</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Sign in</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
