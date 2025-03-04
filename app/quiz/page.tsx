"use client";

import Image from "next/image";
import { useEffect, useReducer } from "react";

type questions = {
  question: string;
  answers: string[];
  correct: string;
  points: number;
};

const initialState: {
  questions: questions[];
  id: number;
  score: number;
  status: string;
  answer: null | string;
} = {
  questions: [],
  id: 1,
  score: 0,
  // "ready", "playing", "error"
  status: "ready",
  answer: null,
};

type Action =
  | { type: "initial"; payload: questions[] }
  | { type: "error"; payload: string }
  | { type: "next" }
  | { type: "start" }
  | { type: "back" }
  | { type: "newAnswer"; payload: string }
  | { type: "playAgain" };

function reducer(
  state: typeof initialState,
  action: Action
): typeof initialState {
  switch (action.type) {
    case "initial":
      return { ...state, questions: action.payload, status: "ready" };
    case "error":
      return { ...state, questions: [], status: "error" };
    case "next":
      return { ...state, id: state.id + 1, answer: null };
    case "start":
      return { ...state, status: "playing" };
    case "back":
      return { ...state, status: "ready" };
    case "newAnswer":
      const question = state.questions[state.id - 1];
      return {
        ...state,
        answer: action.payload,
        score:
          action.payload === question.correct ? state.score + 1 : state.score,
        status: state.id === state.questions.length ? "finished" : state.status,
      };
    case "playAgain":
      return { ...state, id: 1, score: 0, status: "ready", answer: null };
    default:
      throw new Error("Action unknown");
  }
}
const Surah = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:8000/api/surahs");
        const data = await response.json();
        dispatch({ type: "initial", payload: data.surahs });
        console.log(data.surahs);
      } catch (error) {
        dispatch({ type: "error", payload: "Error" });
        console.error(error);
      }
    }
    fetchQuestions();
  }, []);

  const hasAnswered = state.answer !== null;

  console.log(state);

  return (
    <div className="bg-green-800 text-white h-screen p-8 flex flex-col">
      {/* Header */}
      <header>
        <h1 className="text-center text-4xl mb-4">Surah Quiz</h1>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-center my-10">
        {state.status === "ready" && (
          <>
            <h2 className="text-center text-xl mt-36">
              Welcome to the Surah Quiz!
            </h2>
            <div
              onClick={() => dispatch({ type: "start" })}
              className="mb-10 text-center py-2 px-6 rounded-full m-4 bg-green-600 cursor-pointer hover:bg-green-700 text-md"
            >
              Start Quiz
            </div>
          </>
        )}
        {state.status === "loading" && <div>Loading...</div>}
        {state.status === "error" && <div>Error loading questions</div>}
        {state.status === "playing" && (
          <>
            {/* <progress max={state.questions.length} value={state.id - 1} /> */}
            {/* Main's Header */}
            <div className="flex w-full justify-between mb-8 font-bold">
              <Image
                src={"/left-arrow.svg"}
                alt="Left Arrow"
                width={15}
                height={15}
                onClick={() => dispatch({ type: "back" })}
                className="hover:cursor-pointer"
              />
              <p>score: {state.score}</p>
              <p>
                {state.id}/{state.questions.length}
              </p>
            </div>

            {/* Quran Image */}
            <div className="mb-8">
              <Image src="/quran.svg" alt="Quran" width={100} height={100} />
            </div>

            {/* Question */}
            <div className="flex space-x-2 mb-3 font-bold">
              <p className="bg-white text-green-800 px-2 rounded-full font-extrabold">
                ?
              </p>
              <h2>{state.questions[state.id - 1]?.question}</h2>
            </div>

            {/* Answer Options */}
            <ol className="space-y-2.5 w-full">
              {state.questions[state.id - 1]?.answers.map((answer) => (
                <li key={answer}>
                  <button
                    className={`bg-green-600 hover:bg-green-500 hover:cursor-pointer w-full text-center py-1.5 rounded-xl ${
                      state.answer === answer
                        ? "bg-red-400 hover:bg-red-400 text-gray-800 text-bold"
                        : ""
                    } ${
                      hasAnswered &&
                      answer === state.questions[state.id - 1].correct
                        ? "bg-yellow-300 hover:bg-yellow-300 text-gray-800 text-bold"
                        : ""
                    }`}
                    onClick={() =>
                      dispatch({ type: "newAnswer", payload: answer })
                    }
                    disabled={hasAnswered}
                  >
                    {answer}
                  </button>
                </li>
              ))}
            </ol>

            {/* Next Button */}
            {state.answer !== null && (
              <button
                className="w-full bg-gray-300 text-gray-800 py-1.5 rounded-xl mt-3 hover:cursor-pointer"
                onClick={() => dispatch({ type: "next" })}
              >
                Next
              </button>
            )}
          </>
        )}
        {state.status === "finished" && (
          <div className="flex flex-col justify-center items-center bg-white w-72 h-72 rounded-full text-gray-800">
            <h2 className="text-3xl font-bold text-sky-600">Score</h2>
            <div className="flex space-x-6 justify-between items-center my-2">
              <p className="bg-green-600 h-12 w-12 rounded-full text-3xl font-bold flex justify-center items-center">
                {state.score}
              </p>
              <p className="font-semibold">out of</p>
              <p className="bg-yellow-400 h-12 w-12 rounded-full text-3xl font-bold flex justify-center items-center">
                {state.questions.length}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: "playAgain" })}
              className="w-40 font-semibold bg-gray-300 text-gray-800 py-1.5 rounded-xl mt-3 hover:cursor-pointer shadow-gray-700 shadow-sm"
            >
              Play Again
            </button>
            <button
              onClick={() => dispatch({ type: "playAgain" })}
              className="w-40 bg-gray-300 text-gray-800 py-1.5 rounded-xl mt-3 hover:cursor-pointer font-semibold shadow-gray-700 shadow-sm"
            >
              Stop
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Surah;
