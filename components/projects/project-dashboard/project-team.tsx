"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface ProjectTeamProps {
  team: TeamMember[]
}

export function ProjectTeam({ team }: ProjectTeamProps) {
  const [showAddMember, setShowAddMember] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Equipe</h2>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="text-[#4b7bb5] hover:text-[#3d649e] text-sm flex items-center"
        >
          <UserPlus size={16} className="mr-1" />
          Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {team.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white font-medium">
                {member.avatar}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-sm">Remover</button>
          </div>
        ))}
      </div>

      {showAddMember && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Adicionar membro à equipe</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Nome ou email do membro"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#4b7bb5]"
            />
            <button className="bg-[#4b7bb5] text-white px-4 py-2 rounded-r-md hover:bg-[#3d649e]">Adicionar</button>
          </div>
        </div>
      )}
    </div>
  )
}
