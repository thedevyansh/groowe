import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likes: 0,
  dislikes: 0,
  saves: 0,
  clientVote: null, // 'like' or 'dislike'
  clientSaved: false,
};

// This is for storing voting data for the current song
export const voteSlice = createSlice({
  name: 'vote',
  initialState: initialState,
  reducers: {
    populate: (state, { payload }) => {
      // votes is a map of usernames to their votes
      const { votes, clientUsername } = payload;
      if (votes) {
        if (clientUsername) {
          state.clientVote = votes?.[clientUsername] ?? null;
        }
        let likes = 0;
        let dislikes = 0;

        Object.keys(votes).forEach(username => {
          if (votes[username] === 'like') {
            likes = likes + 1;
          } else if (votes[username] === 'dislike') {
            dislikes = dislikes + 1;
          }
        });

        state.likes = likes;
        state.dislikes = dislikes;
      }
    },
    clientLike: state => {
      switch (state.clientVote) {
        case null:
          state.likes++;
          state.clientVote = 'like';
          break;
        case 'like':
          state.likes--;
          state.clientVote = null;
          break;
        case 'dislike':
          state.dislikes--;
          state.likes++;
          state.clientVote = 'like';
          break;
        default:
          break;
      }
    },
    clientDislike: state => {
      switch (state.clientVote) {
        case null:
          state.dislikes++;
          state.clientVote = 'dislike';
          break;
        case 'like':
          state.likes--;
          state.dislikes++;
          state.clientVote = 'dislike';
          break;
        case 'dislike':
          state.dislikes--;
          state.clientVote = null;
          break;
        default:
          break;
      }
    },
    clientSave: state => {
      if (state.clientSaved) {
        state.saves--;
        state.clientSaved = false;
      } else {
        state.saves++;
        state.clientSaved = true;
      }
    },
    reset: state => {
      state = Object.assign(state, initialState);
    },
  },
});

export const { populate, clientLike, clientDislike, clientSave, reset } =
  voteSlice.actions;

export default voteSlice.reducer;
