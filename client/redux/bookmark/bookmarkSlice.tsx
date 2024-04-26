import { BookmarkItem, StateSliceProp } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialState: StateSliceProp = {
  BookmarkList: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    addBookmark(state, action: PayloadAction<BookmarkItem>) {
      // set the state
      const newBookmark = action.payload;
      //   check if it is exist
      //   make the operation
      if (!state.BookmarkList?.some((item) => item._id === newBookmark._id)) {
        state.BookmarkList?.unshift(newBookmark);
      }
      console.log(`Here is the Bookmarked Stuff`,state.BookmarkList); 
      
      AsyncStorage.setItem("BookmarkItem", JSON.stringify(state.BookmarkList));
    },
    removeBookmark(state, action: PayloadAction<number>) {
      // set the removeBookmark
      const bookmarkId = action.payload;
      // check with filter
      // Remove the bookmark from the list
      state.BookmarkList = state.BookmarkList.filter(
        (item) => item._id !== bookmarkId
      );
      AsyncStorage.setItem("BookmarkItem", JSON.stringify(state.BookmarkList));
    },
  },
});

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
