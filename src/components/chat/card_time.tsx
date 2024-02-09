import dayWeek from "../../utils/day_week"

export interface ChatCardTimeProps {
  date: Date,
  now: Date,
  className?: string
}

export default function CardTime({date, now, className}: ChatCardTimeProps) {
  const message = 
    now.getFullYear() !== date.getFullYear()? 
      `${date.toLocaleDateString()}` :
      (now.getDate() - date.getDate()) > 6? 
      `${date.getDay()}/${date.getMonth()}` :
      (now.getDate() - date.getDate()) > 1?
      `${dayWeek(date.getDay())}` :
      (now.getDate() - date.getDate()) === 1?
      `Ontem` :
      `Hoje`
  
  return (
    <div className={`min-w-28 w-fit px-3 rounded-lg bg-gray-800 text-white text-center ${className}`}>
      <p>{message}</p>
    </div>
  )
}