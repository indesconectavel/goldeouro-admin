# 🛡️ GUIA DE BACKUP RÁPIDO - GOL DE OURO ADMIN

## ⚡ **COMANDOS ESSENCIAIS**

### **Antes de Fazer Qualquer Mudança:**
```bash
# Criar backup completo (RECOMENDADO)
npm run backup

# OU backup rápido (para mudanças pequenas)
npm run backup:quick

# OU backup imediato (um clique)
npm run backup:now
```

### **Se Algo Der Errado:**
```bash
# Restaurar último backup (RÁPIDO)
npm run restore:quick

# OU listar backups disponíveis
npm run backup:list

# OU restaurar backup específico
npm run restore
```

### **Interface Gráfica (Windows):**
```bash
# Abrir gerenciador visual
npm run backup:manager
```

## 🚀 **FLUXO RECOMENDADO**

### **1. Antes de Mudanças:**
```bash
npm run backup:now
```

### **2. Faça Suas Alterações:**
- Edite arquivos normalmente
- Teste localmente

### **3. Se Tudo OK:**
- Continue trabalhando
- Faça novo backup se necessário

### **4. Se Algo Der Errado:**
```bash
npm run restore:quick
```

## 📁 **ONDE FICAM OS BACKUPS**

- **Localização:** `goldeouro-admin/backups/`
- **Formato:** `BACKUP-2025-01-09T10-30-00`
- **Backup Rápido:** `QUICK-BACKUP-2025-01-09T10-35-00`

## ⚠️ **IMPORTANTE**

1. **SEMPRE** faça backup antes de mudanças importantes
2. **SEMPRE** execute `npm install` após restaurar
3. **SEMPRE** teste após restaurar
4. Os backups são criados localmente (não vão para o Git)

## 🆘 **EM CASO DE EMERGÊNCIA**

### **Restauração Imediata:**
```bash
npm run restore:quick
npm install
npm run dev
```

### **Verificar Backups Disponíveis:**
```bash
npm run backup:list
```

### **Criar Backup de Emergência:**
```bash
npm run backup:now
```

---

**💡 Dica:** Mantenha este guia sempre à mão!  
**🛡️ Segurança:** Seus backups estão seguros na pasta `backups/`
