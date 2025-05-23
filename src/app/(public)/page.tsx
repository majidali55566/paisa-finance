import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="">
      <section className="pt-5 px-4 grid bg-gradient-to-tr from-gray-400 to-secondary animate-gradient-shift h-dvh inset-0">
        <div className="h-16"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => {
            const size = Math.floor(Math.random() * 100 + 50);
            return (
              <div
                key={i}
                className="absolute rounded-full bg-secondary/30"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}vw`,
                  top: `${Math.random() * 100}vh`,
                }}
              />
            );
          })}
        </div>
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-8xl  font-bold text-center z-40">
            Keep Finances
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-center">
            Under Control
          </h1>
        </div>
        <div className="relative">
          <p className="mx-auto text-lg sm:text-xl  max-w-2xl mx-auto text-center z-40">
            Powerful tools to track, analyze, and optimize your money flow with
            beautiful visualizations
          </p>
        </div>
        <div className="mx-auto relative">
          <Button className="py-6 md:py-8 font-bold rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30">
            Get Started Free
          </Button>
        </div>
        <div className="flex flex-col items-center relative z-40">
          <div className="flex -space-x-4">
            {[...Array(5)].map((_, i) => (
              <Image
                key={i}
                width={40}
                height={40}
                className="w-12 h-12 rounded-full border-2 border-white shadow-xl"
                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                alt="User"
              />
            ))}
          </div>
          <p className="mt-4 text-sm sm:text-base">
            Trusted by 10,000+ financial enthusiasts
          </p>
        </div>
      </section>
      <section className="w-full py-20">
        <div className="mx-auto w-full max-w-7xl px-4 grid gap-8">
          <div className="mx-auto grid gap-4">
            <h1 className="text-3xl font-bold text-center">
              Smart Finance Management, Powered by AI
            </h1>
            <h2 className="text-lg text-center">
              Track, Analyze, and Optimize Your Money Effortlessly
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-auto">
            <div className="relative flex flex-col justify-between min-h-[15rem] shadow-custom-inset-card bg-linear-to-t from-[#fafafa] to-[#ffff] hover:to-secondary p-4 max-w-[20rem] border rounded-2xl">
              <Image
                src="/assets/icons8-lock.gif"
                style={{ background: "transparent" }}
                width={40}
                height={40}
                alt="lock icon"
              />
              <div className="grid gap-2">
                <h1 className="text-xl font-medium">
                  Secure Login & Multi-Account
                </h1>
                <ul className="text-gray-700">
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Personalized Dashboard with multiple accounts
                    </span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Seamless switching between accounts
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative flex flex-col justify-between min-h-[15rem] shadow-custom-inset-card bg-linear-to-t from-[#fafafa] to-[#ffff] hover:to-secondary p-4 max-w-[20rem] border rounded-2xl">
              <Image
                src="/assets/scangf.gif"
                style={{ background: "transparent" }}
                width={40}
                height={40}
                alt="lock icon"
              />
              <div className="grid gap-2">
                <h1 className="text-xl font-medium">Snap & Autofill</h1>
                <ul className="text-gray-700">
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Take a photo of your receipt → AI extracts{" "}
                    </span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      No more manual entry! Saves time
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative flex flex-col justify-between min-h-[15rem] shadow-custom-inset-card bg-linear-to-t from-[#fafafa] to-[#ffff] hover:to-secondary p-4 max-w-[20rem] border rounded-2xl">
              <Image
                src="/assets/visulize.gif"
                style={{ background: "transparent" }}
                width={40}
                height={40}
                alt="visualize icon"
              />
              <div className="grid gap-2">
                <h1 className="text-xl font-medium">Visual Account Overview</h1>
                <ul className="text-gray-700">
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Clean graphs show balances, income vs. expenses.
                    </span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Shows Trends</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative flex flex-col justify-between min-h-[15rem] shadow-custom-inset-card bg-linear-to-t from-[#fafafa] to-[#ffff] hover:to-secondary p-4 max-w-[20rem] border rounded-2xl">
              <Image
                src="/assets/icons8-chatbot.gif"
                style={{ background: "transparent" }}
                width={40}
                height={40}
                alt="visualize icon"
              />
              <div className="grid gap-2">
                <h1 className="text-xl font-medium">
                  {" "}
                  Personalized Insights with
                </h1>
                <ul className="text-gray-700">
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Spending trends</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Upcoming bills</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">AI suggestions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-16 bg-gradient-to-tr from-gray-400 to-secondary">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Financial Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beautifully organized insights across all your accounts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
              <Image
                src="/images/multiple-accounts.png"
                alt="Account overview dashboard"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
              <div className="p-4 bg-gray-50">
                <h3 className="font-medium text-gray-800">Account Overview</h3>
                <p className="text-sm text-gray-500">
                  Track all your finances in one place
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
              <Image
                src="/images/dashboardpreview.png"
                alt="Transaction analytics dashboard"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
              <div className="p-4 bg-gray-50">
                <h3 className="font-medium text-gray-800">Smart Analytics</h3>
                <p className="text-sm text-gray-500">
                  AI-powered spending insights
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="py-6 md:py-8 font-bold rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
