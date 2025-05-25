import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
import { useParams } from "react-router-dom";
const Post = () => {
  const { postId } = useParams();
  return (
    <main className="flex h-full px-30">
      <Sidebar selected={null} />
      <PostFeed />
    </main>
  );
};

export default Post;
