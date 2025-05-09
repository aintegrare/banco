"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Database, Table, Key, Lock, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DiagnosticoTarefasPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [tableStatus, setTableStatus] = useState<"idle" | "success" | "error">("idle")
  const [tasksCount, setTasksCount] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tableStructure, setTableStructure] = useState<any[] | null>(null)
  const [sampleTasks, setSampleTasks] = useState<any[] | null>(null)
  const [activeTab, setActiveTab] = useState("diagnostico")

  // Testar conexão com o Supabase
  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("idle")
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("folder_tasks").select("count()", { count: "exact", head: true })

      if (error) {
        throw error
      }

      setConnectionStatus("success")
    } catch (error: any) {
      console.error("Erro ao testar conexão:", error)
      setConnectionStatus("error")
      setErrorMessage(error.message || "Erro desconhecido ao conectar ao Supabase")
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar estrutura da tabela
  const checkTableStructure = async () => {
    setIsLoading(true)
    setTableStatus("idle")
    setErrorMessage(null)

    try {
      const supabase = createClient()

      // Verificar se a tabela existe
      const { data: tableInfo, error: tableError } = await supabase.from("folder_tasks").select("*").limit(1)

      if (tableError) {
        if (tableError.code === "PGRST116") {
          throw new Error("A tabela 'folder_tasks' não existe no banco de dados")
        }
        throw tableError
      }

      // Obter informações sobre a estrutura da tabela
      const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
        table_name: "folder_tasks",
      })

      if (columnsError) {
        throw columnsError
      }

      setTableStructure(columns || [])
      setTableStatus("success")

      // Contar tarefas
      const { count, error: countError } = await supabase
        .from("folder_tasks")
        .select("*", { count: "exact", head: true })

      if (countError) {
        throw countError
      }

      setTasksCount(count)

      // Obter amostra de tarefas
      const { data: tasks, error: tasksError } = await supabase.from("folder_tasks").select("*").limit(5)

      if (tasksError) {
        throw tasksError
      }

      setSampleTasks(tasks)
    } catch (error: any) {
      console.error("Erro ao verificar estrutura da tabela:", error)
      setTableStatus("error")
      setErrorMessage(error.message || "Erro desconhecido ao verificar estrutura da tabela")
    } finally {
      setIsLoading(false)
    }
  }

  // Criar tabela se não existir
  const createTableIfNotExists = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()

      // Verificar se a função SQL existe
      const { data: functionExists, error: functionError } = await supabase.rpc("function_exists", {
        function_name: "create_folder_tasks_if_not_exists",
      })

      // Se a função não existir, criar a função
      if (functionError || !functionExists) {
        // Criar a função via SQL
        const { error: createFunctionError } = await supabase.rpc("execute_sql", {
          sql_statement: `
            CREATE OR REPLACE FUNCTION create_folder_tasks_if_not_exists()
            RETURNS void AS $$
            BEGIN
              -- Verificar se a tabela existe
              IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'folder_tasks'
              ) THEN
                -- Criar a tabela
                CREATE TABLE public.folder_tasks (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  folder_path TEXT NOT NULL,
                  description TEXT,
                  is_completed BOOLEAN DEFAULT false,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                  due_date TIMESTAMP WITH TIME ZONE,
                  color VARCHAR(20),
                  comments TEXT
                );
                
                -- Criar índice para melhorar performance
                CREATE INDEX folder_tasks_folder_path_idx ON public.folder_tasks (folder_path);
              END IF;
            END;
            $$ LANGUAGE plpgsql;
          `,
        })

        if (createFunctionError) {
          throw createFunctionError
        }
      }

      // Executar a função para criar a tabela
      const { error: executeError } = await supabase.rpc("create_folder_tasks_if_not_exists")

      if (executeError) {
        throw executeError
      }

      // Verificar novamente a estrutura da tabela
      await checkTableStructure()
    } catch (error: any) {
      console.error("Erro ao criar tabela:", error)
      setErrorMessage(error.message || "Erro desconhecido ao criar tabela")
    } finally {
      setIsLoading(false)
    }
  }

  // Adicionar tarefa de teste
  const addTestTask = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()

      const testTask = {
        folder_path: "documents/test",
        description: "Tarefa de teste criada em " + new Date().toLocaleString(),
        is_completed: false,
        color: "blue",
        comments: "Esta é uma tarefa de teste criada pela ferramenta de diagnóstico",
      }

      const { data, error } = await supabase.from("folder_tasks").insert([testTask]).select()

      if (error) {
        throw error
      }

      // Atualizar a amostra de tarefas
      await checkTableStructure()
    } catch (error: any) {
      console.error("Erro ao adicionar tarefa de teste:", error)
      setErrorMessage(error.message || "Erro desconhecido ao adicionar tarefa de teste")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#4b7bb5]">Diagnóstico de Tarefas</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="diagnostico" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
            Diagnóstico
          </TabsTrigger>
          <TabsTrigger value="estrutura" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
            Estrutura da Tabela
          </TabsTrigger>
          <TabsTrigger value="dados" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
            Dados de Exemplo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostico">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                  Conexão com o Banco de Dados
                </CardTitle>
                <CardDescription>Verifica se a aplicação consegue se conectar ao Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {connectionStatus === "idle" ? (
                      <Badge variant="outline" className="bg-gray-100">
                        Não verificado
                      </Badge>
                    ) : connectionStatus === "success" ? (
                      <Badge className="bg-green-500">Conectado</Badge>
                    ) : (
                      <Badge variant="destructive">Erro de Conexão</Badge>
                    )}
                  </div>
                  <Button onClick={testConnection} disabled={isLoading} variant="outline" className="ml-auto">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Testar Conexão
                  </Button>
                </div>

                {connectionStatus === "error" && errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro de Conexão</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {connectionStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Conexão Bem-sucedida</AlertTitle>
                    <AlertDescription className="text-green-600">
                      A aplicação conseguiu se conectar ao banco de dados Supabase com sucesso.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Table className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                  Tabela de Tarefas
                </CardTitle>
                <CardDescription>Verifica se a tabela folder_tasks existe e está acessível</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {tableStatus === "idle" ? (
                      <Badge variant="outline" className="bg-gray-100">
                        Não verificado
                      </Badge>
                    ) : tableStatus === "success" ? (
                      <Badge className="bg-green-500">Tabela OK</Badge>
                    ) : (
                      <Badge variant="destructive">Problema na Tabela</Badge>
                    )}
                  </div>
                  <Button
                    onClick={checkTableStructure}
                    disabled={isLoading || connectionStatus !== "success"}
                    variant="outline"
                    className="ml-auto"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verificar Tabela
                  </Button>
                </div>

                {tableStatus === "error" && errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Problema na Tabela</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {tableStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Tabela Verificada</AlertTitle>
                    <AlertDescription className="text-green-600">
                      A tabela folder_tasks existe e está acessível.
                      {tasksCount !== null && (
                        <div className="mt-2">
                          <strong>Total de tarefas:</strong> {tasksCount}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={createTableIfNotExists}
                  disabled={isLoading || connectionStatus !== "success"}
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Criar/Reparar Tabela
                </Button>

                <Button
                  onClick={addTestTask}
                  disabled={isLoading || tableStatus !== "success"}
                  className="bg-[#4b7bb5] hover:bg-[#3d649e]"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Adicionar Tarefa de Teste
                </Button>
              </CardFooter>
            </Card>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Key className="mr-2 h-5 w-5 text-[#4b7bb5]" />
              Solução de Problemas
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#4b7bb5]">Problema de Conexão</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Se houver problemas de conexão, verifique se as variáveis de ambiente do Supabase estão configuradas
                  corretamente.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#4b7bb5]">Tabela Não Encontrada</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Se a tabela não existir, use o botão "Criar/Reparar Tabela" para criá-la automaticamente.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#4b7bb5]">Problemas de Permissão</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Verifique se as políticas de segurança do Supabase permitem acesso à tabela folder_tasks.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#4b7bb5]">Dados Inconsistentes</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Se a estrutura da tabela estiver correta mas os dados não aparecem, verifique a aba "Dados de Exemplo"
                  para ver o formato dos dados armazenados.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="estrutura">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                Estrutura da Tabela folder_tasks
              </CardTitle>
              <CardDescription>Detalhes sobre as colunas e tipos de dados da tabela</CardDescription>
            </CardHeader>
            <CardContent>
              {tableStructure ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Coluna</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Nulo?</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Padrão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableStructure.map((column, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border border-gray-200 px-4 py-2 font-medium">{column.column_name}</td>
                          <td className="border border-gray-200 px-4 py-2">{column.data_type}</td>
                          <td className="border border-gray-200 px-4 py-2">
                            {column.is_nullable === "YES" ? "Sim" : "Não"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">{column.column_default || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#4b7bb5] mb-4" />
                      <p>Carregando estrutura da tabela...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <p>Clique em "Verificar Tabela" na aba Diagnóstico para ver a estrutura</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={checkTableStructure} disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Atualizar Estrutura
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Estrutura Esperada</h3>
            <p className="text-gray-600 mb-4">
              A tabela folder_tasks deve ter a seguinte estrutura para funcionar corretamente:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Coluna</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Tipo</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-medium">id</td>
                    <td className="border border-gray-200 px-4 py-2">UUID</td>
                    <td className="border border-gray-200 px-4 py-2">Identificador único da tarefa</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">folder_path</td>
                    <td className="border border-gray-200 px-4 py-2">TEXT</td>
                    <td className="border border-gray-200 px-4 py-2">Caminho da pasta associada à tarefa</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-medium">description</td>
                    <td className="border border-gray-200 px-4 py-2">TEXT</td>
                    <td className="border border-gray-200 px-4 py-2">Descrição da tarefa</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">is_completed</td>
                    <td className="border border-gray-200 px-4 py-2">BOOLEAN</td>
                    <td className="border border-gray-200 px-4 py-2">Status de conclusão da tarefa</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-medium">created_at</td>
                    <td className="border border-gray-200 px-4 py-2">TIMESTAMP WITH TIME ZONE</td>
                    <td className="border border-gray-200 px-4 py-2">Data de criação da tarefa</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">due_date</td>
                    <td className="border border-gray-200 px-4 py-2">TIMESTAMP WITH TIME ZONE</td>
                    <td className="border border-gray-200 px-4 py-2">Data de vencimento da tarefa</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-medium">color</td>
                    <td className="border border-gray-200 px-4 py-2">VARCHAR(20)</td>
                    <td className="border border-gray-200 px-4 py-2">Cor associada à tarefa</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">comments</td>
                    <td className="border border-gray-200 px-4 py-2">TEXT</td>
                    <td className="border border-gray-200 px-4 py-2">Comentários adicionais sobre a tarefa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                Dados de Exemplo
              </CardTitle>
              <CardDescription>Amostra de até 5 tarefas da tabela folder_tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {sampleTasks ? (
                sampleTasks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Pasta</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Descrição</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Concluída</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Criada em</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Vencimento</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Cor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleTasks.map((task, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-200 px-4 py-2 font-mono text-xs">{task.id}</td>
                            <td className="border border-gray-200 px-4 py-2">{task.folder_path}</td>
                            <td className="border border-gray-200 px-4 py-2">{task.description}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              {task.is_completed ? (
                                <Badge className="bg-green-500">Sim</Badge>
                              ) : (
                                <Badge variant="outline">Não</Badge>
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              {task.created_at ? new Date(task.created_at).toLocaleString() : "-"}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: task.color || "#cccccc" }}
                                ></div>
                                {task.color || "-"}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <p>Nenhuma tarefa encontrada na tabela</p>
                      <Button onClick={addTestTask} className="mt-4 bg-[#4b7bb5] hover:bg-[#3d649e]">
                        Adicionar Tarefa de Teste
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#4b7bb5] mb-4" />
                      <p>Carregando dados de exemplo...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <p>Clique em "Verificar Tabela" na aba Diagnóstico para ver os dados</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={checkTableStructure} disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Atualizar Dados
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Lock className="mr-2 h-5 w-5 text-[#4b7bb5]" />
              Permissões e Acesso
            </h3>

            <p className="text-gray-600 mb-4">
              Se você consegue ver os dados nesta página, mas não consegue acessá-los no explorador de arquivos, pode
              haver um problema com as permissões ou com a forma como os dados estão sendo consultados.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#4b7bb5]">Verificar Formato do Caminho</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Certifique-se de que o formato do caminho da pasta (folder_path) corresponde exatamente ao formato
                  usado no explorador de arquivos.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#4b7bb5]">Políticas de Segurança</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Verifique se as políticas de segurança do Supabase permitem leitura e escrita na tabela folder_tasks.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#4b7bb5]">Consulta SQL</h4>
                <p className="text-gray-600 text-sm mt-1">
                  A consulta SQL usada no explorador de arquivos deve corresponder ao formato dos dados armazenados.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
