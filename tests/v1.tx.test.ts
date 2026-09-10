import { expect } from "chai";
import { SolanaParser } from "../src/index";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const txId = "5ayXvYyzfEwaXGGy5jYzDGcynPDSeQSieKvGR3XPX4RF1RaBxaHWB1bMxUHioTwmM8UEVMfHqvNXFfDZw2ZxHTUM";

const parser = new SolanaParser([]);

describe("SolanaParser", () => {
  const expectedInstructions = [
        { 
            name: "transfer",
            programId: "11111111111111111111111111111111",
        },
        {
            name: "createAssociatedTokenAccount",
            programId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
            name: "transfer",
            programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        }
    ];
  
    it("should parse a transaction via internal method", async () => {
    const conn = new Connection(clusterApiUrl("devnet"));
    const parsedInstructions = await parser.parseTransactionByHash(conn, txId, false, "confirmed");
    expect(parsedInstructions).to.not.be.null;
    expect(parsedInstructions?.length).to.be.greaterThan(0);
    
    parsedInstructions?.forEach((parsedInstruction, index) => {
        expect(parsedInstruction.name).to.equal(expectedInstructions[index].name);
        expect(parsedInstruction.programId.toString()).to.equal(expectedInstructions[index].programId);
    });
  });

  it("should parse a transaction via public method", async () => {
    const conn = new Connection(clusterApiUrl("devnet"));
    const tx = await conn.getTransaction(txId, { commitment: "confirmed", maxSupportedTransactionVersion: 1 });
    const parsedInstructions = parser.parseTransactionData(tx?.transaction.message!, tx?.meta?.loadedAddresses);
    expect(parsedInstructions).to.not.be.null;
    expect(parsedInstructions?.length).to.be.greaterThan(0);
    parsedInstructions?.forEach((parsedInstruction, index) => {
        expect(parsedInstruction.name).to.equal(expectedInstructions[index].name);
        expect(parsedInstruction.programId.toString()).to.equal(expectedInstructions[index].programId);
    });
    })
});