import { authRole } from "@lib/constants/AppConst";

export const getUserFromAuth0 = (user: any) => {
    if (user) {
        return {
            id: 1,
            uid: user.sub,
            displayName: user.name,
            email: user.email,
            photoURL: user.picture,
            role: authRole.User,
        };
    }
    return user;
};

export const getUserFromFirebase = (user: any) => {
    if (user) {
        return {
            id: 1,
            uid: user.uid,
            displayName: user.displayName ? user.displayName : "Crema User",
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : "/assets/images/avatar/A11.jpg",
            role: authRole.User,
        };
    }
    return user;
};
export const getUserFromAWS = (user: any) => {
    if (user) {
        return {
            id: 1,
            uid: user.username,
            displayName: user.attributes.name ? user.attributes.name : "Crema User",
            email: user.attributes.email,
            photoURL: user.photoURL,
            role: authRole.User,
        };
    }
    return user;
};

export const getUserFromJwtAuth = (user: any) => {
    if (user) {
        return {
            id: 1,
            uid: user._id,
            displayName: user.name,
            email: user.email,
            photoURL: user.avatar,
            role: authRole.User,
        };
    }
    return user;
};
