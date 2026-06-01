import { computed, type Ref } from 'vue'

type FlightHour = {
  date: string
  hours: number
}

export const useRollingFlightHours = (flightHours: Ref<FlightHour[]>) => {
  const { addDays, toDate, toIso } = useDateUtils()

  const hoursByDate = computed(() => new Map(flightHours.value.map((item) => [item.date, item.hours])))

  const rollingSum = (dateIso: string, windowDays: number) => {
    const end = toDate(dateIso)
    let total = 0

    for (let offset = windowDays - 1; offset >= 0; offset -= 1) {
      total += hoursByDate.value.get(toIso(addDays(end, -offset))) ?? 0
    }

    return Number(total.toFixed(1))
  }

  return {
    hoursByDate,
    rollingSum
  }
}
