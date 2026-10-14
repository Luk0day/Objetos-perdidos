import { login } from '../actions';

export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="wrap estreito">
      <h1>Painel · Achados e Perdidos</h1>
      <form action={login} className="caixa">
        <label>Senha<input type="password" name="senha" required autoFocus /></label>
        <button className="btn">Entrar</button>
        {erro && <p role="alert" className="erro">Senha incorreta.</p>}
      </form>
    </main>
  );
}
