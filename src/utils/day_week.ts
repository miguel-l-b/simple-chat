export default function dayWeek(day: number): string {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feria',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ]
  return days[day];
}