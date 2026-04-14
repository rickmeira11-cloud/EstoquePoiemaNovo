"use client";
import { useState } from "react";

export default function EstoqueApp() {
  const [produtos, setProdutos] = useState([
    { id: 1, descricao: "Camiseta Básica", quantidade: 10, minimo: 5 },
    { id: 2, descricao: "Calça Jeans", quantidade: 3, minimo: 5 },
  ]);

  const [novoProduto, setNovoProduto] = useState("");

  function adicionarProduto() {
    if (!novoProduto) return;

    setProdutos([
      ...produtos,
      {
        id: Date.now(),
        descricao: novoProduto,
        quantidade: 0,
        minimo: 1,
      },
    ]);

    setNovoProduto("");
  }

  function atualizarQuantidade(id: number, delta: number) {
    setProdutos(
      produtos.map((p) =>
        p.id === id
          ? { ...p, quantidade: p.quantidade + delta }
          : p
      )
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>📦 Controle de Estoque</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Nome do produto"
          value={novoProduto}
          onChange={(e) => setNovoProduto(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={adicionarProduto}>Adicionar</button>
      </div>

      {produtos.map((produto) => (
        <div
          key={produto.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <strong>{produto.descricao}</strong>
          <p>Estoque: {produto.quantidade}</p>

          {produto.quantidade <= produto.minimo && (
            <p style={{ color: "red" }}>⚠️ Estoque baixo</p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => atualizarQuantidade(produto.id, -1)}>
              -
            </button>
            <button onClick={() => atualizarQuantidade(produto.id, 1)}>
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}