interface AIResponseProps {
  response: string
}

export function AIResponse({ response }: AIResponseProps) {
  if (!response) {
    return <p className="text-gray-500">Aguardando resposta...</p>
  }

  // Formatar a resposta para exibir parágrafos e listas corretamente
  const formattedResponse = response.split("\n\n").map((paragraph, i) => {
    // Verificar se o parágrafo é uma lista numerada
    if (paragraph.match(/^\d+\./)) {
      const listItems = paragraph.split("\n").map((item, j) => (
        <li key={j} className="ml-6 list-decimal">
          {item.replace(/^\d+\.\s/, "")}
        </li>
      ))
      return (
        <ul key={i} className="my-3">
          {listItems}
        </ul>
      )
    }

    // Verificar se o parágrafo é um título
    if (paragraph.startsWith("#")) {
      return (
        <h3 key={i} className="text-lg font-medium text-[#3d649e] my-3">
          {paragraph.replace(/^#\s/, "")}
        </h3>
      )
    }

    return (
      <p key={i} className="my-3">
        {paragraph}
      </p>
    )
  })

  return <div className="prose prose-blue max-w-none">{formattedResponse}</div>
}
