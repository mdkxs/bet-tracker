"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [bets, setBets] = useState([]);
  const [form, setForm] = useState({
    sport: "",
    event: "",
    odd: "",
    stake: "",
    result: "pending",
    username: "jardel",
  });

  // 🔥 Buscar apostas da base de dados
  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("FETCH DATA:", data);
  console.log("FETCH ERROR:", error);

  if (error) {
    alert("Erro ao buscar apostas. Vê a consola.");
    return;
  }

  setBets(data);
};

  // 🔥 Adicionar aposta à base de dados
  const addBet = async () => {
    if (!form.sport || !form.event || !form.odd || !form.stake) return;

    const { error } = await supabase.from("bets").insert([
  {
    username: "jardel", // muda para o teu nome
    sport: form.sport,
    event: form.event,
    odd: parseFloat(form.odd),
    stake: parseFloat(form.stake),
    result: form.result,
  },
]);

    if (error) {
      console.error(error);
      return;
    }

    setForm({
      sport: "",
      event: "",
      odd: "",
      stake: "",
      result: "pending",
    });

    fetchBets();
  };

  // 📊 Estatísticas
  const totalBets = bets.length;
  const wins = bets.filter((b) => b.result === "win").length;
  const losses = bets.filter((b) => b.result === "loss").length;

  const totalStaked = bets.reduce((acc, b) => acc + Number(b.stake), 0);
  const totalReturned = bets.reduce((acc, b) => {
    if (b.result === "win") return acc + b.stake * b.odd;
    return acc;
  }, 0);

  const profit = totalReturned - totalStaked;

  const winRate =
    wins + losses > 0
      ? ((wins / (wins + losses)) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-500 mb-8">
        Bet Tracker 🚀
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Total" value={totalBets} />
        <StatCard title="Ganhas" value={wins} />
        <StatCard title="Perdidas" value={losses} />
        <StatCard title="Win Rate" value={`${winRate}%`} />
        <StatCard title="Total Apostado" value={`${totalStaked.toFixed(2)}€`} />
        <StatCard title="Retorno" value={`${totalReturned.toFixed(2)}€`} />
        <StatCard
          title="Profit"
          value={`${profit.toFixed(2)}€`}
          highlight={profit >= 0}
        />
      </div>

      {/* FORM */}
      <div className="bg-gray-900 p-6 rounded-xl mb-10">
        <h2 className="text-xl mb-4">Adicionar Aposta</h2>

        <div className="grid md:grid-cols-5 gap-4">
          <input
            placeholder="Desporto"
            className="p-2 bg-gray-800 rounded"
            value={form.sport}
            onChange={(e) =>
              setForm({ ...form, sport: e.target.value })
            }
          />
          <input
            placeholder="Evento"
            className="p-2 bg-gray-800 rounded"
            value={form.event}
            onChange={(e) =>
              setForm({ ...form, event: e.target.value })
            }
          />
          <input
            placeholder="Odd"
            type="number"
            className="p-2 bg-gray-800 rounded"
            value={form.odd}
            onChange={(e) =>
              setForm({ ...form, odd: e.target.value })
            }
          />
          <input
            placeholder="Stake €"
            type="number"
            className="p-2 bg-gray-800 rounded"
            value={form.stake}
            onChange={(e) =>
              setForm({ ...form, stake: e.target.value })
            }
          />
          <select
            className="p-2 bg-gray-800 rounded"
            value={form.result}
            onChange={(e) =>
              setForm({ ...form, result: e.target.value })
            }
          >
            <option value="pending">Pendente</option>
            <option value="win">Ganha</option>
            <option value="loss">Perdida</option>
          </select>
        </div>

        <button
          onClick={addBet}
          className="mt-4 bg-green-600 px-6 py-2 rounded hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div>
        <h2 className="text-xl mb-4">Apostas</h2>
        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gray-900 p-4 rounded flex justify-between"
            >
              <div>
                <p className="font-bold">{bet.event}</p>
                <p className="text-sm text-gray-400">
                  {bet.sport} • Odd {bet.odd} • {bet.stake}€
                </p>
              </div>
              <span
                className={`font-bold ${
                  bet.result === "win"
                    ? "text-green-500"
                    : bet.result === "loss"
                    ? "text-red-500"
                    : "text-yellow-400"
                }`}
              >
                {bet.result.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <p
        className={`text-2xl font-bold ${
          highlight === undefined
            ? "text-white"
            : highlight
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {value}
      </p>
    </div>
  );
  
}
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Profile({ params }) {
  const { username } = params;

  const { data: bets } = await supabase
    .from("bets")
    .select("*")
    .eq("username", username);

  const totalBets = bets.length;
  const wins = bets.filter((b) => b.result === "win").length;
  const losses = bets.filter((b) => b.result === "loss").length;

  const totalStaked = bets.reduce((acc, b) => acc + Number(b.stake), 0);
  const totalReturned = bets.reduce((acc, b) =>
    b.result === "win" ? acc + b.stake * b.odd : acc
  , 0);

  const profit = totalReturned - totalStaked;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-500 mb-6">
        Perfil de {username}
      </h1>

      <p>Total Apostas: {totalBets}</p>
      <p>Ganhas: {wins}</p>
      <p>Perdidas: {losses}</p>
      <p>Profit: {profit.toFixed(2)}€</p>
    </div>
  );
}