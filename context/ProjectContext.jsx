import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext(undefined);

export const ProjectProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (name) => {
    if (name.trim()) {
      setUsername(name);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setUsername("");
    setIsLoggedIn(false);
  };

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [steps, setSteps] = useState([
    { id: 1, title: "Understand React Native Basics", description: "Start the Expo server and run the app.", completed: true },
    { id: 2, title: "Create Global Context Provider", description: "Create ProjectContext to manage state globally.", completed: true },
    { id: 3, title: "Consume Context in Layout", description: "Hook up components to use global context state.", completed: false },
    { id: 4, title: "Interactive State Practice", description: "Build interactive features using inputs and lists.", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    const nextPending = steps.find((s) => !s.completed);
    if (nextPending) {
      setCurrentStep(nextPending.id);
    } else {
      setCurrentStep(steps.length);
    }
  }, [steps]);

  const completeStep = (stepId) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const resetProgress = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({ ...step, completed: step.id <= 2 }))
    );
  };

  const [items, setItems] = useState([
    { id: "1", text: "Setup layout with global.css 🧪", completed: true },
    { id: "2", text: "Create ProjectContext file 📚", completed: true },
    { id: "3", text: "Bind UI input & buttons to useProject Hook 🔗", completed: false },
  ]);

  const addItem = (text) => {
    if (text.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text,
        completed: false,
      };
      setItems((prev) => [...prev, newItem]);
    }
  };

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{
        username,
        isLoggedIn,
        login,
        logout,
        theme,
        toggleTheme,
        currentStep,
        steps,
        completeStep,
        resetProgress,
        items,
        addItem,
        toggleItem,
        removeItem,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used inside a <ProjectProvider />");
  }
  return context;
};
