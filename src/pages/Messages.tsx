import Sidebar from "../components/Sidebar";
const Messages = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="messages" />
      <section className="flex w-xl items-center justify-center border-x-1 border-gray-400">
        This page is under construction!
      </section>
    </main>
  );
};

export default Messages;
