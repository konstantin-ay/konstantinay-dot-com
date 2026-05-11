import { useEffect, useState } from 'react'

const TIME_ZONE = 'Europe/Stockholm'
const LABEL = 'Local time in Gothenburg, Sweden'

const displayFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

type Snapshot = { display: string; machine: string }

function snapshot(date: Date): Snapshot {
  const display = displayFormatter.format(date)
  return { display, machine: display }
}

export function LocalTime() {
  const [now, setNow] = useState<Snapshot>(() => snapshot(new Date()))

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      const date = new Date()
      setNow(snapshot(date))
      const msToNextMinute = 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())
      timeoutId = setTimeout(tick, msToNextMinute)
    }

    tick()

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <time
      title={LABEL}
      dateTime={now.machine}
      className='inline-flex h-9 items-center gap-2 rounded-full border border-rule bg-bg/60 px-3 text-sm text-fg backdrop-blur'
    >
      <span className='text-muted'>Gothenburg</span>
      <span aria-hidden='true' className='text-rule'>
        &middot;
      </span>
      <span className='tabular-nums' suppressHydrationWarning>
        {now.display}
      </span>
    </time>
  )
}
