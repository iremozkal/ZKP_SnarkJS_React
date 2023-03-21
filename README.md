## React + snarkjs

This is a minimal project to get react (javascript) and snarkjs up and running.  
The circuit is the example from the readme of `https://github.com/iden3/snarkjs`  
To install the necessary packages etc, run `yarn  install`. 

The circuit-specific files are provided to the react frontend through express.  
Start the express server in `file-server` and the react application:

```bash
# Run fileserver:
cd src/file-server
node index.js

# Start react
yarn start
```

The circuit and related files are located in the folder `src/file-server/zkproof`
- circuit.wasm  
- circuit_final.zkey  
- verification_key.json  

## File Structure

```
├── public
│   └── index.html
├── src
│   ├── file-server
│   │   ├── zkproof
│   │   |   ├── circuit_final.zkey  
│   │   |   ├── circuit.wasm  
│   │   |   └── verification_key.json  
│   │   └── index.js
│   ├── App.css
│   ├── App.js
│   └── index.js
├── .gitattributes
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── yarn.lock
```