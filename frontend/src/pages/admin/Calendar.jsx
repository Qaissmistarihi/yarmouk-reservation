import React, { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import api from '../../services/api'

export default function AdminCalendar() {
  const calRef = useRef(null)

  const fetchEvents = async (fetchInfo, success) => {
    try {
      const res = await api.get('/reservations', {
        params: { start: fetchInfo.startStr, end: fetchInfo.endStr, limit: 200 }
      })
      const data = res.data.data ?? res.data
      success(data.map(r => ({
        id: r.id,
        title: `${r.room_name} – ${r.doctor_name ?? r.user_name ?? ''}`,
        start: `${r.date}T${r.start_time}`,
        end: `${r.date}T${r.end_time}`,
        color: r.status === 'approved' ? '#4744e5' : r.status === 'rejected' ? '#ba1a1a' : '#6063ee',
        extendedProps: r,
      })))
    } catch { success([]) }
  }

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-extrabold text-[#171b2a]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Calendar</h1><p className="text-sm text-[#464555]">All reservations across all rooms</p></div>
      <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 p-6">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          events={fetchEvents}
          height="auto"
          eventDisplay="block"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          nowIndicator
        />
      </div>
    </div>
  )
}
