import { useEffect, useState } from "react"
import { ChatBalloon, ChatCardTime } from "."
import TMessage from "../../utils/types/message"
import BalloonSelectedProvider from "../../context/balloon_selected"

export interface ChatHandlerBallonProps {
  content: Array<TMessage>,
  user_id: string,
  className?: string,
  children?: React.ReactNode
}

export default function HandlerBallon({ content, user_id, className, children }: ChatHandlerBallonProps) {
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
  }, [content])

  content = content.sort((a, b) => a.createAt.getTime() - b.createAt.getTime())
  const groupedMessagesOfDate = Object.values(
    content.reduce((acc, message) => {
      const date = message.createAt.toDateString()
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


  function isFinalMessage(currentIndex: number, messages: Array<Omit<TMessage, 'channel_id'>>) {
    if(messages.length - 1 === currentIndex)
      return true
    if(messages[currentIndex].author.id !== messages[currentIndex + 1].author.id)
      return true
    return false
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {
        groupedMessagesOfDate.map((messages, key) => (
          <div key={"balloon"+key} className="flex flex-col px-14">
            <ChatCardTime now={clock} date={messages[0].createAt} className="m-auto mt-8 mb-5" />
            <BalloonSelectedProvider>
              {
                messages.map((message, index) => (
                  <>
                    <ChatBalloon
                      key={message.id}
                      id={message.id}
                      channel_id={message.channel_id}
                      isFinal={isFinalMessage(index, messages)}
                      date={message.createAt}
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
                    {
                      isFinalMessage(index, messages) && <span className="block h-5 w-full" />
                    }
                  </>
                ))
              }
            </BalloonSelectedProvider>
          </div>
        ))
      }
      {children}
    </div>
  )
}