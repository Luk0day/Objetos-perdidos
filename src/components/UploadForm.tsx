'use client';

import { useState, useTransition } from 'react';
import { criarObjeto } from '@/app/admin/actions';

async function reduzir(file: File, max = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const escala = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * escala);
  canvas.height = Math.round(bmp.height * escala);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error('Falha ao ler a imagem'))), 'image/jpeg', 0.85));
}

export function UploadForm() {
  const [msg, setMsg] = useState<{ texto: string; erro?: boolean }>();
  const [enviando, iniciar] = useTransition();

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const foto = fd.get('foto');
    if (!(foto instanceof File) || !foto.size) return setMsg({ texto: 'Escolha ou tire uma foto.', erro: true });
    fd.set('foto', await reduzir(foto), 'foto.jpg');
    setMsg({ texto: 'Analisando a foto com a IA…' });
    iniciar(async () => {
      const r = await criarObjeto(fd);
      setMsg(r.ok ? { texto: 'Foto analisada. Revise o anúncio abaixo e publique.' } : { texto: r.erro ?? 'Erro ao enviar.', erro: true });
      if (r.ok) form.reset();
    });
  }

  return (
    <form onSubmit={enviar} className="caixa">
      <label>
        Foto do objeto
        <input type="file" name="foto" accept="image/*" required />
      </label>
      <label>
        Onde foi encontrado (opcional)
        <input type="text" name="local" maxLength={120} />
      </label>
      <button className="btn" disabled={enviando}>Enviar e analisar com IA</button>
      {msg && <p role="status" className={msg.erro ? 'erro' : 'certo'}>{msg.texto}</p>}
    </form>
  );
}
