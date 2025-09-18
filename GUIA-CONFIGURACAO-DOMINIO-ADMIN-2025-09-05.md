# 🌐 Guia de Configuração - Domínio Personalizado Admin

## 🚨 **Problema Atual**
- **Erro**: `404: NOT_FOUND` - `DEPLOYMENT_NOT_FOUND`
- **URL**: `https://admin.goldeouro.lol/painel`
- **Causa**: Domínio personalizado não configurado no Vercel

## 🔧 **Solução Passo a Passo**

### **1. Configurar Domínio no Vercel Dashboard**

#### **Passo 1: Acessar o Projeto**
1. Vá para: https://vercel.com/goldeouro-admins-projects/goldeouro-admin
2. Clique em **"Settings"** (Configurações)
3. Clique em **"Domains"** (Domínios)

#### **Passo 2: Adicionar Domínio**
1. Clique em **"Add Domain"** (Adicionar Domínio)
2. Digite: `admin.goldeouro.lol`
3. Clique em **"Add"**

#### **Passo 3: Configurar DNS**
O Vercel mostrará as instruções de DNS. Você precisará:

```
Tipo: CNAME
Nome: admin
Valor: cname.vercel-dns.com
TTL: 300
```

### **2. Configurar DNS no Provedor de Domínio**

#### **Opção A: Via Painel do Provedor**
1. Acesse o painel do seu provedor de domínio (onde comprou goldeouro.lol)
2. Vá para **"DNS Management"** ou **"Gerenciamento de DNS"**
3. Adicione o registro CNAME:
   - **Tipo**: CNAME
   - **Nome**: admin
   - **Valor**: cname.vercel-dns.com
   - **TTL**: 300

#### **Opção B: Via Vercel CLI (Alternativo)**
```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Fazer login
vercel login

# Adicionar domínio
vercel domains add admin.goldeouro.lol
```

### **3. Verificar Configuração**

#### **Passo 1: Aguardar Propagação**
- **Tempo**: 5-30 minutos
- **Status**: Aguardar até o DNS propagar

#### **Passo 2: Testar Acesso**
1. Acesse: https://admin.goldeouro.lol
2. Deve redirecionar para: https://admin.goldeouro.lol/painel
3. Verificar se o SSL está ativo (cadeado verde)

### **4. URLs que Funcionarão Após Configuração**

#### **🌐 URLs com Domínio Personalizado**
- **Painel**: https://admin.goldeouro.lol/painel
- **Login**: https://admin.goldeouro.lol/login
- **Usuários**: https://admin.goldeouro.lol/lista-usuarios
- **Relatórios**: https://admin.goldeouro.lol/relatorio-usuarios
- **Estatísticas**: https://admin.goldeouro.lol/estatisticas
- **Sistema**: https://admin.goldeouro.lol/chutes

## 🔍 **Diagnóstico de Problemas**

### **Erro: DEPLOYMENT_NOT_FOUND**
- **Causa**: Domínio não configurado no Vercel
- **Solução**: Seguir passos 1-3 acima

### **Erro: DNS_PROBE_FINISHED_NXDOMAIN**
- **Causa**: DNS não propagou ou configurado incorretamente
- **Solução**: Verificar configuração DNS e aguardar propagação

### **Erro: SSL_CERTIFICATE_ERROR**
- **Causa**: Certificado SSL ainda não foi gerado
- **Solução**: Aguardar 5-10 minutos após configuração

## 📋 **Checklist de Configuração**

### **No Vercel:**
- [ ] Domínio `admin.goldeouro.lol` adicionado
- [ ] Status do domínio: "Valid Configuration"
- [ ] SSL ativo (cadeado verde)

### **No Provedor de Domínio:**
- [ ] Registro CNAME criado
- [ ] Nome: `admin`
- [ ] Valor: `cname.vercel-dns.com`
- [ ] TTL: 300

### **Teste Final:**
- [ ] https://admin.goldeouro.lol acessível
- [ ] Redirecionamento para /painel funcionando
- [ ] SSL ativo e válido
- [ ] Todas as páginas carregando

## 🚀 **Comandos Úteis**

### **Verificar Status do Domínio**
```bash
# Verificar DNS
nslookup admin.goldeouro.lol

# Verificar se aponta para Vercel
dig admin.goldeouro.lol CNAME
```

### **Testar Conectividade**
```bash
# Testar HTTP
curl -I https://admin.goldeouro.lol

# Testar HTTPS
curl -I https://admin.goldeouro.lol
```

## 📞 **Suporte**

### **Se Ainda Não Funcionar:**
1. **Verificar DNS**: Use ferramentas como `whatsmydns.net`
2. **Aguardar Mais Tempo**: DNS pode levar até 24h para propagar
3. **Contatar Suporte Vercel**: Via dashboard do Vercel
4. **Verificar Provedor de Domínio**: Confirmar se o domínio está ativo

## 🎯 **Resultado Esperado**

Após a configuração correta:
- ✅ **URL Limpa**: `https://admin.goldeouro.lol/painel`
- ✅ **SSL Ativo**: Cadeado verde no navegador
- ✅ **Redirecionamento**: Funcionando corretamente
- ✅ **Todas as Páginas**: Acessíveis via domínio personalizado

---

**Siga estes passos e o domínio personalizado funcionará perfeitamente!** 🎉
