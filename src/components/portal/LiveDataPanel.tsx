'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useRealtime } from '@/lib/realtime-context';
import {
  DATA_PROVIDERS,
  type DataSourceConfig,
  type DataSourceProvider,
  DEFAULT_DATA_SOURCE,
  loadDataSourceConfig,
  saveDataSourceConfig,
} from '@/lib/live-data-config';
import {
  Wifi, WifiOff, RefreshCw, Zap, Database, Globe, Key, Clock,
  CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Info,
  Activity, Server, ArrowRightLeft, Shield, AlertTriangle, ExternalLink,
  Search, Play, Eye, Trophy, Lock,
} from 'lucide-react';

export default function LiveDataPanel() {
  const { updateDataSource, testConnection, liveDataState, isLiveMode, connected, refreshMatches } = useRealtime();

  const [config, setConfig] = useState<DataSourceConfig>(loadDataSourceConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<DataSourceProvider | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [exploreResult, setExploreResult] = useState<any>(null);
  const [exploreAction, setExploreAction] = useState<'status' | 'live' | 'today' | 'league'>('status');

  // Sincronizar config con localStorage
  useEffect(() => {
    const stored = loadDataSourceConfig();
    setConfig(stored);
  }, []);

  // Auto-test al cargar si hay credenciales configuradas
  useEffect(() => {
    if (config.apiKey && !testResult) {
      handleTestConnection();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProviderChange = (provider: DataSourceProvider) => {
    const providerConfig = DATA_PROVIDERS[provider as keyof typeof DATA_PROVIDERS];
    const newConfig: DataSourceConfig = {
      ...config,
      provider,
      apiKey: '',
      baseUrl: provider === 'mock' ? '' : (providerConfig?.baseUrl || ''),
      enabled: provider !== 'mock',
      options: {},
    };
    setConfig(newConfig);
    setTestResult(null);
    setExploreResult(null);
  };

  const handleSave = () => {
    saveDataSourceConfig(config);
    updateDataSource(config);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      refreshMatches();
    } finally {
      setTimeout(() => setSyncing(false), 1500);
    }
  };

  const handleToggleLive = () => {
    const newConfig = {
      ...config,
      enabled: !config.enabled,
      provider: config.enabled ? 'mock' as DataSourceProvider : (config.provider === 'mock' ? 'livescore' as DataSourceProvider : config.provider),
    };
    setConfig(newConfig);
    saveDataSourceConfig(newConfig);
    updateDataSource(newConfig);
  };

  // ==================== EXPLORAR API ====================
  const handleExplore = async (action: 'status' | 'live' | 'today' | 'league') => {
    setExploring(true);
    setExploreAction(action);
    setExploreResult(null);
    try {
      const params = new URLSearchParams({ action, provider: config.provider || 'livescore' });
      if (action === 'league') {
        // Liga Argentina por defecto para LiveScore, Liga Argentina para API-Sports
        params.set('league', config.provider === 'livescore' ? '152' : '128');
      }
      const response = await fetch(`/api/live/explore?${params.toString()}`);
      const data = await response.json();
      setExploreResult(data);
    } catch (error: any) {
      setExploreResult({ error: error.message });
    } finally {
      setExploring(false);
    }
  };

  const getConnectionStatusIcon = () => {
    if (!isLiveMode) return <Database className="w-4 h-4 text-blue-500" />;
    if (liveDataState.connectionStatus === 'connected') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (liveDataState.connectionStatus === 'connecting') return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    if (liveDataState.connectionStatus === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return <WifiOff className="w-4 h-4 text-gray-400" />;
  };

  const getConnectionStatusText = () => {
    if (!isLiveMode) return 'Modo Simulación';
    const statusMap = {
      connected: 'Conectado en Vivo',
      connecting: 'Conectando...',
      error: 'Error de Conexión',
      disconnected: 'Desconectado',
    };
    return statusMap[liveDataState.connectionStatus] || 'Desconocido';
  };

  const getStatusBadgeColor = () => {
    if (!isLiveMode) return 'bg-blue-100 text-blue-700';
    if (liveDataState.connectionStatus === 'connected') return 'bg-green-100 text-green-700';
    if (liveDataState.connectionStatus === 'connecting') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Detectar si el proveedor es LiveScore (necesita apiSecret)
  const isLiveScore = config.provider === 'livescore';

  return (
    <div className="space-y-6">
      {/* ==================== ESTADO DE CONEXIÓN ==================== */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Datos en Vivo - Mundial 2026
            </CardTitle>
            <Badge className={`${getStatusBadgeColor()} flex items-center gap-1.5 px-3 py-1`}>
              {getConnectionStatusIcon()}
              {getConnectionStatusText()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Interruptor principal */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-nd-green/5 to-nd-orange/5 border">
            <div className="flex items-center gap-3">
              {isLiveMode ? (
                <Zap className="w-6 h-6 text-nd-orange" />
              ) : (
                <Database className="w-6 h-6 text-blue-500" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isLiveMode ? 'Modo En Vivo' : 'Modo Simulación'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLiveMode
                    ? `Datos reales de ${DATA_PROVIDERS[config.provider as keyof typeof DATA_PROVIDERS]?.name || config.provider}`
                    : 'Datos simulados para demostración y desarrollo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[10px]">
                {isLiveMode ? config.provider : 'mock'}
              </Badge>
              <Switch
                checked={isLiveMode}
                onCheckedChange={handleToggleLive}
                className="data-[state=checked]:bg-nd-green"
              />
            </div>
          </div>

          {/* Estadísticas en vivo */}
          {isLiveMode && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-primary">{liveDataState.matchesSynced}</p>
                <p className="text-[10px] text-muted-foreground">Partidos Sincronizados</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-nd-orange">{liveDataState.goalsSynced}</p>
                <p className="text-[10px] text-muted-foreground">Goles Sincronizados</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-green-600">{liveDataState.totalRequests}</p>
                <p className="text-[10px] text-muted-foreground">Total Requests</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-red-500">{liveDataState.errorCount}</p>
                <p className="text-[10px] text-muted-foreground">Errores</p>
              </div>
            </div>
          )}

          {/* Último sync */}
          {liveDataState.lastSync && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Última sincronización: {new Date(liveDataState.lastSync).toLocaleTimeString('es-AR')}</span>
              {liveDataState.lastError && (
                <span className="text-red-500">• Error: {liveDataState.lastError}</span>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              Guía
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplore('status')}
              disabled={exploring}
              className="flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Explorar API
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ==================== AVISO: CUENTA SIN ACCESO ==================== */}
      {testResult && !testResult.success && (
        <Card className="border-red-300 bg-red-50/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="font-bold text-red-800 text-lg">
                    {isLiveScore ? 'Cuenta de LiveScore sin acceso' : 'Cuenta de API-Sports suspendida'}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{testResult.message}</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200 space-y-2">
                  <p className="font-semibold text-sm text-red-800">Cómo activar tu cuenta:</p>
                  <ol className="space-y-2 text-xs text-red-700">
                    <li className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-800 text-[10px]">1</span>
                      <span>Ingresá a <a href={isLiveScore ? 'https://livescore-api.com/dashboard' : 'https://dashboard.api-football.com'} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{isLiveScore ? 'livescore-api.com/dashboard' : 'dashboard.api-football.com'}</a> con tu cuenta</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-800 text-[10px]">2</span>
                      <span>{isLiveScore ? 'Seleccioná un plan (el plan Free permite testing con 1 req/min)' : 'Reactivá tu cuenta en la sección Profile/Subscription'}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-800 text-[10px]">3</span>
                      <span>Una vez activado, volvé acá y hacé clic en "Probar Conexión"</span>
                    </li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <a
                    href={isLiveScore ? 'https://livescore-api.com/dashboard' : 'https://dashboard.api-football.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-900"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ir al Dashboard
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex items-center gap-1.5"
                  >
                    {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                    Reintentar
                  </Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    <strong>Tus credenciales ya están configuradas</strong> en el servidor (.env). Una vez que actives tu cuenta, todo va a funcionar automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ==================== GUÍA DE CONFIGURACIÓN ==================== */}
      {showGuide && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              Cómo conectar con datos en vivo
            </h3>
            <div className="space-y-3 text-xs text-amber-900">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800">1</span>
                <div>
                  <p className="font-semibold">Elige un proveedor de API</p>
                  <p className="text-amber-700 mt-1">LiveScore API (recomendado), API-Sports, Football-Data.org o SportMonks.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800">2</span>
                <div>
                  <p className="font-semibold">Regístrate y obtené tus credenciales</p>
                  <p className="text-amber-700 mt-1">Cada proveedor tiene su propio sistema de registro. LiveScore usa API Key + API Secret.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800">3</span>
                <div>
                  <p className="font-semibold">Configura las credenciales aquí</p>
                  <p className="text-amber-700 mt-1">Seleccioná el proveedor, ingresá tu API Key (y API Secret si es LiveScore) y probá la conexión.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800">4</span>
                <div>
                  <p className="font-semibold">Activá el modo En Vivo</p>
                  <p className="text-amber-700 mt-1">Los datos reales del Mundial reemplazarán los datos simulados automáticamente.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ==================== SELECCIÓN DE PROVEEDOR ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Proveedor de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Seleccionar Proveedor</Label>
            <Select
              value={config.provider}
              onValueChange={(v) => handleProviderChange(v as DataSourceProvider)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mock">
                  <span className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    Simulación (Mock)
                  </span>
                </SelectItem>
                {Object.entries(DATA_PROVIDERS).map(([key, provider]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      {key === 'livescore' ? (
                        <Zap className="w-3.5 h-3.5 text-nd-orange" />
                      ) : (
                        <Server className="w-3.5 h-3.5 text-green-500" />
                      )}
                      {provider.name}
                      {key === 'livescore' && <span className="text-[10px] text-nd-orange">(Recomendado)</span>}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Detalles del proveedor seleccionado */}
          {config.provider !== 'mock' && (
            <div className="space-y-3">
              {(() => {
                const provider = DATA_PROVIDERS[config.provider as keyof typeof DATA_PROVIDERS];
                if (!provider) return null;

                const isExpanded = expandedProvider === config.provider;

                return (
                  <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedProvider(isExpanded ? null : config.provider)}
                    >
                      <div>
                        <p className="font-bold text-sm">{provider.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{provider.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    {isExpanded && (
                      <>
                        <div className="bg-background p-3 rounded-lg">
                          <p className="text-[10px] font-semibold text-muted-foreground mb-1">PRICING</p>
                          <p className="text-xs">{provider.pricing}</p>
                        </div>
                        <div className="bg-background p-3 rounded-lg">
                          <p className="text-[10px] font-semibold text-muted-foreground mb-2">CARACTERÍSTICAS</p>
                          <ul className="space-y-1">
                            {provider.features.map((f, i) => (
                              <li key={i} className="text-xs flex items-center gap-1.5">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <a
                          href={provider.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          Ver documentación oficial
                        </a>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* ==================== CAMPOS DE CONFIGURACIÓN ==================== */}
              <div className="space-y-3">
                {(() => {
                  const provider = DATA_PROVIDERS[config.provider as keyof typeof DATA_PROVIDERS];
                  if (!provider) return null;
                  return provider.requiredFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        {field.key === 'apiSecret' ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Key className="w-3 h-3" />
                        )}
                        {field.label}
                      </Label>
                      <div className="relative">
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={field.key === 'apiKey' ? config.apiKey : (config.options[field.key] || '')}
                          onChange={(e) => {
                            if (field.key === 'apiKey') {
                              setConfig(prev => ({ ...prev, apiKey: e.target.value }));
                            } else {
                              setConfig(prev => ({
                                ...prev,
                                options: { ...prev.options, [field.key]: e.target.value },
                              }));
                            }
                          }}
                          className="text-sm pr-10"
                        />
                        {((field.key === 'apiKey' && config.apiKey) || (field.key !== 'apiKey' && config.options[field.key])) && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {field.key === 'apiKey' && (
                        <p className="text-[10px] text-muted-foreground">
                          Ya configurada en el archivo .env del servidor. Podés cambiarla aquí para usar otra clave.
                        </p>
                      )}
                      {field.key === 'apiSecret' && (
                        <p className="text-[10px] text-muted-foreground">
                          LiveScore requiere un API Secret además de la API Key. Ambos van como parámetros en la URL.
                        </p>
                      )}
                    </div>
                  ));
                })()}

                {/* Base URL */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    URL Base
                  </Label>
                  <Input
                    type="text"
                    value={config.baseUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    className="text-sm"
                    placeholder="Se auto-completa según el proveedor"
                  />
                  <p className="text-[10px] text-muted-foreground">Se completa automáticamente. Solo modifícala si usás un proxy o URL personalizada.</p>
                </div>

                {/* Poll interval */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Intervalo de Consulta (segundos)
                  </Label>
                  <Select
                    value={String(config.pollInterval)}
                    onValueChange={(v) => setConfig(prev => ({ ...prev, pollInterval: parseInt(v) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seg - Ultra rápido</SelectItem>
                      <SelectItem value="30">30 seg - Recomendado</SelectItem>
                      <SelectItem value="60">60 seg - Económico</SelectItem>
                      <SelectItem value="120">120 seg - Ahorro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Test Connection */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={testing || !config.apiKey}
                  className="flex items-center gap-1.5"
                >
                  {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                  {testing ? 'Probando...' : 'Probar Conexión'}
                </Button>
                {testResult && (
                  <Badge className={`text-[11px] max-w-md ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {testResult.success ? <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" /> : <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />}
                    <span className="break-words">{testResult.message}</span>
                  </Badge>
                )}
              </div>

              {/* Save */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!config.apiKey && config.provider !== 'mock'}
                  className="flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Guardar y Activar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfig(DEFAULT_DATA_SOURCE);
                    updateDataSource(DEFAULT_DATA_SOURCE);
                    setTestResult(null);
                    setExploreResult(null);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Volver a Simulación
                </Button>
              </div>
            </div>
          )}

          {/* Mock mode info */}
          {config.provider === 'mock' && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-blue-800">Modo Simulación Activo</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Los datos se simulan localmente. Para conectar con datos reales, seleccioná un proveedor de API.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== EXPLORAR API ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Explorar Partidos Reales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Probá la API para ver partidos reales. Tus credenciales ya están configuradas en el servidor.
          </p>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplore('status')}
              disabled={exploring}
              className="flex items-center gap-1.5"
            >
              {exploring && exploreAction === 'status' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
              Estado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplore('live')}
              disabled={exploring}
              className="flex items-center gap-1.5"
            >
              {exploring && exploreAction === 'live' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              En Vivo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplore('today')}
              disabled={exploring}
              className="flex items-center gap-1.5"
            >
              {exploring && exploreAction === 'today' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              De Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplore('league')}
              disabled={exploring}
              className="flex items-center gap-1.5"
            >
              {exploring && exploreAction === 'league' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trophy className="w-3.5 h-3.5" />}
              Liga Argentina
            </Button>
          </div>

          {/* Resultados */}
          {exploreResult && (
            <div className={`rounded-xl border p-4 ${exploreResult.error ? 'border-red-200 bg-red-50/50' : exploreResult.success === false ? 'border-orange-200 bg-orange-50/50' : exploreResult.success === true ? 'border-green-200 bg-green-50/50' : exploreResult.matches ? 'border-green-200 bg-green-50/50' : 'border-border bg-muted/20'}`}>
              {exploreResult.error ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-sm text-red-800">Error</span>
                  </div>
                  <p className="text-xs text-red-700">{exploreResult.error}</p>
                  {exploreResult.errorType === 'account_suspended' && (
                    <a
                      href={exploreResult.helpUrl || (exploreResult.provider === 'livescore' ? 'https://livescore-api.com/dashboard' : 'https://dashboard.api-football.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ir al Dashboard para activar la cuenta
                    </a>
                  )}
                </div>
              ) : exploreResult.success === false ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-sm text-orange-800">Problema detectado</span>
                  </div>
                  <p className="text-xs text-orange-700">{exploreResult.message}</p>
                </div>
              ) : exploreResult.success === true ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-sm text-green-800">Conexión exitosa</span>
                    <Badge variant="outline" className="text-[10px]">{exploreResult.provider}</Badge>
                  </div>
                  <p className="text-xs text-green-700">{exploreResult.message}</p>
                </div>
              ) : exploreResult.matches ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-sm text-green-800">
                      {exploreResult.count || exploreResult.matches.length} partidos encontrados
                    </span>
                    <Badge variant="outline" className="text-[10px]">{exploreResult.provider || exploreResult.source}</Badge>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {exploreResult.matches.slice(0, 20).map((m: any, i: number) => (
                      <div key={m.id || i} className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={m.status === 'in_play' || m.status === 'half_time' ? 'destructive' : 'secondary'} className="text-[10px]">
                            {m.status === 'in_play' ? `${m.minute}' EN VIVO` : m.status === 'half_time' ? 'ENTRE TIEMPO' : m.status === 'finished' ? 'FINAL' : m.status === 'not_started' ? 'POR JUGAR' : m.status}
                          </Badge>
                          <span className="font-medium">{m.homeTeam}</span>
                          <span className="text-muted-foreground font-mono">{m.homeScore} - {m.awayScore}</span>
                          <span className="font-medium">{m.awayTeam}</span>
                        </div>
                      </div>
                    ))}
                    {exploreResult.matches.length > 20 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ...y {exploreResult.matches.length - 20} partidos más
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(exploreResult, null, 2).substring(0, 500)}</pre>
                </div>
              )}

              {/* Ligas populares */}
              {exploreResult.popularLeagues && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-2">LIGAS PARA PROBAR</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exploreResult.popularLeagues.map((l: any) => (
                      <Badge key={l.id} variant="outline" className="text-[10px]">
                        {l.flag} {l.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== COMPARACIÓN DE PROVEEDORES ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Comparación de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Proveedor</th>
                  <th className="text-left p-2 font-semibold">Plan Gratuito</th>
                  <th className="text-left p-2 font-semibold">En Vivo</th>
                  <th className="text-left p-2 font-semibold">Estadísticas</th>
                  <th className="text-left p-2 font-semibold">Latencia</th>
                  <th className="text-left p-2 font-semibold">Mejor Para</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-nd-orange/5">
                  <td className="p-2 font-medium text-nd-orange">LiveScore</td>
                  <td className="p-2 text-green-600">1 req/min</td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2">~5 seg</td>
                  <td className="p-2 text-nd-orange font-semibold">Recomendado</td>
                </tr>
                <tr className="border-b hover:bg-muted/30">
                  <td className="p-2 font-medium">API-Sports</td>
                  <td className="p-2 text-green-600">100 req/día</td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2">~5 seg</td>
                  <td className="p-2">Más datos</td>
                </tr>
                <tr className="border-b hover:bg-muted/30">
                  <td className="p-2 font-medium">Football-Data</td>
                  <td className="p-2 text-green-600">10 req/min</td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2">~30 seg</td>
                  <td className="p-2">Gratis</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-2 font-medium">SportMonks</td>
                  <td className="p-2 text-yellow-600">Limitado</td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></td>
                  <td className="p-2">&lt;30 seg</td>
                  <td className="p-2">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ==================== ARQUITECTURA ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-nd-orange" />
            Cómo Funciona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-nd-green/5 border border-nd-green/20 text-center">
              <div className="w-10 h-10 rounded-full bg-nd-green/10 flex items-center justify-center mx-auto mb-2">
                <Server className="w-5 h-5 text-nd-green" />
              </div>
              <p className="font-bold text-xs">Proveedor de API</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                LiveScore, API-Sports, etc. envían datos en tiempo real
              </p>
            </div>
            <div className="p-3 rounded-lg bg-nd-orange/5 border border-nd-orange/20 text-center">
              <div className="w-10 h-10 rounded-full bg-nd-orange/10 flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="w-5 h-5 text-nd-orange" />
              </div>
              <p className="font-bold text-xs">API Routes</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Next.js consulta la API cada {config.pollInterval}s
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-bold text-xs">Portal</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Datos en vivo sin recargar la página
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-nd-green/10 rounded">Estadio</span>
            <span>-&gt;</span>
            <span className="px-2 py-1 bg-nd-green/10 rounded">LiveScore API</span>
            <span>-&gt;</span>
            <span className="px-2 py-1 bg-nd-orange/10 rounded">/api/live/*</span>
            <span>-&gt;</span>
            <span className="px-2 py-1 bg-primary/10 rounded">Portal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
