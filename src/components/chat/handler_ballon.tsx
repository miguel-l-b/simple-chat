import { useEffect, useState } from "react"
import { ChatBalloon, ChatCardTime } from "."
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


  function isFinalMessage(currentIndex: number, messages: Array<TMessage>) {
    if(messages.length - 1 === currentIndex)
      return true
    if(messages[currentIndex].author.id !== messages[currentIndex + 1].author.id)
      return true
    return false
  }

  return (
    <>
      <div className={`flex flex-col gap-4 ${className}`}>
        {
          groupedMessagesOfDate.flatMap((messages, index) => (
            <div key={index} className="flex flex-col gap-2">
              <ChatCardTime now={clock} date={messages[0].date} className="m-auto mt-8 mb-5" />
              {
                messages.map((message, index) => (
                  <>
                    <ChatBalloon
                      key={message.id}
                      isFinal={isFinalMessage(index, messages)}
                      direction={
                        user_id !== message.author.id ? 
                          "left" 
                        : 
                          "right"
                      }
                      avatar={message.author.avatar}
                      author={message.author.name}
                      read={message.read}
                    >
                      {message.content}
                    </ChatBalloon>
                  </>
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  )
}