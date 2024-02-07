import { useEffect, useState } from "react"
import { ChatBallon, ChatCardTime } from "."
import TMessage from "../../utils/types/message"

export interface ChatHandlerBallonProps {
  content: Array<TMessage>,
  user_id: string,
  className?: string
}

export default function HandlerBallon({ content, user_id, className }: ChatHandlerBallonProps) {
  const [clock, setClock] = useState(new Date())
  content = content.sort((a, b) => a.date.getTime() - b.date.getTime())
  const groupedMessagesOfDate = Object.values(
    content.reduce((acc, message) => {
      const date = message.date.toDateString()
      if (acc[date]) {
        acc[date].push(message)
      } else {
        acc[date] = [message]
      }
      return acc
    }, {} as { [key: string]: Array<TMessage> })
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])


  return (
    <>
      <div className={`flex flex-col gap-4 ${className}`}>
        {
          groupedMessagesOfDate.map((messages, index) => (
            <div key={index} className="flex flex-col gap-2">
              <ChatCardTime now={clock} date={messages[0].date} className="m-auto mt-8 mb-5" />
              {
                messages.map(message => (
                  <ChatBallon
                    key={message.id}
                    direction={
                      user_id !== message.author.id ? 
                        "left" 
                      : 
                        "right"
                    }
                    isFinal={
                      messages.filter(m => 
                        m.author.id === message.author.id
                      ).pop() === message
                    }
                    read={message.read}
                  >
                    {message.content}
                  </ChatBallon>
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  )
}