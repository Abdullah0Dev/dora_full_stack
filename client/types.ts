export interface BookmarkItem {
  title: string;
  _id: string | number;
  prompt: string;
  video: string;
  thumbnail: string;
  creator: {
    name: string;
    avatar: string;
    email: string;
  };
} 
interface StateSliceProp {
  BookmarkList: BookmarkItem[];
}

interface Creator {
  avatar: string;
  name: string;
  email: string;
}
interface Post {
  _id: string;
  video: string;
  thumbnail: string;
  title: string;
  prompt: string;
  creator: Creator;
}

interface PostsState {
  posts: Post[];
}

export { PostsState, StateSliceProp, BookmarkItem, Post};
