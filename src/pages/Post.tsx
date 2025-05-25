import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
import { useParams } from "react-router-dom";
const Post = () => {
  const { postId } = useParams();
  return (
    <main className="flex h-full px-30">
      <Sidebar selected={null} />
      <MainFeed />
    </main>
  );
};

export default Post;
