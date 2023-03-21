import React, { useState } from "react";
import "./App.css";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
const snarkjs = require("snarkjs");

const makeProof = async (_proofResultInput, _wasm, _zkey) => {
  try {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _proofResultInput,
      _wasm,
      _zkey
    );
    console.log("[DEBUG] proof: ", proof);
    console.log("[DEBUG] publicSignals: ", publicSignals);
    return { proof, publicSignals };
  } catch (e) {
    console.log("[ERROR] fullProve: ", e);
  }
};

const verifyProof = async (_verificationkey, signals, proof) => {
  try {
    const vkey = await fetch(_verificationkey).then(function (res) {
      return res.json();
    });
    console.log("[DEBUG] vkey: ", vkey);
    const res = await snarkjs.groth16.verify(vkey, signals, proof);
    console.log("[DEBUG] verificationResult: ", res);
    return res;
  } catch (e) {
    console.log("[ERROR] verifyProof: ", e);
  }
};

const ProofComponent = () => {
  const wasmFile = "http://localhost:8000/circuit.wasm";
  const zkeyFile = "http://localhost:8000/circuit_final.zkey";
  const verificationKey = "http://localhost:8000/verification_key.json";

  const [a, setA] = useState("3");
  const [b, setB] = useState("11");

  const [proofResult, setProofResult] = useState("");
  const [signalsResult, setSignalsResult] = useState("");
  const [isValidResult, setIsValidResult] = useState(false);

  const runProofs = () => {
    if (a.length === 0 || b.length === 0) return;
    let proofInput = { a, b };
    console.log("[DEBUG] ProofInput: ", proofInput);

    makeProof(proofInput, wasmFile, zkeyFile).then(
      ({ proof, publicSignals }) => {
        setProofResult(JSON.stringify(proof, null, 1));
        setSignalsResult(JSON.stringify(publicSignals, null, 1));
        verifyProof(verificationKey, publicSignals, proof).then((_isValid) => {
          setIsValidResult(_isValid);
        });
      }
    );
  };

  const changeA = (e) => setA(e.target.value);
  const changeB = (e) => setB(e.target.value);

  return (
    <div style={{ margin: "5% auto", height: "50vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="mr-2" style={{ width: "300px" }}>
          <Form style={{ width: "100%" }}>
            <h5 className="mb-3">Witness Inputs</h5>
            <FormGroup>
              <FormLabel>Input A</FormLabel>
              <FormControl type="number" value={a} onChange={changeA} />
            </FormGroup>
            <FormGroup>
              <FormLabel>Input B</FormLabel>
              <FormControl type="number" value={b} onChange={changeB} />
            </FormGroup>
            <Button
              className="mb-2"
              onClick={runProofs}
              style={{ width: "100%" }}
            >
              Generate Proof
            </Button>
          </Form>
        </div>

        <div
          className="p-2"
          style={{
            width: "500px",
            backgroundColor: "#e1f5f4",
            borderRadius: "2%",
            whiteSpace: "initial",
            wordBreak: "break-word",
          }}
        >
          {!proofResult & !signalsResult ? (
            <span>Generate the proof to see the results.</span>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                <span> Result: </span>
                <span
                  style={{
                    color: isValidResult ? "green" : "red",
                    width: "500px",
                  }}
                >
                  {proofResult.length > 0 &&
                    (isValidResult ? "Valid proof" : "Invalid proof")}
                </span>
              </span>

              <span>
                <span style={{ fontWeight: "bold" }}> Signals: </span>
                {signalsResult}
              </span>

              <span>
                <span style={{ fontWeight: "bold" }}> Proof: </span>
                {proofResult}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Container className="p-3">
    <ProofComponent></ProofComponent>
  </Container>
);

export default App;
