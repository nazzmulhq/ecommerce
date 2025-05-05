export const authRole = {
    Admin: ["admin"],
    User: ["user", "admin"],
};

export const defaultUser: any = {
    uid: "john-alex",
    displayName: "John Alex",
    email: "demo@example.com",
    token: "access-token",
    role: "user",
    photoURL: "/assets/images/avatar/A11.jpg",
};
export const allowMultiLanguage = process.env.NEXT_PUBLIC_MULTILINGUAL === "true";
export const fileStackKey = process.env.NEXT_PUBLIC_FILESTACK_KEY as string;
export const initialUrl = process.env.NEXT_PUBLIC_INITIAL_URL as string; // this url will open after login
