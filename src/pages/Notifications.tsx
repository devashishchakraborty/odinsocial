import Sidebar from "../components/Sidebar";
const Notifications = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="notifications" />
      <section className="w-xl border-x-1 border-gray-400 flex items-center justify-center">
        This page is under construction!
      </section>
    </main>
  );
};

export default Notifications;
