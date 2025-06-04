import Sidebar from "../components/Sidebar";
const NotFound = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <section className="w-2xl border-x-1 font-bold text-2xl border-gray-400 flex items-center justify-center">
        Page Not Found!
      </section>
    </main>
  );
};

export default NotFound;
