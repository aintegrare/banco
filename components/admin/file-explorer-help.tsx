"use client"

import { useState } from "react"
import {
  HelpCircle,
  Info,
  MousePointer,
  Folder,
  File,
  Star,
  Clock,
  Search,
  Upload,
  FolderPlus,
  Download,
  Share2,
  Trash2,
  Pencil,
  MoveIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FileExplorerHelp() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="flex items-center">
        <HelpCircle className="h-4 w-4 mr-2" />
        <span>Ajuda</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-[#4b7bb5]" />
              Ajuda do Gerenciador de Arquivos
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basics">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="basics">Básico</TabsTrigger>
              <TabsTrigger value="navigation">Navegação</TabsTrigger>
              <TabsTrigger value="actions">Ações</TabsTrigger>
              <TabsTrigger value="keyboard">Atalhos</TabsTrigger>
            </TabsList>

            {/* Aba Básico */}
            <TabsContent value="basics" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Folder className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Navegação de Pastas
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Navegue pelas pastas clicando nelas. Use o caminho de navegação (breadcrumbs) no topo para voltar a
                    pastas anteriores.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Dica:</p>
                    <p className="text-gray-600">Clique no ícone de casa para voltar à pasta raiz.</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <MousePointer className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Visualizações
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Alterne entre visualizações em grade, lista e detalhes usando os botões de visualização.
                  </p>
                  <div className="flex space-x-2">
                    <div className="bg-gray-50 p-2 rounded-md border flex-1 text-center text-sm">Grade</div>
                    <div className="bg-gray-50 p-2 rounded-md border flex-1 text-center text-sm">Lista</div>
                    <div className="bg-gray-50 p-2 rounded-md border flex-1 text-center text-sm">Detalhes</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-amber-500" />
                    Favoritos
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Marque arquivos e pastas como favoritos para acessá-los rapidamente. Os favoritos são salvos
                    localmente no seu navegador.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Dica:</p>
                    <p className="text-gray-600">Acesse todos os seus favoritos na aba "Favoritos".</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Arquivos Recentes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Acesse rapidamente os arquivos que você visualizou ou modificou recentemente na aba "Recentes".
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Dica:</p>
                    <p className="text-gray-600">Os arquivos são ordenados do mais recente para o mais antigo.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Navegação */}
            <TabsContent value="navigation" className="space-y-4 mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                  Busca
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use a barra de busca para encontrar arquivos e pastas rapidamente. A busca é realizada na pasta atual
                  e em todas as subpastas.
                </p>
                <div className="bg-gray-50 p-3 rounded-md border text-sm">
                  <p className="font-medium">Busca Avançada:</p>
                  <p className="text-gray-600">
                    Clique no ícone de filtro para acessar opções de busca avançada, como filtrar por tipo de arquivo,
                    data ou tamanho.
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Navegação por Abas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use as abas para alternar entre diferentes visualizações dos seus arquivos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-medium flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      Todos os Arquivos
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Mostra todos os arquivos e pastas na localização atual.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recentes
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Mostra os arquivos acessados recentemente.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Favoritos
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Mostra os arquivos e pastas marcados como favoritos.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-medium flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhados
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Mostra os arquivos que você compartilhou com outros.</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Ordenação</h3>
                <p className="text-sm text-gray-600 mb-4">Ordene seus arquivos e pastas por diferentes critérios.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md border text-center">
                    <p className="font-medium">Nome</p>
                    <p className="text-xs text-gray-600 mt-1">Ordena alfabeticamente</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border text-center">
                    <p className="font-medium">Data</p>
                    <p className="text-xs text-gray-600 mt-1">Ordena por data de modificação</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border text-center">
                    <p className="font-medium">Tamanho</p>
                    <p className="text-xs text-gray-600 mt-1">Ordena por tamanho do arquivo</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Ações */}
            <TabsContent value="actions" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Upload de Arquivos
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Faça upload de arquivos arrastando-os para a área de arquivos ou usando o botão de upload.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Tipos suportados:</p>
                    <p className="text-gray-600">Imagens, documentos, vídeos, áudio e arquivos compactados.</p>
                    <p className="text-gray-600 mt-1">Tamanho máximo: 100MB (500MB para vídeos)</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <FolderPlus className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Criar Pasta
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Crie novas pastas para organizar seus arquivos usando o botão "Criar Pasta".
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Dica:</p>
                    <p className="text-gray-600">Use nomes descritivos para facilitar a localização posterior.</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Download className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Download
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Faça download de arquivos individuais ou múltiplos arquivos selecionados.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Múltiplos arquivos:</p>
                    <p className="text-gray-600">
                      Para baixar múltiplos arquivos, ative o modo de seleção, selecione os arquivos e use a opção de
                      download.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Compartilhar
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Compartilhe arquivos e pastas com outras pessoas gerando links de compartilhamento.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Opções:</p>
                    <p className="text-gray-600">
                      Você pode definir permissões e datas de expiração para links compartilhados.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                    Excluir
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Exclua arquivos e pastas que você não precisa mais.</p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium text-red-500">Atenção:</p>
                    <p className="text-gray-600">
                      A exclusão é permanente e não pode ser desfeita. Tenha certeza antes de excluir.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Pencil className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Renomear
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Renomeie arquivos e pastas para melhor organização.</p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Dica:</p>
                    <p className="text-gray-600">
                      Ao renomear pastas, todos os links para arquivos dentro dela serão atualizados automaticamente.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <MoveIcon className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Mover
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Mova arquivos e pastas para diferentes localizações.</p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium">Arrastar e soltar:</p>
                    <p className="text-gray-600">
                      Você também pode arrastar e soltar arquivos entre pastas para movê-los rapidamente.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <MousePointer className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                    Seleção Múltipla
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione múltiplos arquivos e pastas para realizar ações em lote.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                      <p className="font-medium">Ativar seleção:</p>
                      <p className="text-gray-600">
                        Clique no botão "Selecionar Múltiplos" para ativar o modo de seleção.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                      <p className="font-medium">Selecionar todos:</p>
                      <p className="text-gray-600">
                        Use o botão "Selecionar Todos" para selecionar todos os itens visíveis.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                      <p className="font-medium">Ações em lote:</p>
                      <p className="text-gray-600">Mova, exclua ou baixe múltiplos arquivos de uma vez.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Atalhos */}
            <TabsContent value="keyboard" className="mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Atalhos de Teclado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Navegação</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Home</td>
                          <td className="py-2 pl-4">Ir para a pasta raiz</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Backspace</td>
                          <td className="py-2 pl-4">Voltar para a pasta anterior</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Enter</td>
                          <td className="py-2 pl-4">Abrir pasta ou arquivo</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + F</td>
                          <td className="py-2 pl-4">Focar na busca</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Ações</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + A</td>
                          <td className="py-2 pl-4">Selecionar todos os itens</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Delete</td>
                          <td className="py-2 pl-4">Excluir item(ns) selecionado(s)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">F2</td>
                          <td className="py-2 pl-4">Renomear item selecionado</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + C</td>
                          <td className="py-2 pl-4">Copiar caminho do arquivo</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + D</td>
                          <td className="py-2 pl-4">Download do arquivo selecionado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Visualização</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + 1</td>
                          <td className="py-2 pl-4">Visualização em grade</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + 2</td>
                          <td className="py-2 pl-4">Visualização em lista</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + 3</td>
                          <td className="py-2 pl-4">Visualização em detalhes</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + +</td>
                          <td className="py-2 pl-4">Aumentar tamanho dos ícones</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + -</td>
                          <td className="py-2 pl-4">Diminuir tamanho dos ícones</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Outros</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">F1</td>
                          <td className="py-2 pl-4">Abrir esta ajuda</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">F5</td>
                          <td className="py-2 pl-4">Atualizar lista de arquivos</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Esc</td>
                          <td className="py-2 pl-4">Cancelar operação atual</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4 font-mono bg-gray-50 rounded">Ctrl + S</td>
                          <td className="py-2 pl-4">Favoritar item selecionado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button onClick={() => setIsOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
