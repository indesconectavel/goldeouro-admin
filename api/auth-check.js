// Vercel Function para verificar autenticação
export default function handler(req, res) {
  // Verificar se há token de autenticação
  const token = req.cookies['admin-token'];
  
  if (!token) {
    // Redirecionar para login se não autenticado
    return res.redirect(302, '/login');
  }
  
  // Se autenticado, permitir acesso
  return res.status(200).json({ authenticated: true });
}
