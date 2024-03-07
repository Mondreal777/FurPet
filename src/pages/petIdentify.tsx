import React, { useState, useRef, useReducer } from "react";
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./petIdentify.css";

interface Result {
  className: string;
  probability: number;
}

interface Machine {
  initial: string;
  states: {
    [key: string]: {
      on?: { [key: string]: string };
      showImage?: boolean;
      showResults?: boolean;
    };
  };
}

const machine: Machine = {
  initial: "initial",
  states: {
    initial: { on: { next: "loadingModel" } },
    loadingModel: { on: { next: "modelReady" } },
    modelReady: { on: { next: "imageReady" } },
    imageReady: { on: { next: "identifying" }, showImage: true },
    identifying: { on: { next: "complete" } },
    complete: { on: { next: "modelReady" }, showImage: true, showResults: true }
  }
};

const PetIdentifier: React.FC = () => {
  tf.setBackend("cpu");
  const [results, setResults] = useState<Result[]>([]);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [model, setModel] = useState<any | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reducer = (state: string, event: string) =>
    machine.states[state]?.on?.[event] || machine.initial;

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");

  const loadModel = async () => {
    next();
    const model = await mobilenet.load();
    setModel(model);
    next();
  };

  const identify = async () => {
    next();
    if (imageRef.current) {
      const results = await model.classify(imageRef.current);
      setResults(results);
    }
    next();
  };

  const reset = async () => {
    setResults([]);
    next();
  };

  const upload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
      next();
    }
  };

  interface ActionButton {
    [key: string]: {
      action?: () => void | Promise<void>;
      text: string;
    };
  }
  
  const actionButton: ActionButton = {
    initial: { action: loadModel, text: "Load Model" },
    loadingModel: { text: "Loading Model..." },
    modelReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Identify Breed" },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" }
  };
  

  const { showImage, showResults } = machine.states[appState];

  return (
    <div>
      {showImage && <img src={imageURL || ''} alt="upload-preview" ref={imageRef} />}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        ref={inputRef}
      />

      {showResults && (
        <ul>
          {results.map(({ className, probability }) => (
            <li key={className}>{`${className}: %${(probability * 100).toFixed(
              2
            )}`}</li>
          ))}
        </ul>
      )}
      <button onClick={actionButton[appState].action || (() => { })}>
        {actionButton[appState].text}
      </button>
    </div>
  );
}

export default PetIdentifier;
