const iconPacks: Record<string, () => Promise<any>> = {
    Io: () => import("react-icons/io5"),
    Md: () => import("react-icons/md"),
    Fa: () => import("react-icons/fa"),
    Tb: () => import("react-icons/tb"),
    // Add more packs as needed
};

export default iconPacks;
