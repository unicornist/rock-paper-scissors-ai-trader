import { useState } from 'react'

const patternLength = 10

const randomChoice = () => Math.floor(Math.random() * 3) + 1

const choiceLabel = (value) => {
  switch (value) {
    case 1:
      return 'Rock'
    case 2:
      return 'Paper'
    case 3:
      return 'Scissors'
    default:
      return ''
  }
}

const decideWinner = (human, ai) => {
  if (human === ai) {
    return 'draw'
  }

  if (
    (human === 1 && ai === 3) ||
    (human === 3 && ai === 2) ||
    (human === 2 && ai === 1)
  ) {
    return 'human'
  }

  return 'ai'
}

const trainAndPredict = (pattern) => {
  const net = new window.brain.recurrent.LSTMTimeStep()
  net.train([pattern], { iterations: 100, log: true })
  const prediction = net.run(pattern)
  const roundedPrediction = Math.round(prediction)

  if (roundedPrediction >= 1 && roundedPrediction <= 3) {
    return (roundedPrediction % 3) + 1
  }

  return 1
}

const buildPattern = (pattern) => {
  if (pattern.length > 0) {
    return [...pattern]
  }

  return Array.from({ length: patternLength }, () => randomChoice())
}

export default function App() {
  const [pattern, setPattern] = useState([])
  const [scoreHuman, setScoreHuman] = useState(0)
  const [scoreAI, setScoreAI] = useState(0)
  const [chosenByHuman, setChosenByHuman] = useState(0)
  const [chosenByAI, setChosenByAI] = useState(0)
  const [winner, setWinner] = useState('')
  const [gameCount, setGameCount] = useState(0)

  const playRound = (choice) => {
    const nextGameCount = gameCount + 1
    const workingPattern = buildPattern(pattern)
    const aiChoice = trainAndPredict(workingPattern)

    if (nextGameCount !== 0) {
      workingPattern.shift()
      workingPattern.push(choice)
    }

    const roundWinner = decideWinner(choice, aiChoice)

    setChosenByHuman(choice)
    setChosenByAI(aiChoice)
    setWinner(roundWinner)
    setGameCount(nextGameCount)
    setPattern(workingPattern)

    if (roundWinner === 'human') {
      setScoreHuman((prev) => prev + 1)
    } else if (roundWinner === 'ai') {
      setScoreAI((prev) => prev + 1)
    }
  }

  const resetScore = () => {
    setPattern([])
    setScoreHuman(0)
    setScoreAI(0)
    setChosenByHuman(0)
    setChosenByAI(0)
    setWinner('')
    setGameCount(0)
  }

  return (
    <div className="max-w-5xl mx-auto lg:flex lg:justify-evenly lg:items-start">
      <div className="flex flex-col items-center justify-center text-center lg:mt-10">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-indigo-500">
            Rock Paper Scissors with AI
          </h1>
          <h2 className="text-base text-indigo-500">
            Learn your patterns and fight back
          </h2>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-indigo-500">Score</h2>
          <div className="flex items-center mt-4 items-row justify-evenly">
            <div className="w-1/2 border-r border-indigo-500">
              <p className="text-3xl text-indigo-500">{scoreHuman}</p>
              <p className="mt-4 text-xl">Human</p>
              <p className="mt-4">{choiceLabel(chosenByHuman)}</p>
            </div>
            <div className="w-1/2">
              <p className="text-3xl text-indigo-500">{scoreAI}</p>
              <p className="mt-4 text-xl">AI</p>
              <p className="mt-4">{choiceLabel(chosenByAI)}</p>
            </div>
          </div>
          <div className="my-6 text-2xl font-bold">
            {winner === 'human' && (
              <p className="text-indigo-500">You win!</p>
            )}
            {winner === 'ai' && <p className="text-red-500">You lose!</p>}
            {winner === 'draw' && <p className="text-blue-500">Draw!</p>}
            {!winner && <p className="text-gray-700">Start the game.</p>}
          </div>
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center">
              <button
                onClick={() => playRound(1)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Rock
              </button>
              <button
                onClick={() => playRound(2)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Paper
              </button>
              <button
                onClick={() => playRound(3)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Scissors
              </button>
            </div>
            <div>
              <button
                onClick={resetScore}
                className="px-4 py-2 m-2 text-indigo-500 border rounded"
              >
                Reset
              </button>
            </div>
            <div className="mt-8">
              <p>Game count: {gameCount}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:ml-16">
        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>What is this?</h2>
          <div>
            <p>
              This is a paper scissors rock game created using artificial
              intelligence.
            </p>
            <p>
              The game reads your patterns to determine the steps the AI will
              take in order to win.
            </p>
            <p>Built with React, Vite, and Tailwind CSS.</p>
          </div>
        </div>

        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>How to play</h2>
          <div>
            <ol>
              <li>Select rock, scissors, or paper.</li>
              <li>Choose continuously until you create a pattern.</li>
              <li>
                Examples of patterns:
                <ul>
                  <li>Rock, rock, rock, rock, etc.</li>
                  <li>Rock, scissors, rock, scissors, etc.</li>
                  <li>Rock, scissors, paper, rock, scissors, paper, etc.</li>
                  <li>Paper, paper, paper, paper, etc.</li>
                </ul>
              </li>
              <li>See that you will lose.</li>
            </ol>
          </div>
        </div>

        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>Source</h2>
          <div>
            <p>
              Brain JS:{' '}
              <a href="https://github.com/BrainJS/brain.js">Brain JS</a>
            </p>
            <p>
              Github:{' '}
              <a href="https://github.com/arifikhsan/batu-gunting-kertas-nuxt">
                Github
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
