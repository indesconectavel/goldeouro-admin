import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const System = () => {
  const [systemInfo, setSystemInfo] = useState({
    status: 'online',
    uptime: '2h 30m',
    memory: {
      used: 45,
      total: 100
    },
    cpu: 25,
    disk: {
      used: 60,
      total: 100
    }
  });

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simular carregamento de logs
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          level: 'info',
          message: 'Sistema iniciado com sucesso',
          timestamp: '2025-01-17T14:00:00Z'
        },
        {
          id: 2,
          level: 'warning',
          message: 'Uso de memória alto detectado',
          timestamp: '2025-01-17T13:45:00Z'
        },
        {
          id: 3,
          level: 'error',
          message: 'Falha na conexão com banco de dados',
          timestamp: '2025-01-17T13:30:00Z'
        }
      ]);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Manutenção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getLogLevelBadge = (level) => {
    switch (level) {
      case 'info':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">INFO</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">WARN</Badge>;
      case 'error':
        return <Badge variant="destructive">ERROR</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sistema</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button>
            <Server className="w-4 h-4 mr-2" />
            Reiniciar Serviços
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(systemInfo.status)}
              <span className="text-sm text-gray-600">
                Uptime: {systemInfo.uptime}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {systemInfo.cpu}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${systemInfo.cpu}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Memória
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {systemInfo.memory.used}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${systemInfo.memory.used}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Disco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {systemInfo.disk.used}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${systemInfo.disk.used}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Logs do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    {getLogLevelBadge(log.level)}
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Uso de memória alto</p>
                  <p className="text-sm text-yellow-600">Considere reiniciar o sistema</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Sistema funcionando normalmente</p>
                  <p className="text-sm text-green-600">Todos os serviços operacionais</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default System;