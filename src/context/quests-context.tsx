import React, { useEffect, useState } from "react";

import { Quest } from "../types";

import { collection, getDocs, addDoc, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.ts";

import { formatDate } from "../utils";

type MarkersContextTypes = {
  quests: Quest[];
  addQuest: (marker: { location: { lat: number; long: number; } }) => void;
  updateQuest: (documentId: string, location: { lat: number; long: number; }) => void;
  deleteQuest: (documentId: string) => void;
};

export const QuestsContext = React.createContext({} as MarkersContextTypes);

export const QuestsContextProvider = ({ children } : { children: React.ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>([]);

  const fetchQuests = async () => {
    try {
      await getDocs(collection(db, "quests"))
        .then((querySnapshot)=>{
          const data = querySnapshot.docs
            .map((doc) => (
              {
                location: {
                  lat: doc.data().location.lat,
                  long: doc.data().location.long,
                },
                timestamp: doc.data().timestamp.seconds,
                documentId: doc.id,
              }
            ));

          const sortedQuests = data.sort((a, b) => {
            return a.timestamp - b.timestamp;
          });

          sortedQuests.map(quest => quest.timestamp = formatDate(quest.timestamp));

          setQuests(sortedQuests);
        });
    } catch (error) {
      console.error("Error fetching quests:", error);
    }
  };

  const addQuest = async (marker: { location: { lat: number; long: number; } }) => {
    try {
      await addDoc(collection(db, "quests"), {
        location: marker.location,
        timestamp: new Date(),
      });

      await fetchQuests();
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuest = async (documentId: string, location: { lat: number; long: number; }) => {
    try {
      await setDoc(doc(db, "quests", documentId), {
        location: location,
        timestamp: new Date(),
      });

      // setQuests(prevQuests => {
      //   return prevQuests.map(quest => {
      //     if (quest.documentId === documentId) {
      //       return { ...quest, location: location };
      //     } else {
      //       return quest;
      //     }
      //   })
      // });
      await fetchQuests();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuest = async (documentId: string) => {
    try {
      await deleteDoc(doc(db, "quests", documentId));

      setQuests(quests.filter(q => q.documentId !== documentId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return (
    <QuestsContext.Provider
      value={{
        quests,
        addQuest,
        updateQuest,
        deleteQuest,
      }}
    >
      {children}
    </QuestsContext.Provider>
  );
};