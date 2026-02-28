"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [bets, setBets] = useState([]);

  const initialBank = 309.25; // 🔥 MUDA AQUI A TUA BANCA INICIAL

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    const { data } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBets(data);
  };

  const wins = bets.filter((b) => b.result === "win").length;
  const losses = bets.filter((b) => b.result === "loss").length;
  const pending = bets.filter((b) => b.result === "pending").length;

  const profit = bets.reduce((acc, bet) => {
    if (bet.result === "win") {
      return acc + bet.stake * (bet.odd - 1);
    }
    if (bet.result === "loss") {
      return acc - bet.stake;
    }
    return acc;
  }, 0);

  const finalBank = initialBank + profit;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Bet Tracker
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Total Apostas</p>
          <p className="text-2xl font-bold">{bets.length}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Ganhas</p>
          <p className="text-2xl font-bold text-green-500">{wins}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Perdidas</p>
          <p className="text-2xl font-bold text-red-500">{losses}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Profit</p>
          <p
            className={`text-2xl font-bold ${
              profit >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {profit.toFixed(2)}€
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Banca Inicial</p>
          <p className="text-2xl font-bold">
            {initialBank.toFixed(2)}€
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-zinc-400 text-sm">Banca Final</p>
          <p
            className={`text-2xl font-bold ${
              finalBank >= initialBank ? "text-green-500" : "text-red-500"
            }`}
          >
            {finalBank.toFixed(2)}€
          </p>
        </div>

      </div>

      {/* HISTÓRICO */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-xl mb-4">Histórico</h2>

        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="flex justify-between bg-zinc-800 p-3 rounded-lg"
            >
              <div>
                <p className="font-semibold">{bet.event}</p>
                <p className="text-sm text-zinc-400">{bet.sport}</p>
              </div>

              <div className="text-right">
                <p>Odd: {bet.odd}</p>
                <p>Stake: {bet.stake}€</p>
                <p
                  className={
                    bet.result === "win"
                      ? "text-green-500"
                      : bet.result === "loss"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {bet.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}