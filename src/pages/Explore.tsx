import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Explore = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <section className="w-2xl border-x-1 border-gray-400 flex items-center justify-center">
        This page is under construction!
      </section>
    </main>
  );
};

export default Explore;
