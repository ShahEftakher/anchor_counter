import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import idl from '../public/idl.json';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const anchorWallet = useAnchorWallet();
  const network = 'http://localhost:8899';
  const connection = new Connection(network, 'processed');
  const stringIDL = JSON.stringify(idl);
  const IDL = JSON.parse(stringIDL);
  const dataAccount = web3.Keypair.generate();
  const [counter, setCounter] = useState(0);

  const initCounter = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found!!!');
    }
    console.log(dataAccount.publicKey.toString());
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });
    const program = new Program(IDL, IDL.metadata.address, provider);
    console.log(program);
    const accounts = await connection.getProgramAccounts(
      new PublicKey(IDL.metadata.address)
    );
    console.log(accounts);
    console.log(anchorWallet.publicKey.toString());
    console.log(program.programId.toString());

    try {
      const tx = await program.methods
        .initializeCounter(new BN(0))
        .accounts({
          dataAccount: dataAccount.publicKey,
          user: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([dataAccount])
        .rpc();
      console.log(tx);

      const counter = await program.account.CounterAccount.fetch(
        dataAccount.publicKey
      );
      console.log(counter);
    } catch (err) {
      console.log(err);
    }
  };

  const increment = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found!!!');
    }
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });
    const program = new Program(IDL, IDL.metadata.address, provider);
    const accounts = await connection.getProgramAccounts(
      new PublicKey(IDL.metadata.address)
    );
    const tx = await program.methods
      .increment()
      .accounts({
        dataAccount: accounts[0].pubkey,
      })
      .signers([])
      .rpc();

    console.log(tx);
    fetchCounter();
  };

  const fetchCounter = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found!!!');
    }
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });
    const program = new Program(IDL, IDL.metadata.address, provider);
    const accounts = await connection.getProgramAccounts(
      new PublicKey(IDL.metadata.address)
    );
    console.log(accounts);
    const counter = await program.account.counterAccount.fetch(
      accounts[0].pubkey
    );
    setCounter(Number(counter.counter));

    console.log(counter.counter.toString());
  };

  const decrement = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found!!!');
    }
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });
    const program = new Program(IDL, IDL.metadata.address, provider);
    const accounts = await connection.getProgramAccounts(
      new PublicKey(IDL.metadata.address)
    );
    const tx = await program.methods
      .decrement()
      .accounts({
        dataAccount: accounts[0].pubkey,
      })
      .signers([])
      .rpc();

    console.log(tx);
    fetchCounter();
  };

  useEffect(() => {
    if (anchorWallet) {
      fetchCounter();
    }
  }, [anchorWallet]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <text>{counter}</text>
        </div>
        <div>
          <button className="button-9" role="button" onClick={initCounter}>
            Initialize Counter
          </button>
          <button className="button-9" role="button" onClick={increment}>
            Increase Counter
          </button>
          <button className="button-9" role="button" onClick={decrement}>
            Decrease Counter
          </button>
        </div>
        <div className={styles.walletButtons}>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </main>
    </div>
  );
};

export default Home;
