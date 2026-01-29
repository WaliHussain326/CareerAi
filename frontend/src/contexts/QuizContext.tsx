import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type QuizStatus = "not-started" | "in-progress" | "completed";

interface QuizContextType {
  quizStatus: QuizStatus;
  updateQuizStatus: (status: QuizStatus) => void;
  profileCompleteness: number;
  calculateProfileCompleteness: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("not-started");
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  useEffect(() => {
    // Load quiz state from localStorage
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setQuizStatus(state.status || "not-started");
    }

    calculateProfileCompleteness();
  }, []);

  const updateQuizStatus = (status: QuizStatus) => {
    setQuizStatus(status);
    localStorage.setItem("quizState", JSON.stringify({ status }));
  };

  const calculateProfileCompleteness = () => {
    let completeness = 0;

    // Check onboarding data
    const onboardingData = localStorage.getItem("onboardingData");
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      if (data.educationLevel) completeness += 15;
      if (data.fieldOfStudy) completeness += 15;
      if (data.institution) completeness += 10;
      if (data.currentStatus) completeness += 10;
      if (data.interests && data.interests.length > 0) completeness += 15;
      if (data.workStyle) completeness += 10;
      if (data.country) completeness += 5;
    }

    // Check quiz completion
    const quizState = localStorage.getItem("quizState");
    if (quizState) {
      const state = JSON.parse(quizState);
      if (state.status === "completed") {
        completeness += 20;
      } else if (state.status === "in-progress") {
        completeness += 10;
      }
    }

    setProfileCompleteness(Math.min(completeness, 100));
  };

  return (
    <QuizContext.Provider
      value={{
        quizStatus,
        updateQuizStatus,
        profileCompleteness,
        calculateProfileCompleteness,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
