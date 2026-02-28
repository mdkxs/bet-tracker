"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [bets, setBets] = useState([]);
  const [form, setForm] = useState({
    sport: "",
    event: "",
    odd: "",
    stake: "",
    result: "pending",
  });

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

  const addBet = async () => {
    if (!form.sport || !form.event || !form.odd || !form.stake) return;

    await supabase.from("bets").insert([
      {
        username: "jardel",
        sport: form.sport,
        event: form.event,
        odd: parseFloat(form.odd),
        stake: parseFloat(form.stake),
        result: form.result,
      },
    ]);

    setForm({
      sport: "",
      event: "",
      odd: "",
      stake: "",
      result: "pending",
    });

    fetchBets();
  };

  const totalStaked = bets.reduce((acc, b) => acc + Number(b.stake), 0);

  const totalReturned = bets.reduce((acc, b) => {
    if (b.result === "win") return acc + b.stake * b.odd;
    return acc;
  }, 0);

  const profit = totalReturned - totalStaked;

  const wins = bets.filter((b) => b.result === "win").length;
  const losses = bets.filter((b) => b.result === "loss").length;
  const pending = bets.filter((b) => b.result === "pending").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Bet Tracker
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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
      </div>

      {/* FORM */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-10">
        <h2 className="text-xl mb-4">Adicionar Aposta</h2>

        <div className="grid md:grid-cols-5 gap-3">
          <input
            className="bg-zinc-800 p-2 rounded"
            placeholder="Desporto"
            value={form.sport}
            onChange={(e) => setForm({ ...form, sport: e.target.value })}
          />
          <input
            className="bg-zinc-800 p-2 rounded"
            placeholder="Evento"
            value={form.event}
            onChange={(e) => setForm({ ...form, event: e.target.value })}
          />
          <input
            className="bg-zinc-800 p-2 rounded"
            placeholder="Odd"
            type="number"
            value={form.odd}
            onChange={(e) => setForm({ ...form, odd: e.target.value })}
          />
          <input
            className="bg-zinc-800 p-2 rounded"
            placeholder="Stake"
            type="number"
            value={form.stake}
            onChange={(e) => setForm({ ...form, stake: e.target.value })}
          />
          <select
            className="bg-zinc-800 p-2 rounded"
            value={form.result}
            onChange={(e) => setForm({ ...form, result: e.target.value })}
          >
            <option value="pending">Pendente</option>
            <option value="win">Ganha</option>
            <option value="loss">Perdida</option>
          </select>
        </div>

        <button
          onClick={addBet}
          className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          Adicionar
        </button>
      </div>

      {/* TABLE */}
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