import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { PostsState } from "@/types";
interface Action {
  type: string;
  payload: any; // Adjust payload type as needed
}

// Define context type
interface PostsContextType extends PostsState {
  dispatch: React.Dispatch<Action>;
}

// Create the context
const PostsContext = createContext<PostsContextType | undefined>(undefined);

const PostsReducer = (state: PostsState, action: Action): PostsState => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "ADD_POSTS":
      return {
        ...state,
        posts: [action.payload, ...(state.posts || [])],
      };
    case "DELETE_POSTS":
      return {
        ...state,
        posts: (state.posts || []).filter((p) => p._id !== action.payload._id),
      };
    case "UPDATE_POSTS":
      return {
        ...state,
        posts: (state.posts || []).map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
      };
    default:
      return state;
  }
};

// Create the context provider component
interface PostsContextProviderProps {
  children: ReactNode;
}

export const PostsContextProvider: React.FC<PostsContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(PostsReducer, {
    posts: [], // initial state
  });

  return (
    <PostsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};

// Create the usePosts hook to access the context
export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsContextProvider");
  }
  return context;
};
