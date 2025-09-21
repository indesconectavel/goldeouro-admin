// src/utils/securityLogger.js - Sistema de logging de segurança

class SecurityLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Máximo de logs em memória
  }

  // Log de tentativa de login
  logLoginAttempt(username, success, ip = 'unknown', userAgent = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'LOGIN_ATTEMPT',
      username,
      success,
      ip,
      userAgent,
      severity: success ? 'INFO' : 'WARNING'
    };

    this.addLog(log);
    console.log(`[SECURITY] Login attempt: ${username} - ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  // Log de logout
  logLogout(username, ip = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'LOGOUT',
      username,
      ip,
      severity: 'INFO'
    };

    this.addLog(log);
    console.log(`[SECURITY] Logout: ${username}`);
  }

  // Log de tentativa de acesso não autorizado
  logUnauthorizedAccess(resource, username = 'unknown', ip = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'UNAUTHORIZED_ACCESS',
      resource,
      username,
      ip,
      severity: 'WARNING'
    };

    this.addLog(log);
    console.warn(`[SECURITY] Unauthorized access attempt: ${resource} by ${username}`);
  }

  // Log de rate limiting
  logRateLimitExceeded(identifier, ip = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'RATE_LIMIT_EXCEEDED',
      identifier,
      ip,
      severity: 'WARNING'
    };

    this.addLog(log);
    console.warn(`[SECURITY] Rate limit exceeded: ${identifier}`);
  }

  // Log de validação de entrada
  logInputValidation(field, value, isValid, username = 'unknown') {
    if (!isValid) {
      const log = {
        timestamp: new Date().toISOString(),
        type: 'INPUT_VALIDATION_FAILED',
        field,
        value: this.sanitizeValue(value),
        username,
        severity: 'WARNING'
      };

      this.addLog(log);
      console.warn(`[SECURITY] Input validation failed: ${field} = ${this.sanitizeValue(value)}`);
    }
  }

  // Log de erro de segurança
  logSecurityError(error, context = {}, username = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'SECURITY_ERROR',
      error: error.message,
      context,
      username,
      severity: 'ERROR'
    };

    this.addLog(log);
    console.error(`[SECURITY] Security error: ${error.message}`, context);
  }

  // Log de atividade suspeita
  logSuspiciousActivity(activity, details = {}, username = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'SUSPICIOUS_ACTIVITY',
      activity,
      details,
      username,
      severity: 'WARNING'
    };

    this.addLog(log);
    console.warn(`[SECURITY] Suspicious activity: ${activity}`, details);
  }

  // Log de token inválido
  logInvalidToken(token, username = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'INVALID_TOKEN',
      token: token.substring(0, 10) + '...', // Apenas primeiros 10 caracteres
      username,
      severity: 'WARNING'
    };

    this.addLog(log);
    console.warn(`[SECURITY] Invalid token used by ${username}`);
  }

  // Log de sessão expirada
  logSessionExpired(username, ip = 'unknown') {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'SESSION_EXPIRED',
      username,
      ip,
      severity: 'INFO'
    };

    this.addLog(log);
    console.log(`[SECURITY] Session expired: ${username}`);
  }

  // Adicionar log à lista
  addLog(log) {
    this.logs.unshift(log);
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Em produção, enviar para servidor de logs
    this.sendToServer(log);
  }

  // Enviar log para servidor (implementar em produção)
  async sendToServer(log) {
    try {
      // Em desenvolvimento, apenas log local
      if (process.env.NODE_ENV === 'development') {
        return;
      }

      // Em produção, enviar para endpoint de logs
      const response = await fetch('/api/security/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(log)
      });

      if (!response.ok) {
        console.error('Failed to send security log to server');
      }
    } catch (error) {
      console.error('Error sending security log:', error);
    }
  }

  // Sanitizar valor para log
  sanitizeValue(value) {
    if (typeof value !== 'string') return String(value);
    
    // Remover informações sensíveis
    return value
      .replace(/password/gi, '[REDACTED]')
      .replace(/token/gi, '[REDACTED]')
      .replace(/secret/gi, '[REDACTED]')
      .substring(0, 100); // Limitar tamanho
  }

  // Obter logs por tipo
  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  }

  // Obter logs por severidade
  getLogsBySeverity(severity) {
    return this.logs.filter(log => log.severity === severity);
  }

  // Obter logs recentes
  getRecentLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  // Obter estatísticas
  getStats() {
    const stats = {
      total: this.logs.length,
      byType: {},
      bySeverity: {},
      recent: this.logs.filter(log => 
        new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    };

    this.logs.forEach(log => {
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
    });

    return stats;
  }

  // Limpar logs antigos
  clearOldLogs(days = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => new Date(log.timestamp) > cutoffDate);
  }

  // Exportar logs
  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      logs: this.logs,
      stats: this.getStats()
    };
  }
}

// Instância singleton
const securityLogger = new SecurityLogger();

export default securityLogger;
