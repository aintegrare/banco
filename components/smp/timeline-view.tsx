"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack } from "lucide-react"

interface TimelineEvent {
  id: string
  name: string
  startTime: number
  duration: number
  color: string
  track: number
}

export function TimelineView() {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [events] = useState<TimelineEvent[]>([
    { id: "1", name: "Motion Detected", startTime: 0, duration: 0.5, color: "#4b7bb5", track: 0 },
    { id: "2", name: "Snapshot Camera", startTime: 0.5, duration: 2, color: "#527eb7", track: 1 },
    { id: "3", name: "Turn On Lights", startTime: 0.5, duration: 1, color: "#3d649e", track: 2 },
    { id: "4", name: "Analyze Person", startTime: 2.5, duration: 3, color: "#4072b0", track: 1 },
    { id: "5", name: "Send Notification", startTime: 5.5, duration: 1, color: "#6b91c1", track: 3 },
  ])

  const totalDuration = 10 // seconds
  const trackHeight = 40
  const trackCount = 4

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const resetPlayback = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const timeToPosition = (time: number) => {
    return (time / totalDuration) * 100
  }

  return (
    <div className="h-full flex flex-col bg-white p-4">
      <div className="flex-1 relative">
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-6 flex">
          {Array.from({ length: totalDuration + 1 }).map((_, i) => (
            <div key={i} className="relative flex-1">
              <div className="absolute top-0 h-3 w-px bg-gray-300"></div>
              <div className="absolute top-4 text-xs text-gray-500">{i}s</div>
            </div>
          ))}
        </div>

        {/* Timeline tracks */}
        <div className="mt-8">
          {Array.from({ length: trackCount }).map((_, trackIndex) => (
            <div key={trackIndex} className="relative h-10 mb-2 bg-gray-100 rounded">
              {events
                .filter((event) => event.track === trackIndex)
                .map((event) => (
                  <motion.div
                    key={event.id}
                    className="absolute h-full rounded flex items-center px-2 overflow-hidden text-white text-sm"
                    style={{
                      left: `${timeToPosition(event.startTime)}%`,
                      width: `${timeToPosition(event.duration)}%`,
                      backgroundColor: event.color,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: event.startTime * 0.1 }}
                  >
                    {event.name}
                  </motion.div>
                ))}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        <motion.div
          className="absolute top-8 bottom-0 w-px bg-red-500 z-10"
          style={{ left: `${timeToPosition(currentTime)}%` }}
          animate={{ left: `${timeToPosition(currentTime)}%` }}
          transition={{ duration: 0.1 }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 -translate-x-1/2"></div>
        </motion.div>
      </div>

      <div className="h-16 flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={resetPlayback}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={togglePlayback}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={totalDuration}
            step={0.1}
            onValueChange={(value) => setCurrentTime(value[0])}
          />
        </div>
        <div className="text-sm tabular-nums">
          {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
        </div>
      </div>
    </div>
  )
}
