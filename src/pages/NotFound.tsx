import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
const NotFound = () => {
  return (
    <>
      <Header />
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32">
        <Sidebar />
        <section className="flex max-w-2xl flex-1/10 items-center justify-center border-x-1 border-gray-400 text-2xl font-bold sm:border-x-1">
          Page Not Found!
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
