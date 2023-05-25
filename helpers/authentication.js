// authentication.js
import { auth } from '../firebaseConfig';

export const signOutUser = async () => {
    await auth.signOut();
};

export const deleteUser = async () => {
    if (auth.currentUser) {
        await auth.currentUser.delete();
    }
};
