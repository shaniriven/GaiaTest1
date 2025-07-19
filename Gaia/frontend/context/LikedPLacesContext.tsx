import React, { createContext, useContext, useState, ReactNode } from "react";
import { Activity } from "@/types/type";

type LikedPlacesContextType = {
  likedPlaces: Activity[];
  toggleLike: (activity: Activity) => void;
};

const LikedPlacesContext = createContext<LikedPlacesContextType | undefined>(undefined);

export const LikedPlacesProvider = ({ children }: { children: ReactNode }) => {
  const [likedPlaces, setLikedPlaces] = useState<Activity[]>([]);

  const toggleLike = (activity: Activity) => {
    setLikedPlaces((prev) => {
      const exists = prev.find((a) => a.title === activity.title);
      return exists
        ? prev.filter((a) => a.title !== activity.title)
        : [...prev, activity];
    });
  };

  return (
    <LikedPlacesContext.Provider value={{ likedPlaces, toggleLike }}>
      {children}
    </LikedPlacesContext.Provider>
  );
};

export const useLikedPlaces = () => {
  const context = useContext(LikedPlacesContext);
  if (!context) {
    throw new Error("useLikedPlaces must be used within LikedPlacesProvider");
  }
  return context;
};
